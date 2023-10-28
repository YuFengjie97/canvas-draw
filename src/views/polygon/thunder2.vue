<script lang="ts" setup>
import { Vector } from 'p5'
import { onMounted, ref } from 'vue'
import { random } from '@/utils'

const mrandom = Math.random
const mfloor = Math.floor
const frandom = (...args: any[]) => mfloor(random(...args))

const con = ref<HTMLElement>()
const canvas = ref<HTMLCanvasElement>()

const pointNumRange = [100, 150]
const lineWidthRange = [4, 10]
const rInc = 0.001

onMounted(() => {
  const { width, height } = con.value!.getBoundingClientRect()
  canvas.value!.width = width
  canvas.value!.height = height
  const ctx = canvas.value!.getContext('2d')!
  ctx.lineJoin = 'round'

  class Node {
    pos: Vector
    r: number
    constructor(pos: Vector, r: number) {
      this.pos = pos
      this.r = r
    }
  }
  class Thunder {
    pointNum: number
    points: Vector[] = [new Vector(width / 2, 0)]
    parent: Thunder | null
    childs: Thunder[] = []
    level: number
    hue: number
    lineWidth: number = 0
    rOff = random(4, 10)
    constructor(parent: Thunder | null) {
      this.parent = parent
      this.pointNum = frandom(pointNumRange[0], pointNumRange[1])
      this.level = parent ? parent.level + 1 : 1
      this.hue = parent ? parent.hue : frandom(360)
      this.lineWidth = parent ? (parent.lineWidth / this.level) : frandom(lineWidthRange[0], lineWidthRange[1])

      for (let i = 0; i < this.pointNum; i++) {

      }
    }

    draw() {
      ctx.beginPath()
      ctx.strokeStyle = `hsl(${this.hue},100%, 50%)`
      ctx.shadowColor = `hsla(${this.hue},100%,50%,0.8)`
      ctx.shadowBlur = this.lineWidth / 2
      ctx.moveTo(this.points[0].x, this.points[0].y)
      for (let i = 1; i < this.points.length; i++) {
        const point = this.points[i]
        ctx.lineTo(point.x, point.y)
      }
      ctx.stroke()
    }
  }

  canvas.value?.addEventListener('click', () => {
    ctx.fillStyle = '#000'
    ctx.fillRect(0, 0, width, height)
    const thunder = new Thunder(null)
    thunder.draw()
  })
})
</script>

<template>
  <div ref="con" class="h-100vh grid place-items-center">
    <canvas ref="canvas" class="block" />
  </div>
</template>

<style lang='less' scoped>
</style>
