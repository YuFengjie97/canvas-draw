<script lang="ts" setup>
import { onMounted, ref } from 'vue'
import Stats from 'stats.js'
import { Vector } from 'p5'

import { Noise } from 'noisejs'
import { initCanvas, map } from '@/utils'

const con = ref<HTMLElement>()
const stats = new Stats()
document.body.appendChild(stats.dom)

const hueRange = [0, 340]

onMounted(() => {
  const conEl = con.value as HTMLElement
  const { width, height } = conEl.getBoundingClientRect()
  const ctx = initCanvas(conEl, { width, height })

  const noise = new Noise(Math.floor(Math.random() * 10000))

  const lineWidth = 10
  const cellSize = 30
  const lineLen = lineWidth * 10
  const rows = Math.ceil(height / cellSize)
  const cols = Math.ceil(width / cellSize)
  const cells: Cell[] = []

  ctx.lineCap = 'round'
  ctx.lineWidth = lineWidth

  let min = 0
  let max = 0

  class Cell {
    end = new Vector(0, 0)
    pos: Vector
    hue = 0
    xOff = 0
    yOff = 0
    zOff = 0
    constructor(pos: Vector) {
      this.pos = pos
      this.xOff = pos.x * 0.001
      this.yOff = pos.y * 0.001
      this.zOff = this.xOff + this.yOff
    }

    draw() {
      ctx.beginPath()
      ctx.moveTo(this.pos.x, this.pos.y)
      ctx.lineTo(this.end.x, this.end.y)
      ctx.strokeStyle = this.getColor()
      ctx.stroke()
    }

    getColor() {
      this.hue = Math.floor(map(this.getNoiseXYZ(), -1, 1, hueRange[0], hueRange[1]))

      min = this.hue < min ? this.hue : min
      max = this.hue > max ? this.hue : max

      const grad = ctx.createLinearGradient(this.pos.x, this.pos.y, this.end.x, this.end.y)
      grad.addColorStop(0, `hsla(${this.hue}, 100%, 50%, 0)`)
      grad.addColorStop(1, `hsla(${this.hue}, 100%, 50%, 1)`)
      return grad
    }

    getNoiseXYZ() {
      return noise.simplex3(this.xOff, this.yOff, this.zOff)
    }

    update() {
      const n = this.getNoiseXYZ()
      const a = map(n, -1, 1, 0, Math.PI * 4)
      const len = map(n, -1, 1, 0.1, lineLen)

      this.end = this.pos.copy().add(Vector.fromAngle(a, len))
      this.xOff += 0.001
      this.yOff += 0.001
      this.zOff += 0.01
    }
  }

  function initCells() {
    for (let i = 0; i < cols; i++) {
      for (let j = 0; j < rows; j++)
        cells.push(new Cell(new Vector(i * cellSize, j * cellSize)))
    }
  }

  function animate() {
    stats.update()

    ctx.clearRect(0, 0, width, height)
    ctx.fillStyle = 'rgba(0,0,0,1)'
    ctx.fillRect(0, 0, width, height)
    cells.forEach((c) => {
      c.update()
      c.draw()
    })

    requestAnimationFrame(animate)
  }

  initCells()
  animate()
})
</script>

<template>
  <div ref="con" class="h-100vh w-full" />
</template>

<style lang='less' scoped>
.view-con{
  color: hsl(96, 100%, 50%);
}
</style>
