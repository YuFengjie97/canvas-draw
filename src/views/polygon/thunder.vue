<script lang="ts" setup>
import { Vector } from 'p5'
import { createNoise2D } from 'simplex-noise'
import { onMounted, ref } from 'vue'
import Stats from 'stats.js'
import { map, random } from '@/utils'

const stats = new Stats()
document.body.appendChild(stats.dom)

const mfloor = Math.floor

let width = 0
let height = 0
const con = ref<HTMLElement>()
const canvas = ref<HTMLCanvasElement>()
const noise2D = createNoise2D()

let t = 0

const lenRang = [4, 15] // 单段闪电长度范围
const levelMax = 2 // 闪电分支最大层
const growProb = 0.5 // 闪电会产生分支的概率
const lineWidthRange = [2, 6]
const pointNumRange = [30, 50] // 雷电生成节点数量范围
type BranchType = 'l' | 'm' | 'r'
// 闪电延申角度范围
const angleRange: {
  [k in BranchType]: number[]
} = {
  l: [deg(90), deg(180)],
  m: [deg(0), deg(180)],
  r: [deg(0), deg(90)],
}

function deg(v: number) {
  return Math.PI / 180 * v
}

onMounted(() => {
  const { width: w, height: h } = con.value!.getBoundingClientRect()
  canvas.value!.width = w
  canvas.value!.height = h
  width = w
  height = h

  const ctx = canvas.value!.getContext('2d')!
  ctx.fillStyle = '#000'
  ctx.fillRect(0, 0, width, height)
  ctx.lineJoin = 'round'

  class Thunder {
    hue: number
    pointNum: number // 雷电节点数(不包括继承的父雷电的节点数)
    points: Vector[] = [new Vector(width / 2, 0)]
    lenOff = random(10, 20)
    lenInc = random(5, 10)
    angleOff = random(10, 20)
    angleInc = random(5, 10)
    lineWidth: number
    level: number
    childs: Thunder[] = []
    parent: Thunder | null = null
    branchType: BranchType
    length: number = 0
    tOff: number

    constructor(parent: Thunder | null, branchType: BranchType) {
      this.branchType = branchType
      this.hue = parent ? parent.hue : mfloor(random(360))
      this.level = parent ? parent.level + 1 : 1
      this.parent = parent
      this.pointNum = parent ? mfloor(parent.pointNum / this.level) : mfloor(random(pointNumRange[0], pointNumRange[1]))
      this.lineWidth = parent ? parent.lineWidth / this.level : random(lineWidthRange[0], lineWidthRange[1])
      this.tOff = random(100, 400)
      // 分支闪电继承节点
      if (parent)
        this.points.push(...parent.points)

      // 生成节点
      for (let i = this.parent ? this.points.length : 1; i < (this.parent ? this.parent.points.length : 0) + this.pointNum; i++) {
        const lastPoint = this.points[i - 1]
        this.angleOff += this.angleInc
        this.lenOff += this.lenInc

        const len = map(noise2D(this.lenOff, this.lenOff), -1, 1, lenRang[0], lenRang[1])
        const angle = map(noise2D(this.angleOff, this.angleOff), -1, 1, angleRange[this.branchType][0], angleRange[this.branchType][1])
        const p = Vector.fromAngle(angle, len).add(lastPoint)
        this.points.push(p)
        this.length += len

        // 是否生成子分支雷电
        if (this.level < levelMax && random() < growProb / this.level) {
          const child = new Thunder(this, 'l')
          this.childs.push(child)
        }
        if (this.level < levelMax && random() < growProb / this.level) {
          const child = new Thunder(this, 'r')
          this.childs.push(child)
        }
      }
    }

    draw() {
      ctx.save()
      ctx.beginPath()
      ctx.setLineDash([this.tOff + t, 4000])
      const hsl = `hsl(${this.hue},100%, 50%)`
      ctx.strokeStyle = hsl
      ctx.moveTo(this.points[0].x, this.points[0].y)

      ctx.lineWidth = this.lineWidth
      // ctx.shadowColor = `hsla(${this.hue},100%,50%,0.8)`
      // ctx.shadowBlur = this.lineWidth * 2

      for (let i = 1; i < this.points.length; i++)
        ctx.lineTo(this.points[i].x, this.points[i].y)

      ctx.stroke()
      ctx.restore()

      this.childs.forEach((c) => {
        c.draw()
      })
    }
  }

  let thunder: Thunder | null = null

  canvas.value?.addEventListener('click', () => {
    t = 0
    ctx.fillStyle = '#000'
    ctx.fillRect(0, 0, width, height)

    thunder = new Thunder(null, 'm')
  })

  function animate() {
    t += 10
    stats.update()
    if (thunder !== null)
      thunder.draw()

    requestAnimationFrame(animate)
  }
  animate()
})
</script>

<template>
  <div ref="con" class="h-100vh grid place-items-center">
    <canvas ref="canvas" title="click me" />
  </div>
</template>

<style lang='less' scoped>
canvas {
  box-shadow: 0 0 4px #333;
}
</style>
