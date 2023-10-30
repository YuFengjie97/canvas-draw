<script lang="ts" setup>
import { Vector } from 'p5'
import { onMounted, ref } from 'vue'
import { createNoise2D } from 'simplex-noise'
import { map, random } from '@/utils'

const mfloor = Math.floor
const frandom = (...args: any[]) => mfloor(random(...args))

const con = ref<HTMLElement>()
const canvas = ref<HTMLCanvasElement>()
const lineNum = 10
const pointNum = 40
const xNorRange = [0, 4] // x归一化程度
const hueRange = 4

const noise2D = createNoise2D()

onMounted(() => {
  const { width, height } = con.value!.getBoundingClientRect()
  canvas.value!.width = width
  canvas.value!.height = height
  const ctx = canvas.value!.getContext('2d')!
  ctx.fillStyle = '#000'
  ctx.fillRect(0, 0, width, height)
  ctx.lineJoin = 'round'

  class Line {
    off: number = 0
    inc: number = 0.01
    points: Vector[] = []
    hue: number = 0
    lineWidth: number
    yRange: number
    constructor(hue: number, lineWidth: number, inc: number, yRange: number) {
      this.hue = hue
      this.yRange = yRange
      this.off = frandom(0, 1)
      this.inc = inc
      this.lineWidth = lineWidth

      for (let i = 0; i < pointNum; i++) {
        const x = map(i, 0, pointNum - 1, 0, width)
        const y = height / 2
        this.points.push(new Vector(x, y))
      }
    }

    draw() {
      ctx.beginPath()
      ctx.moveTo(this.points[0].x, this.points[0].y)
      for (let i = 1; i < pointNum; i++) {
        const p = this.points[i]
        ctx.lineTo(p.x, p.y)
      }
      ctx.lineWidth = this.lineWidth
      ctx.strokeStyle = `hsl(${this.hue},100%,50%)`
      ctx.shadowColor = `hsla(${this.hue},100%,50%,1)`
      ctx.shadowBlur = this.lineWidth
      ctx.stroke()
    }

    update() {
      this.off += this.inc
      this.points.forEach((p) => {
        const xNor = map(p.x, 0, width, xNorRange[0], xNorRange[1])
        const yR = [height / 2 - this.yRange, height / 2 + this.yRange] as [number, number]
        const y = map(noise2D(xNor, this.off), -1, 1, ...yR)
        p.y = y
      })
    }
  }

  class Electricity {
    lines: Line[] = []
    constructor(hue: number, lineWidth: number) {
      for (let i = 0; i < lineNum; i++) {
        const lw = frandom(lineWidth)
        const h = mfloor(map(lw, 0, lineWidth, hue - hueRange, hue + hueRange))
        const inc = 0.2 - map(lw, 0, lineWidth, 0.05, 0.2)
        const yR = 80 - map(lw, 0, lineWidth, 10, 80)
        const l = new Line(h, lw, inc, yR)
        this.lines.push(l)
      }
    }

    update() {
      this.lines.forEach(l => l.update())
    }

    draw() {
      this.lines.forEach(l => l.draw())
    }
  }

  // const elec = new Electricity(186, 20)
  const elec = new Electricity(frandom(360), 20)

  ;(function animate() {
    ctx.fillStyle = '#000'
    ctx.fillRect(0, 0, width, height)
    elec.update()
    elec.draw()
    requestAnimationFrame(animate)
  }())
})
</script>

<template>
  <div ref="con" class="h-100vh grid place-items-center">
    <canvas ref="canvas" class="block" />
  </div>
</template>

<style lang='less' scoped>
</style>
