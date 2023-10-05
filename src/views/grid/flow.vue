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
const W = 400
const H = 400
const cellSize = 40
const rows = Math.floor(W / cellSize)
const cols = Math.floor(H / cellSize)
const particleCount = 100

const palettes = random(colors)

const cells: Cell[] = []

class Cell {
  u: number
  v: number
  pos = new Vector(0, 0)
  vel = new Vector(0, 0)
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
    this.xOff = u * 0.3
    this.yOff = v * 1.4
    this.color = palettes[Math.floor(lerp(0, palettes.length, noise(x, y)))]
  }

  draw() {
    const c = ctx as CanvasRenderingContext2D
    c.save()
    c.beginPath()

    // c.strokeStyle = '#000'
    // c.strokeRect(this.pos.x, this.pos.y, cellSize, cellSize)
    // c.stroke()
    // c.fillStyle = this.color
    // c.fillRect(this.pos.x, this.pos.y, cellSize, cellSize)

    // this.drawArrow()
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
    this.xOff += 0.003
    this.yOff += 0.003
    const n = noise(this.xOff, this.yOff)
    this.a = lerp(0, Math.PI * 2, n)
    this.vel = Vector.fromAngle(this.a, 1)
  }
}

class Particle {
  pos = new Vector(0, 0)
  vel = new Vector(0, 0)
  color = '#000'
  r = 0
  constructor() {
    const { pos, vel } = this.getRandom()

    this.pos.set(pos)
    this.vel.set(vel)
  }

  draw() {
    const c = ctx as CanvasRenderingContext2D
    c.beginPath()
    c.fillStyle = this.color
    c.arc(this.pos.x, this.pos.y, this.r, 0, Math.PI * 2)
    c.fill()
  }

  update(vel: Vector, color: string, r: number) {
    if (this.isOutBound()) {
      this.reSet()
    }
    else {
      this.vel.set(vel)
      this.pos.add(this.vel)
      this.color = color
      this.r = r
    }
  }

  reSet() {
    const { pos, vel } = this.getRandom()
    this.pos.set(pos)
    this.vel.set(vel)

    this.r = 0
    this.color = '#000'
  }

  getRandom() {
    const velBase = 0.01
    const pos = new Vector(random(W), random(H))
    const vel = new Vector(random(velBase), random(velBase))
    return { pos, vel }
  }

  isOutBound() {
    return this.pos.x <= 0 || this.pos.x >= W || this.pos.y <= 0 || this.pos.y >= H
  }

  toString() {
    return `pos:${this.pos.toString()},vel:${this.vel.toString()}`
  }
}

function initCells() {
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

const particles: Particle[] = []
function initParticles() {
  for (let i = 0; i < particleCount; i += 1)
    particles.push(new Particle())
}

function updateParticles() {
  particles.forEach((p) => {
    if (p.isOutBound()) {
      p.reSet()
    }
    else {
      const { pos } = p
      const cellInd = Math.floor(pos.y / cellSize) * cols + Math.floor(pos.x / cellSize)

      const cell = cells[cellInd]
      const r = lerp(0, 10, noise(cell.xOff + 500, cell.yOff + 500))
      p.update(cell.vel, cell.color, r)
      p.draw()
    }
  })
}

function animate() {
  stats.begin()

  ctx!.fillStyle = '#fff'
  // ctx!.clearRect(0, 0, W, H)
  ctx!.fillStyle = 'rgba(100,100,100,0.2)'
  ctx!.fillRect(0, 0, W, H)
  updateCells()

  updateParticles()

  stats.end()
  requestAnimationFrame(animate)
}

onMounted(() => {
  ctx = canvas.value!.getContext('2d')
  canvas.value!.style.cssText = `
    width: ${W}px;
    height: ${H}px;
  `
  canvas.value!.width = W
  canvas.value!.height = H

  initCells()
  initParticles()
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
  box-shadow: 0 0 4px #333;
}
</style>
