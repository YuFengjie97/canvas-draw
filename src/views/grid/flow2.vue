<script lang="ts" setup>
import { onMounted, ref } from 'vue'
import Stats from 'stats.js'
import { Vector } from 'p5'
import * as dat from 'dat.gui'

import { Noise } from 'noisejs'
import { getBufferCanvas, map } from '@/utils'

const con = ref<HTMLElement>()
const canvas = ref<HTMLCanvasElement>()
const stats = new Stats()
document.body.appendChild(stats.dom)
let hueBase = 300
let hueRange = 360
let lineWidth = 10
let cellSize = 30
let lineLen = lineWidth * 10
let width = 0
let height = 0
let ctx: CanvasRenderingContext2D
let bufferCtx: CanvasRenderingContext2D
let rows = 0
let cols = 0
let isSimplex = true
let xInc = 0.001
let yInc = 0.001
let zInc = 0.01
let isGlow = false

const ui = {
  hueBase,
  hueRange,
  lineWidth,
  cellSize,
  lineLen,
  isSimplex,
  xInc,
  yInc,
  zInc,
  isGlow,
}

onMounted(() => {
  function init() {
    const { width: w, height: h } = con.value!.getBoundingClientRect()
    width = w
    height = h
    bufferCtx = getBufferCanvas({
      width,
      height,
    })

    canvas.value!.width = w
    canvas.value!.height = h
    ctx = canvas.value!.getContext('2d')!
    rows = Math.ceil(h / cellSize)
    cols = Math.ceil(w / cellSize)

    bufferCtx.lineCap = 'round'
    bufferCtx.lineWidth = lineWidth
  }
  init()

  const cells: Cell[] = []
  const noise = new Noise(Math.floor(Math.random() * 10000))

  function windowResize() {
    let timer: null | NodeJS.Timeout = null
    return () => {
      if (timer)
        clearTimeout(timer)

      timer = setTimeout(() => {
        init()
        cells.length = 0
        initCells()
      }, 700)
    }
  }
  window.addEventListener('resize', windowResize())

  function initUi() {
    const panel = new dat.GUI({ width: 300 })
    panel.add(ui, 'hueBase', 1, 360, 1).onChange(val => hueBase = val)
    panel.add(ui, 'hueRange', 1, 360, 1).onChange(val => hueRange = val)
    panel.add(ui, 'isGlow').onChange(val => isGlow = val)

    panel.add(ui, 'isSimplex').name('Simplex3/Perlin3').onChange(val => isSimplex = val)
    panel.add(ui, 'cellSize', 10, 60, 1).onChange((val) => {
      cellSize = val
      cells.length = 0
      rows = Math.ceil(height / cellSize)
      cols = Math.ceil(width / cellSize)
      initCells()
    })
    panel.add(ui, 'lineWidth', 1, 20, 1).onChange((val) => {
      lineWidth = val
      ctx.lineWidth = lineWidth
    })
    panel.add(ui, 'lineLen', 1, 200, 1).onChange(val => lineLen = val)
    panel.add(ui, 'xInc', 0.001, 0.01, 0.001).onChange(val => xInc = val)
    panel.add(ui, 'yInc', 0.001, 0.01, 0.001).onChange(val => yInc = val)
    panel.add(ui, 'zInc', 0.01, 0.1, 0.01).onChange(val => zInc = val)
  }
  initUi()

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
      bufferCtx.beginPath()
      bufferCtx.moveTo(this.pos.x, this.pos.y)
      bufferCtx.lineTo(this.end.x, this.end.y)
      const { hsl, grad } = this.getColor()
      bufferCtx.strokeStyle = grad
      if (isGlow) {
        bufferCtx.shadowColor = hsl
        bufferCtx.shadowBlur = lineWidth / 2
      }
      else {
        bufferCtx.shadowBlur = 0
      }
      bufferCtx.stroke()
    }

    getColor() {
      this.hue = Math.floor(map(this.getNoiseXYZ(), -1, 1, hueBase - hueRange, hueBase + hueRange))

      const grad = bufferCtx.createLinearGradient(this.pos.x, this.pos.y, this.end.x, this.end.y)
      grad.addColorStop(0, `hsla(${this.hue}, 100%, 50%, 0)`)
      grad.addColorStop(1, `hsla(${this.hue}, 100%, 50%, 1)`)
      return {
        hsl: `hsla(${this.hue}, 100%, 50%, 1)`,
        grad,
      }
    }

    getNoiseXYZ() {
      if (isSimplex)
        return noise.simplex3(this.xOff, this.yOff, this.zOff)

      return noise.perlin3(this.xOff, this.yOff, this.zOff)
    }

    update() {
      const n = this.getNoiseXYZ()
      const a = map(n, -1, 1, 0, Math.PI * 4)
      const len = map(n, -1, 1, 0.1, lineLen)

      this.end = this.pos.copy().add(Vector.fromAngle(a, len))
      this.xOff += xInc
      this.yOff += yInc
      this.zOff += zInc
    }
  }

  function initCells() {
    for (let i = 0; i < cols; i++) {
      for (let j = 0; j < rows; j++)
        cells.push(new Cell(new Vector(i * cellSize, j * cellSize)))
    }
  }

  const bgFillStyle = 'rgba(0,0,0,1)'
  function animate() {
    stats.update()

    ctx.fillStyle = bgFillStyle
    ctx.fillRect(0, 0, width, height)
    bufferCtx.fillStyle = bgFillStyle
    bufferCtx.fillRect(0, 0, width, height)

    cells.forEach((c) => {
      c.update()
      c.draw()
    })

    ctx.drawImage(bufferCtx.canvas, 0, 0)

    requestAnimationFrame(animate)
  }

  initCells()
  animate()
})
</script>

<template>
  <div ref="con" class="h-100vh w-full">
    <canvas ref="canvas" class="h-full w-full block" />
  </div>
</template>

<style lang='less' scoped>
</style>
