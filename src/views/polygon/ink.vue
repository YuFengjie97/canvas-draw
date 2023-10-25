<script lang="ts" setup>
import { onMounted, ref } from 'vue'
import { Vector } from 'p5'
import { createNoise2D } from 'simplex-noise'
import { map } from '@/utils'

const con = ref<HTMLElement>()
const canvas = ref<HTMLCanvasElement>()
const width = 400
const height = 400
const r = width / 2
const range = 40
const cRange = 0.2
const dInc = 0.01
const pointNum = 20
const noise2D = createNoise2D()

const points: Array<{
  index: number
  angle: number // 该点的极坐标的角度
  angleNormal: number // 角度归一化
  dOff: number // 随机初始偏移值
  pos: Vector // 最后绘制点的坐标
  cpDir: 1 | -1 // 控制点方向，向内还是向外
}> = []

onMounted(() => {
  const ctx = canvas.value!.getContext('2d')!
  ctx.translate(r, r)
  ctx.fillStyle = '#000'

  function init() {
    for (let i = 0; i < pointNum; i++) {
      const angleNormal = map(i, 0, pointNum, 0, 1)
      const angle = angleNormal * Math.PI * 2

      const dOff = Math.random()
      const pos = Vector.fromAngle(angle, r / 2)
      points.push({
        index: i,
        angle,
        angleNormal,
        dOff,
        pos,
        cpDir: Math.random() > 0.5 ? 1 : -1,
      })
    }
  }
  init()

  function update() {
    points.forEach((p) => {
      p.dOff += dInc
      const dist = map(noise2D(p.angleNormal, p.dOff), -1, 1, r / 2 - range, r / 2 + range)
      p.pos = Vector.fromAngle(p.angle, dist)
    })
  }
  function draw() {
    // points.forEach((p) => {
    //   ctx.beginPath()
    //   ctx.arc(p.pos.x, p.pos.y, 2, 0, Math.PI * 2)
    //   ctx.fill()
    // })

    ctx.beginPath()
    ctx.moveTo(points[0].pos.x, points[0].pos.y)
    for (let i = 0; i < points.length; i += 1) {
      const p = points[i]
      const pNext = i === points.length - 1 ? points[0] : points[i + 1]
      const cp = p.pos.copy().add(pNext.pos).mult(0.5).mult(p.index % 2 === 0 ? 1 + cRange : 1 - cRange)
      ctx.quadraticCurveTo(cp.x, cp.y, pNext.pos.x, pNext.pos.y)

      // const cp2 = p.pos.copy().mult(p.index % 2 === 0 ? 1 + cRange : 1 - cRange)
      // ctx.bezierCurveTo(cp2.x, cp2.y, cp.x, cp.y, pNext.pos.x, pNext.pos.y)
    }
    ctx.fill()
  }

  function animate() {
    ctx.clearRect(-width / 2, -height / 2, width, height)
    update()
    draw()
    requestAnimationFrame(animate)
  }
  animate()
})
</script>

<template>
  <div ref="con" class="grid place-items-center h-100vh">
    <canvas ref="canvas" width="400" height="400" class="w-400px h-400px" />
  </div>
</template>

<style lang='less' scoped>
canvas {
  display: block;
  box-shadow: 0 0 4px #333;
}
</style>
