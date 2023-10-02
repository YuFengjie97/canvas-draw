<script lang="ts" setup>
import { onMounted, ref } from 'vue'
import { Vector } from 'p5'
import { random, randomRGB } from '@/utils'

const con = ref<HTMLElement>()

const canvas = ref<HTMLCanvasElement>()
let ctx: CanvasRenderingContext2D | null = null
const polygons: Polygon[] = []

class Polygon {
  points: Vector[]
  strokeWidth: number
  strokeColor: string
  solidLen: number = 0
  solidSum: number = 0
  destroyed = false
  startDash = false // 开始消失
  constructor(points: Vector[]) {
    this.points = points
    this.strokeColor = randomRGB()
    this.strokeWidth = 20
    this.getLength()
    setTimeout(() => {
      this.startDash = true
    }, 1000)
  }

  getLength() {
    let len = 0
    for (let i = 1; i < this.points.length; i += 1) {
      const vPre = this.points[i - 1]
      const vCur = this.points[i]
      len += Vector.dist(vPre, vCur)
    }
    len += Vector.dist(this.points[0], this.points[this.points.length - 1])
    this.solidLen = this.solidSum = len
  }

  draw() {
    if (this.solidLen <= 0)
      return
    const c = ctx as CanvasRenderingContext2D
    c.save()
    c.beginPath()

    if (this.startDash)
      c.setLineDash([this.solidLen, this.solidSum - this.solidLen])

    this.points.forEach((p, i) => {
      if (i === 0)
        c.moveTo(p.x, p.y)

      else
        c.lineTo(p.x, p.y)
    })

    c.closePath()

    c.strokeStyle = this.strokeColor
    c.lineWidth = this.strokeWidth
    c.stroke()
    c.restore()
  }

  update() {
    if (!this.startDash)
      return
    if (this.solidLen > 0)
      this.solidLen -= 10
    else
      this.destroyed = true
  }
}

function setupCanvas() {
  const { width, height } = con.value!.getBoundingClientRect()
  ctx = canvas.value!.getContext('2d')!
  canvas.value!.width = width
  canvas.value!.height = height
}

function animate(cb: () => void) {
  cb()
  window.requestAnimationFrame(() => {
    animate(cb)
  })
}

function clickCanvas() {
  const points = []
  const { clientWidth, clientHeight } = ctx!.canvas
  for (let i = 0; i < 4; i += 1) {
    const p = new Vector(random(clientWidth), random(clientHeight))
    points.push(p)
  }
  const p = new Polygon(points)
  polygons.push(p)
  console.log(polygons)
}

onMounted(() => {
  setupCanvas()
  animate(() => {
    ctx!.clearRect(0, 0, ctx!.canvas.clientWidth, ctx!.canvas.clientHeight)
    polygons.forEach((p, i) => {
      if (p.destroyed)
        polygons.splice(i, 1)
      p.update()
      p.draw()
    })
  })
})
</script>

<template>
  <div ref="con" class="h-100vh bg-#2d3436">
    <canvas ref="canvas" width="400" height="400" class="h-full w-full block" @click="clickCanvas" />
  </div>
</template>

<style lang='less'>
.p5Canvas {
  display: none;
}
</style>
