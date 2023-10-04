<script lang="ts" setup>
import { Vector } from 'p5'
import { onMounted, ref } from 'vue'
import colors from 'nice-color-palettes'
import Stats from 'stats.js'
import { lerp, noise, random } from '@/utils/p5'

const stats = new Stats()
document.body.appendChild(stats.dom)

const con = ref<HTMLElement>()
const canvas = ref<HTMLCanvasElement>()
let ctx: CanvasRenderingContext2D | null = null
let W = 0
let H = 0
const cellSize = 30

const palettes = random(colors)

const cells: Cell[] = []

class Cell {
  u: number
  v: number
  pos = new Vector(0, 0)
  vec = new Vector(0, 0)
  color: string
  xOff = 0
  yOff = 0
  a = 0
  constructor(u: number, v: number) {
    this.u = u
    this.v = v
    const x = lerp(0, W, u)
    const y = lerp(0, H, v)
    this.pos.set(x, y)
    this.xOff = x * 0.01
    this.yOff = y * 0.01
    this.color = palettes[Math.floor(lerp(0, palettes.length, noise(x, y)))]
  }

  draw() {
    const c = ctx as CanvasRenderingContext2D
    c.save()
    c.beginPath()
    c.strokeStyle = '#000'
    c.strokeRect(this.pos.x, this.pos.y, cellSize, cellSize)
    // c.fillStyle = this.color
    // c.fillRect(this.pos.x, this.pos.y, cellSize, cellSize)
    c.stroke()

    this.drawArrow()
    c.restore()
  }

  drawArrow() {
    const c = ctx as CanvasRenderingContext2D
    c.save()
    c.font = '28px Arial bolder'
    c.fillStyle = this.color
    c.textBaseline = 'middle'
    c.translate(this.pos.x, this.pos.y)
    c.rotate(this.a)
    c.fillText('→', 0, 0)
    c.restore()
  }

  update() {
    this.xOff += 0.004
    this.yOff += 0.004
    const n = noise(this.xOff, this.yOff)
    this.a = lerp(0, Math.PI * 2, n)
    this.vec = Vector.fromAngle(this.a, 1)
  }
}

function initCells() {
  const rows = Math.floor(H / cellSize)
  const cols = Math.floor(W / cellSize)
  for (let col = 0; col < cols; col++) {
    for (let row = 0; row < rows; row++) {
      const u = col / cols
      const v = row / rows
      cells.push(new Cell(u, v))
    }
  }
}

function updateCells() {
  cells.forEach((c) => {
    c.update()
    c.draw()
  })
}

function animate() {
  stats.begin()

  ctx!.fillStyle = '#fff'
  ctx!.fillRect(0, 0, W, H)
  updateCells()

  stats.end()
  requestAnimationFrame(animate)
}

onMounted(() => {
  ctx = canvas.value!.getContext('2d')
  // 铺满屏幕
  // const { width, height } = con.value!.getBoundingClientRect()
  const width = 400
  const height = 400
  canvas.value!.style.cssText = `
    width: ${width}px;
    height: ${height}px;
  `
  W = width
  H = height
  canvas.value!.width = W
  canvas.value!.height = H

  initCells()
  animate()
})
</script>

<template>
  <div ref="con" class="h-100vh w-full grid place-items-center">
    <canvas ref="canvas" />
  </div>
</template>

<style lang='less'>
.p5Canvas{
  display: none;
}
canvas{
  display: block;
}
</style>
