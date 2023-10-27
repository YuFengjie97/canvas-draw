<script lang="ts" setup>
import { Vector } from 'p5'
import { createNoise2D } from 'simplex-noise'
import { onMounted, ref } from 'vue'
import { map, random } from '@/utils'

const mfloor = Math.floor

let width = 0
let height = 0
const con = ref<HTMLElement>()
const canvas = ref<HTMLCanvasElement>()
const noise2D = createNoise2D()

const lenRang = [4, 30] // 单段闪电长度范围
const angleRange = [deg(30), deg(150)] // 闪电延申角度范围
const levelMax = 4 // 闪电分支最大层
const growProb = 0.4 // 闪电会产生分支的概率
const lineWidthRange = [4, 10]
const pointNumRange = [40, 50] // 雷电生成节点数量范围

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

    constructor(parent: Thunder | null) {
      this.hue = parent ? parent.hue : mfloor(random(360))
      this.level = parent ? parent.level + 1 : 1
      this.parent = parent
      this.pointNum = parent ? mfloor(parent.pointNum / this.level) : mfloor(random(pointNumRange[0], pointNumRange[1]))
      this.lineWidth = parent ? parent.lineWidth / this.level : random(lineWidthRange[0], lineWidthRange[1])

      // 分支闪电继承节点
      if (parent)
        this.points.push(...parent.points)

      // 生成节点
      for (let i = this.parent ? this.points.length : 1; i < (this.parent ? this.parent.points.length : 0) + this.pointNum; i++) {
        const lastPoint = this.points[i - 1]
        this.angleOff += this.angleInc
        this.lenOff += this.lenInc

        const len = map(noise2D(this.lenOff, this.lenOff), -1, 1, lenRang[0], lenRang[1])
        const angle = map(noise2D(this.angleOff, this.angleOff), -1, 1, angleRange[0], angleRange[1])
        const p = Vector.fromAngle(angle, len).add(lastPoint)
        this.points.push(p)

        if (this.level < levelMax && random() < growProb / this.level) {
          const child = new Thunder(this)
          this.childs.push(child)
        }
      }
    }

    draw() {
      ctx.save()
      ctx.beginPath()
      const hsl = `hsl(${this.hue},100%, 50%)`
      ctx.strokeStyle = hsl
      ctx.moveTo(this.points[0].x, this.points[0].y)

      ctx.lineWidth = this.lineWidth
      ctx.shadowColor = `hsla(${this.hue},100%,50%,0.8)`
      // ctx.shadowBlur = this.lineWidth * 2

      for (let i = 1; i < this.points.length; i++) {
        ctx.lineTo(this.points[i].x, this.points[i].y)
        if (i === this.pointNum - 1) {
          const lastPoint = this.points[i - 1]
          const point = this.points[i]
          const linearGrad = ctx.createLinearGradient(lastPoint.x, lastPoint.y, point.x, point.y)
          linearGrad.addColorStop(0, hsl)
          linearGrad.addColorStop(1, 'transparent')
          ctx.strokeStyle = linearGrad
        }
      }

      ctx.stroke()
      ctx.restore()

      this.childs.forEach((c) => {
        c.draw()
      })
    }
  }

  canvas.value?.addEventListener('click', () => {
    ctx.fillStyle = '#000'
    ctx.fillRect(0, 0, width, height)

    const thunder = new Thunder(null)

    thunder.draw()
  })
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
