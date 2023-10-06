<script lang="ts" setup>
import { onMounted, ref } from 'vue'
import { Vector } from 'p5'
import { noise } from '@/utils'

const { sin, cos } = Math

const con = ref<HTMLElement>()

const canvas = ref<HTMLCanvasElement>()
let ctx: CanvasRenderingContext2D | null = null

function setupCanvas() {
  const { width, height } = con.value!.getBoundingClientRect()
  ctx = canvas.value!.getContext('2d')!
  canvas.value!.width = width
  canvas.value!.height = height
}

class Line2 {
  start: Vector
  end: Vector
  control: Vector
  xOff: number = 0
  yOff: number = 10
  constructor(start: Vector, end: Vector) {
    this.start = start
    this.end = end
    this.control = new Vector(0, 0)
  }

  draw() {
    const c = ctx as CanvasRenderingContext2D
    c.beginPath()
    c.lineCap = 'round'
    c.moveTo(this.start.x, this.start.y)
    c.quadraticCurveTo(this.control.x, this.control.y, this.end.x, this.end.y)
    c.lineWidth = 4
    c.strokeStyle = 'red'
    c.stroke()
  }

  update() {
    this.xOff += 0.1
    this.yOff += 0.1
    const v = 200
    this.control.set(noise(sin(this.xOff)) * v, noise(cos(this.yOff)) * v)
  }
}

function animate(cb: () => void) {
  cb()
  window.requestAnimationFrame(() => {
    animate(cb)
  })
}
onMounted(() => {
  setupCanvas()

  const l = new Line2(new Vector(0, ctx!.canvas.clientHeight / 2), new Vector(ctx!.canvas.clientWidth, ctx!.canvas.clientHeight / 2))

  animate(() => {
    ctx!.clearRect(0, 0, ctx!.canvas.clientWidth, ctx!.canvas.clientHeight)
    l.update()
    l.draw()
  })
})
</script>

<template>
  <div ref="con" class="h-100vh bg-#2d3436">
    <canvas ref="canvas" width="400" height="400" class="h-full w-full block" />
  </div>
</template>

<style lang='less'>
.p5Canvas {
  display: none;
}
</style>
