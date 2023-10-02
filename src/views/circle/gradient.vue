<script lang="ts" setup>
import { onMounted, ref } from 'vue'
import { divide, matrix, multiply, norm, random, subtract } from 'mathjs'
import type * as math from 'mathjs'
import { randomRGB } from '@/utils'

const con = ref<HTMLElement>()

const canvas = ref<HTMLCanvasElement>()
let ctx: CanvasRenderingContext2D | null = null

const circles: Circle[] = []

const mouse: {
  x: number
  y: number
} = {
  x: 0,
  y: 0,
}

interface circleOp {
  x: number
  y: number
  r: number
  borderWidth?: number
  borderColor?: string
  fill: string
  shadowColor?: string
  shadowBlur?: number
}

class Circle {
  x: number
  y: number
  r: number
  v: math.Matrix
  borderColor: string | null
  borderWidth: number | null
  fill: string
  shadowColor: string
  shadowBlur: number
  shadowOffsetX: number
  shadowOffsetY: number

  constructor(op: circleOp) {
    this.x = op.x
    this.y = op.y
    this.r = op.r
    this.fill = op.fill
    this.borderColor = op.borderColor ?? null
    this.borderWidth = op.borderWidth ?? null

    this.shadowColor = op.shadowColor ?? op.fill
    this.shadowBlur = op.shadowBlur ?? this.r
    this.shadowOffsetX = 0
    this.shadowOffsetY = 0

    this.v = matrix([random(-1, 1), random(-1, 1)])

    this.draw()
  }

  draw() {
    const c = ctx!
    c.beginPath()
    c.arc(this.x, this.y, this.r, 0, Math.PI * 2)

    if (this.borderColor && this.borderWidth) {
      c.lineWidth = this.borderWidth
      c.strokeStyle = this.borderColor
      c.stroke()
    }

    c.shadowColor = this.shadowColor
    c.shadowBlur = this.shadowBlur
    c.shadowOffsetX = this.shadowOffsetX
    c.shadowOffsetY = this.shadowOffsetY

    if (this.fill) {
      c.fillStyle = this.fill
      c.fill()
    }

    c.closePath()
  }

  update() {
    const vecMouse = matrix([mouse.x, mouse.y])
    const vecCenter = matrix([this.x, this.y])

    const vec = subtract(vecCenter, vecMouse)
    const len = norm(vec)
    const vecNorm = divide(vec, len) as math.Matrix
    const vecArr = vecNorm.toArray() as number[]

    this.shadowOffsetX = vecArr[0] * this.r * 0.6
    this.shadowOffsetY = vecArr[1] * this.r * 0.6

    console.log('-----', this.v)

    const r = multiply(this.v, [-1, -1])
    console.log(this.v, r)

    const vArr = this.v.toArray() as number[]
    this.x += vArr[0]
    this.y += vArr[1]

    // const { clientWidth, clientHeight } = ctx!.canvas
    // if (this.x - this.r <= 0 || this.x + this.r >= clientWidth)
    //   this.v = multiply(this.v, [-1, 1])

    // if (this.y - this.r <= 0 || this.y + this.r >= clientHeight)
    //   this.v = multiply(this.v, [1, -1])
  }
}

function setupCanvas() {
  const { width, height } = con.value!.getBoundingClientRect()
  ctx = canvas.value!.getContext('2d')!
  canvas.value!.width = width
  canvas.value!.height = height
}

function initCircle() {
  const { clientHeight, clientWidth } = ctx!.canvas
  for (let i = 0; i < 100; i += 1) {
    const circle = new Circle({
      x: random() * clientWidth,
      y: random() * clientHeight,
      r: random(4, 20),
      fill: randomRGB(),
    })

    circles.push(circle)
  }
}

function animate(cb: () => void) {
  cb()
  window.requestAnimationFrame(() => {
    animate(cb)
  })
}

function mouseListener() {
  canvas.value?.addEventListener('mousemove', (e) => {
    const { clientX, clientY } = e
    mouse.x = clientX
    mouse.y = clientY
  })
}

onMounted(() => {
  setupCanvas()
  initCircle()
  mouseListener()
  animate(() => {
    ctx!.clearRect(0, 0, ctx!.canvas.clientWidth, ctx!.canvas.clientHeight)
    circles.forEach((c) => {
      c.update()
      c.draw()
    })
  })
})
</script>

<template>
  <div ref="con" class="h-100vh bg-#2d3436">
    <canvas ref="canvas" width="400" height="400" class="h-full w-full block" />
  </div>
</template>

<style lang='less' scoped>
.view-con{}
</style>
