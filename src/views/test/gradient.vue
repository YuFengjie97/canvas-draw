<script lang="ts" setup>
import { Vector } from 'p5'
import { onMounted, ref } from 'vue'
import { random } from '@/utils'

const canvas = ref<HTMLCanvasElement>()

let canvasX = 0
let canvasY = 0
const mouse = { x: 0, y: 0 }
function mousemove(e: Event) {
  mouse.x = e.clientX - canvasX
  mouse.y = e.clientY - canvasY
}

onMounted(() => {
  const ctx = canvas.value!.getContext('2d') as CanvasRenderingContext2D
  const { x, y } = canvas.value!.getBoundingClientRect()
  canvasX = x
  canvasY = y

  ctx.moveTo(0, 0)
  ctx.bezierCurveTo(10, 10, 20, 20, 30, 30)
  ctx.strokeStyle = 'blue'
  ctx.stroke()

  ctx.clearRect(0, 0, 400, 400)
  // ctx.beginPath()
  ctx.moveTo(30, 30)
  ctx.strokeStyle = 'red'
  ctx.bezierCurveTo(40, 40, 100, 150, 60, 60)
  ctx.stroke()

  function animate(cb: () => void) {
    cb()
    requestAnimationFrame(() => animate(cb))
  }
})
</script>

<template>
  <div class="w-full h-100vh grid place-items-center">
    <canvas ref="canvas" width="400" height="400" class="w-400px h-400px" @mousemove="mousemove" />
  </div>
</template>

<style lang='less' scoped>
canvas{
  box-shadow: 0 0 4px #333;
}
</style>
