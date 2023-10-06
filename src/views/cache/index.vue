<script lang="ts" setup>
import { onMounted, ref } from 'vue'
import { Vector } from 'p5'
import Stats from 'stats.js'
import colors from 'nice-color-palettes'
import { getBufferCanvas, initCanvas, random, randomRGB } from '@/utils'

/**
 * 离屏渲染：重建一个新的canvas，在其中绘制，最后使用drawImage绘制到主canvas
 * 其实这样优化感觉提升不大
 * 如果粒子图案本身不会改变，只是位置发生变化，应该在初始化时放到离屏canvas中，在update中使用drawImage更新位置
 * 这时候的粒子就是一张不会变化的图
 * 减少对canvas的使用对性能提高很大
 * 但是如果粒子每帧都会改变颜色等样式，也就是通过fillStyle或者lineWidth或strokeStyle，就不得不在每帧中调用canvas api去修改
 * 这种方式即使使用了离屏渲染，提升也不大
 * 所以还是要通过修改代码结构的方式，尽量降低对canvas状态的修改
 */
const con = ref<HTMLElement>()
const useCache = true
const particleCount = 100

const palettes = random(colors)

onMounted(() => {
  const stats = new Stats()
  document.body.appendChild(stats.dom)

  const { width, height } = con.value!.getBoundingClientRect()
  const ctx = initCanvas(con.value!, {
    width,
    height,
  })
  const bufferCtx = getBufferCanvas({ width, height })
  const useCtx = useCache ? bufferCtx : ctx
  const particles: Particle[] = []

  class Particle {
    pos: Vector
    vel: Vector
    color: string
    constructor() {
      const velBase = 10
      this.pos = new Vector(random(width), random(height))
      this.vel = new Vector(random(-1, 1) * velBase, random(-1, 1) * velBase)
      this.color = randomRGB()
    }

    draw() {
      for (let i = 4; i >= 0; i--) {
        useCtx.beginPath()
        useCtx.fillStyle = palettes[i]
        useCtx.arc(this.pos.x, this.pos.y, i * 10, 0, Math.PI * 2)
        useCtx.fill()
      }
    }

    update() {
      this.pos.add(this.vel)
      if (this.pos.x <= 0 || this.pos.x >= width)
        this.vel.mult([-1, 1])

      if (this.pos.y <= 0 || this.pos.y >= height)
        this.vel.mult([1, -1])
    }
  }

  function initParticle() {
    for (let i = 0; i < particleCount; i++) {
      const p = new Particle()
      particles.push(p)
    }
  }
  function updateParticle() {
    particles.forEach((p) => {
      p.update()
      p.draw()
    })

    if (useCache)
      ctx.drawImage(bufferCtx.canvas, 0, 0)
  }

  function clearCanvas() {
    const grad = useCtx.createRadialGradient(width / 2, height / 2, 0, width / 2, height / 2, Math.min(width, height))
    grad.addColorStop(0, 'rgba(0,0,0,0.5)')
    grad.addColorStop(1, 'rgba(0,0,0,1)')
    useCtx.fillStyle = grad
    useCtx.fillRect(0, 0, width, height)
  }

  function animate() {
    stats.begin()
    clearCanvas()

    updateParticle()

    stats.end()
    requestAnimationFrame(animate)
  }

  initParticle()
  animate()
})
</script>

<template>
  <div ref="con" class="h-100vh w-full grid place-items-center" />
</template>

<style lang='less' scoped>
.view-con{}
</style>
