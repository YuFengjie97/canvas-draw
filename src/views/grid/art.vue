<script lang="ts" setup>
import { onMounted, ref } from 'vue'
import colors from 'nice-color-palettes'
import { initCanvas } from '@/utils/canvas'
import { lerp, noise, noiseSeed, random, randomSeed } from '@/utils/p5'

const con = ref()
let ctx: CanvasRenderingContext2D | null = null
const count = 20
const characters = '↑*c'.split('')
let nSeed = 1759
let rSeed = 1864

interface Point {
  u: number
  v: number
  show: boolean
  r: number // 半径
  a: number // 旋转角度
  color: any
  char: string
}

function makeRandom() {
  nSeed += Math.floor(Math.random() * 100)
  rSeed += Math.floor(Math.random() * 100)
  noiseSeed(nSeed)
  randomSeed(rSeed)
}

const points: Point[] = []
function initGrid() {
  const palettes = random(colors)

  points.length = 0
  for (let i = 0; i < count; i += 1) {
    for (let j = 0; j < count; j += 1) {
      const u = j / (count - 1)
      const v = i / (count - 1)
      const n = noise(u, v)
      points.push({
        u,
        v,
        show: true,
        r: lerp(0, 20, n),
        a: lerp(0, Math.PI * 2, n),
        color: random(palettes),
        // color: palettes[Math.floor(lerp(0, palettes.length, n))],
        char: random(characters),
      })
    }
  }
}

function draw() {
  const c = ctx as CanvasRenderingContext2D
  const { clientWidth: W, clientHeight: H } = c.canvas
  const margin = W * 0.05

  c.fillStyle = '#fff'
  c.fillRect(0, 0, W, H)

  points.forEach(({ u, v, char, show, color, r, a }) => {
    if (!show)
      return
    const x = lerp(margin, W - margin, u)
    const y = lerp(margin, H - margin, v)
    c.save()
    if (char === 'c') {
      c.beginPath()
      c.arc(x, y, r, 0, Math.PI * 2)
      c.fillStyle = color
      c.fill()
    }
    else {
      c.translate(x, y)
      c.rotate(a)

      c.font = `${20}px FiraCode bolder`
      c.fillStyle = color
      c.textAlign = 'center'
      c.textBaseline = 'middle'
      c.fillText(char, 0, 0)
      c.restore()
    }
  })
}

function reDraw() {
  makeRandom()
  initGrid()
  draw()
}

onMounted(() => {
  ctx = initCanvas(con.value)
  noiseSeed(nSeed)
  randomSeed(rSeed)
  initGrid()
  draw()
})

function downloadCanvas() {
  const a = document.createElement('a')
  a.href = ctx!.canvas.toDataURL('image/png')
  a.download = `rSeed_${rSeed}-nSeed_${nSeed}`
  a.click()
}
</script>

<template>
  <div ref="con" class="w-full h-100vh grid place-items-center" @click="reDraw">
    <div class="px-10px py-14px select-none color-#fff bg-blue fixed top-0 right-0 cursor-pointer" @click.stop="downloadCanvas">
      download
    </div>
  </div>
</template>

<style lang='less'>
.p5Canvas {
  display: none;
}
</style>
