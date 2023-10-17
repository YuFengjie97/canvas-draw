<script lang="ts" setup>
import { onMounted, ref } from 'vue'
import { Vector } from 'p5'
import { initCanvas } from '@/utils'
import hand from '@/assets/img/xRay/hand-xray-flesh.jpg'
import hand_xray from '@/assets/img/xRay/hand-xray-bone.jpg'

const con = ref<HTMLElement>()
const width = 800
const height = 400
const mouse = new Vector(300, 300)

function loadImg(url: string): Promise<HTMLImageElement> {
  return new Promise((resolve) => {
    const img = new Image()
    img.src = url
    img.onload = () => resolve(img)
  })
}

function getD(img: HTMLImageElement) {
  const { width: imgW, height: imgH } = img
  const scale = Math.max(width / imgW, height / imgH)
  return {
    dx: imgW * scale,
    dy: imgH * scale,
  }
}

onMounted(async () => {
  const ctx = initCanvas(con.value!, {
    width,
    height,
  })
  const { x, y } = ctx.canvas.getBoundingClientRect()

  const img = await loadImg(hand)
  const imgXray = await loadImg(hand_xray)

  const { dx, dy } = getD(img)

  const xRadius = 100 // x-ray radius
  const lineWidth = 8

  ctx.lineWidth = lineWidth
  ctx.strokeStyle = 'red'
  ctx.canvas.addEventListener('mousemove', (e) => {
    const { clientX, clientY } = e
    mouse.set(clientX - x, clientY - y)
  })

  function animate() {
    ctx.clearRect(0, 0, width, height)

    ctx.save()
    ctx.drawImage(img, 0, 0, dx, dy)

    const path = new Path2D()
    path.arc(mouse.x, mouse.y, xRadius, 0, Math.PI * 2)
    ctx.clip(path)

    ctx.drawImage(imgXray, 0, 0, dx, dy)
    ctx.beginPath()
    ctx.arc(mouse.x, mouse.y, xRadius - lineWidth / 2, 0, Math.PI * 2)
    ctx.stroke()
    ctx.restore()
    requestAnimationFrame(animate)
  }

  animate()
})
</script>

<template>
  <div ref="con" class="h-100vh w-full grid place-items-center" />
</template>

<style lang='less' scoped>
</style>
