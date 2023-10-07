<script lang="ts" setup>
import { Vector } from 'p5'
import { onMounted, ref } from 'vue'
import colors from 'nice-color-palettes'
import Stats from 'stats.js'
import { getBufferCanvas, lerp, map, noise, random } from '@/utils'

const stats = new Stats()
document.body.appendChild(stats.dom)

const con = ref<HTMLElement>()
const canvas = ref<HTMLCanvasElement>()
const cellSize = 30
const palettes = random(colors)
const showArrow = true
const particleCount = 1000

onMounted(() => {
  const { width, height } = con.value!.getBoundingClientRect()
  const ctx = initCanvas()
  const cells: Cell[] = []
  const rows = Math.ceil(height / cellSize)
  const cols = Math.ceil(width / cellSize)
  const particles: Particle[] = []

  function initCanvas() {
    const ctx = canvas.value!.getContext('2d')
    canvas.value!.width = width
    canvas.value!.height = height
    return ctx!
  }

  class Cell {
    pos = new Vector(0, 0)
    vel = new Vector(0, 0)
    xOff = 0
    yOff = 0
    a = 0
    bufferCtx: CanvasRenderingContext2D
    constructor(x: number, y: number) {
      this.bufferCtx = getBufferCanvas({
        width: cellSize,
        height: cellSize,
      })
      this.xOff = map(x, 0, 1, 0, width)
      this.yOff = map(y, 0, 1, 0, height)

      this.pos.set(x, y)
      this.cache()
    }

    draw() {
      if (showArrow)
        this.drawArrow()
    }

    cache() {
      this.bufferCtx.save()
      this.bufferCtx.font = '28px Arial bolder'
      this.bufferCtx.fillStyle = '#00cec9'
      this.bufferCtx.textAlign = 'center'
      this.bufferCtx.textBaseline = 'middle'
      this.bufferCtx.translate(cellSize / 2, cellSize / 2)
      this.bufferCtx.fillText('→', 0, 0)
      this.bufferCtx.restore()
    }

    drawCell() {
      ctx.beginPath()
      ctx.strokeStyle = 'red'
      ctx.strokeRect(this.pos.x, this.pos.y, cellSize, cellSize)
      ctx.stroke()
    }

    drawArrow() {
      ctx.save()
      ctx.translate(this.pos.x, this.pos.y)
      ctx.rotate(this.a)
      ctx.drawImage(this.bufferCtx.canvas, 0, 0, cellSize, cellSize)
      ctx.restore()
    }

    update() {
      this.xOff += 0.0005
      this.yOff += 0.0005
      const n = noise(this.xOff, this.yOff)
      this.a = lerp(0, Math.PI * 7, n)
      this.vel = Vector.fromAngle(this.a, lerp(1, 10, n))
    }
  }

  class Particle {
    pos = new Vector(0, 0)
    vel = new Vector(0, 0)
    color = '#000'
    r = 1
    r_cur = 0
    constructor() {
      const { pos, vel } = this.getRandom()
      this.color = random(palettes)

      this.pos.set(pos)
      this.vel.set(vel)
    }

    draw() {
      const c = ctx as CanvasRenderingContext2D
      c.beginPath()
      c.fillStyle = this.color
      c.arc(this.pos.x, this.pos.y, this.r_cur, 0, Math.PI * 2)
      c.fill()
    }

    update(vel: Vector) {
      if (this.isOutBound()) {
        this.reSet()
      }
      else {
        this.vel.set(vel)
        this.pos.add(this.vel)
      }
      if (this.r_cur <= this.r)
        this.r_cur += 0.1
    }

    reSet() {
      const { pos, vel } = this.getRandom()
      this.pos.set(pos)
      this.vel.set(vel)

      this.color = palettes[Math.floor(palettes.length * random())]
      this.r = Math.floor(random(1, 6))
      this.r_cur = 0
    }

    getRandom() {
      const velBase = 0.01
      const pos = new Vector(random(width), random(height))
      const vel = new Vector(random(velBase), random(velBase))
      return { pos, vel }
    }

    isOutBound() {
      return this.pos.x <= 0 || this.pos.x >= width || this.pos.y <= 0 || this.pos.y >= height
    }

    toString() {
      return `pos:${this.pos.toString()},vel:${this.vel.toString()}`
    }
  }

  function initCells() {
    for (let col = 0; col < cols; col++) {
      for (let row = 0; row < rows; row++)
        cells.push(new Cell(col * cellSize, row * cellSize))
    }
  }

  function updateCells() {
    cells.forEach((c) => {
      c.update()
      c.draw()
    })
  }

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
        p.update(cell.vel)
        p.draw()
      }
    })
  }

  function animate() {
    stats.update()

    // ctx!.fillStyle = '#fff'
    // ctx!.fillStyle = 'rgba(100,100,100,0.2)'
    // ctx!.fillRect(0, 0, width, height)
    ctx!.clearRect(0, 0, width, height)

    updateCells()
    updateParticles()

    requestAnimationFrame(animate)
  }

  initCells()
  initParticles()
  animate()
})
</script>

<template>
  <div ref="con" class="h-100vh w-full grid place-items-center">
    <canvas ref="canvas" class="h-full w-full" />
  </div>
</template>

<style lang='less'>
.p5Canvas{
  display: none;
}
canvas{
  display: block;
  box-shadow: 0 0 4px #333;
  background: #333;
}
</style>
