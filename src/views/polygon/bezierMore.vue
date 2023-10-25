<script lang="ts" setup>
import { onMounted, ref } from 'vue'
import { createNoise2D } from 'simplex-noise'
import { Vector } from 'p5'
import { map } from '@/utils'

const canvas = ref<HTMLCanvasElement>()
const width = 800
const height = 600
const noise2D = createNoise2D()
const points: Array<Vector> = []
const pointNum = 10

onMounted(() => {
  const ctx = canvas.value!.getContext('2d')!
  ctx.translate(0, height / 2)
  for (let i = 0; i < pointNum; i++) {
    const iNor = map(i, 0, pointNum - 1, 0, 1)
    const x = iNor * width
    const y = map(noise2D(iNor, iNor), -1, 1, -height / 2, height / 2)
    const p = new Vector(x, y)
    points.push(p)
  }

  points.forEach((p) => {
    ctx.beginPath()
    ctx.arc(p.x, p.y, 3, 0, Math.PI * 2)
    ctx.fill()
  })
  ctx.moveTo(points[0].x, points[0].y)
  for (let i = 2; i < pointNum - 1; i += 2) {
    const cp = points[i - 1]
    const p = points[i]
    ctx.quadraticCurveTo(cp.x, cp.y, p.x, p.y)
  }
  ctx.stroke()
})
</script>

<template>
  <div class="grid place-items-center h-100vh">
    <canvas ref="canvas" width="800" height="600" class="w-800px h-600px" />
  </div>
</template>

<style lang='less' scoped>
canvas{
  box-shadow: 0 0 4px #333;
}
</style>
