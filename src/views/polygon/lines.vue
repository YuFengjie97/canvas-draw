<script lang="ts" setup>
import { Vector } from 'p5'
import { onMounted, ref } from 'vue'
import { map } from '@/utils'

const width = 400
const height = 400
const gap = 0
const num = 5
const lineWidth = 40
const canvas = ref<HTMLCanvasElement>()

onMounted(() => {
  const ctx = canvas.value!.getContext('2d')!
  ctx.lineWidth = lineWidth
  ctx.shadowColor = '#000'
  ctx.shadowBlur = 10
  class Line {
    s: Vector
    e: Vector
    c: string
    constructor(s: Vector, e: Vector, c: string) {
      this.s = s
      this.e = e
      this.c = c
    }

    draw() {
      ctx.strokeStyle = this.c
      ctx.beginPath()
      ctx.moveTo(this.s.x, this.s.y)
      ctx.lineTo(this.e.x, this.e.y)
      ctx.stroke()
    }
  }
  const linesv: Array<Line> = []
  const linesh: Array<Line> = []
  const grid = new Path2D()

  function init() {
    for (let i = 0; i < num; i++) {
      const v = map(i, 0, num - 1, gap, width - gap)
      const h = map(i, 0, num - 1, gap, height - gap)
      const linev = new Line(new Vector(v, 0), new Vector(v, height), 'red')
      const lineh = new Line(new Vector(0, h), new Vector(width, h), 'blue')
      linesh.push(lineh)
      linesv.push(linev)
      for (let j = 0; j < num; j++) {
        const h = map(j, 0, num - 1, gap, height - gap)
        if ((i + j) % 2 === 0)
          grid.rect(v - lineWidth / 2, h - lineWidth / 2, lineWidth, lineWidth)
      }
    }
  }
  init()
  function draw() {
    // ctx.fillStyle = '#000'
    // ctx.fillRect(0, 0, width, height)
    linesv.forEach(l => l.draw())
    linesh.forEach(l => l.draw())

    ctx.clip(grid)
    linesv.forEach(l => l.draw())
  }
  draw()
})
</script>

<template>
  <div class="grid place-items-center h-100vh">
    <canvas ref="canvas" class="w-400px h-400px" width="400" height="400" />
  </div>
</template>

<style lang='less' scoped>
canvas{
  border: 8px gray outset;
}
</style>
