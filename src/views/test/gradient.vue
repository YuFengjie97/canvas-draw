<script lang="ts" setup>
import { onMounted, ref } from 'vue'

const canvas = ref<HTMLCanvasElement>()

onMounted(() => {
  const ctx = canvas.value!.getContext('2d') as CanvasRenderingContext2D

  const grad = ctx.createRadialGradient(200, 200, 0, 200, 200, 200)
  grad.addColorStop(0, 'rgba(0,0,0,0)')
  grad.addColorStop(0.25, 'rgba(0,0,0,0.25)')
  grad.addColorStop(0.5, 'rgba(0,0,0,0.5)')
  grad.addColorStop(0.75, 'rgba(0,0,0,0.75)')

  let x = 0
  let y = 0

  animate(() => {
    ctx.fillStyle = '#00b894'
    ctx.fillRect(0, 0, 400, 400)
    ctx.fillStyle = grad
    ctx.fillRect(0, 0, 400, 400)

    x += 1
    y += 10
    ctx.beginPath()
    ctx.fillStyle = 'red'
    ctx.arc(x, y, 4, 0, Math.PI * 2)
    ctx.fill()
  })

  function animate(cb: () => void) {
    cb()
    requestAnimationFrame(() => animate(cb))
  }
})
</script>

<template>
  <div class="w-full h-100vh grid place-items-center">
    <canvas ref="canvas" width="400" height="400" class="w-400px h-400px" />
  </div>
</template>

<style lang='less' scoped>
canvas{
  box-shadow: 0 0 4px #333;
}
</style>
