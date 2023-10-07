<script lang="ts" setup>
import { onMounted, ref } from 'vue'
import { Vector } from 'p5'
import Stats from 'stats.js'
import { getBufferCanvas, initCanvas, random, randomRGB } from '@/utils'

const con = ref<HTMLElement>()
const particleCount = 10
const stats = new Stats()
document.body.append(stats.dom)

onMounted(() => {
  const { width, height } = con.value!.getBoundingClientRect()
  const ctx = initCanvas(con.value!, { width, height })
  const particles: Particle[] = []

  class Particle {
    pos: Vector
    vel: Vector
    r: number
    color: string
    ctx: CanvasRenderingContext2D
    constructor() {
      const velBase = 10
      this.pos = new Vector(random(width), random(height))
      this.vel = new Vector(random(-1, 1) * velBase, random(-1, 1) * velBase)
      this.r = random(1, 10)
      this.color = randomRGB()
      this.ctx = getBufferCanvas()
      this.cache()
    }

    cache() {
      this.ctx.canvas.width = this.ctx.canvas.height = this.r * 2 // 非常重要
      this.ctx.beginPath()
      this.ctx.fillStyle = this.color
      this.ctx.arc(this.r, this.r, this.r, 0, Math.PI * 2)
      this.ctx.fill()
    }

    draw() {
      ctx.drawImage(this.ctx.canvas, this.pos.x, this.pos.y)
    }

    update() {
      this.pos.add(this.vel)
      if (this.pos.x <= 0 || this.pos.x >= width)
        this.vel.mult([-1, 1])

      if (this.pos.y <= 0 || this.pos.y >= height)
        this.vel.mult([1, -1])
    }
  }

  function init() {
    for (let i = 0; i < particleCount; i++)
      particles.push(new Particle())
  }
  function animate() {
    stats.update()
    ctx.fillStyle = 'rgba(100,100,0,0.3)'
    ctx.fillRect(0, 0, width, height)
    // ctx.clearRect(0, 0, width, height)
    particles.forEach((p) => {
      p.update()
      p.draw()
    })
    requestAnimationFrame(animate)
  }

  init()
  animate()
})
</script>

<template>
  <div ref="con" class="h-100vh w-full grid place-items-center" />
</template>

<style lang='less' scoped>
.view-con{}
</style>
