<script lang="ts" setup>
import { onMounted, ref } from 'vue'
import { Vector } from 'p5'
import { initCanvas } from '@/utils'
import img from '@/assets/img/xRay/1.jpg'
import imgReal from '@/assets/img/xRay/1_copy.jpg'

const con = ref<HTMLElement>()
const width = 600
const height = 600
const mouse = new Vector(300, 300)

function loadImg(url: string): Promise<HTMLImageElement> {
  return new Promise((resolve) => {
    const img = new Image()
    img.src = url
    img.onload = () => resolve(img)
  })
}

onMounted(async () => {
  const ctx = initCanvas(con.value!, {
    width,
    height,
  })
  const { x, y } = ctx.canvas.getBoundingClientRect()
  const imgObj = await loadImg(img)
  const imgObjReal = await loadImg(imgReal)
  ctx.lineWidth = 20
  ctx.strokeStyle = '#000'
  ctx.canvas.addEventListener('mousemove', (e) => {
    const { clientX, clientY } = e
    mouse.set(clientX - x, clientY - y)
  })

  function animate() {
    ctx.clearRect(0, 0, width, height)

    ctx.save()
    ctx.drawImage(imgObj, 0, 0)

    const path = new Path2D()
    path.arc(mouse.x, mouse.y, 200, 0, Math.PI * 2)
    ctx.clip(path)

    ctx.drawImage(imgObjReal, 0, 0)
    ctx.beginPath()
    ctx.arc(mouse.x, mouse.y, 190, 0, Math.PI * 2)
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
