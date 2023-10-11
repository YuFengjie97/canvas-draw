<script lang="ts" setup>
import { Vector } from 'p5'
import { onMounted, ref } from 'vue'
import colors from 'nice-color-palettes'
import Stats from 'stats.js'
import { map, random } from '@/utils'

const stats = new Stats()
document.body.appendChild(stats.dom)
const paletts = random(colors)
const mFloor = Math.floor
const width = 600
const height = 600
const center = new Vector(width / 2, height / 2)
const TP = Math.PI * 2
const canvas = ref<HTMLCanvasElement>()
let t = 0
const tInc = 3

onMounted(() => {
  canvas.value!.width = width
  canvas.value!.height = height
  canvas.value!.style.cssText = `width: ${width}px; height: ${height}px`

  const ctx = canvas.value!.getContext('2d')!
  const circles: Circle[] = []
  const curves: Curve[] = []

  class Circle {
    pos: Vector
    r: number
    color: string
    parent: Circle | null = null
    control: Vector
    child: Circle[] = []
    constructor(pos: Vector, control: Vector, r: number, color: string) {
      this.pos = pos
      this.control = control
      this.r = r
      this.color = color
    }

    /**
     *
     * @param raf 为0到1，为了动画，让他有个慢慢变大的过程
     */
    draw(raf: number) {
      ctx.beginPath()
      ctx.moveTo(this.pos.x, this.pos.y)
      ctx.arc(this.pos.x, this.pos.y, this.r * raf, 0, TP)
      ctx.fillStyle = this.color
      ctx.fill()
    }
  }

  class Curve {
    cArr: Circle[] = []
    color: string
    to = 0
    len = 0
    path = new Path2D()
    constructor(c: Circle, color: string) {
      this.addCurveCircle(c)
      this.cArr.reverse() // 反转父节点，让中心节点在第一个
      this.initPath()
      this.color = color
      this.to = random(-400, 0) // 取一个随机的偏移值，让每条路径生长有差异
    }

    /**
     * 将路径节点初始化为path2D
     */
    initPath() {
      this.path.moveTo(this.cArr[0].pos.x, this.cArr[0].pos.y)
      for (let i = 1; i < this.cArr.length - 1; i++) {
        const p1 = this.cArr[i]
        const p2 = this.cArr[i + 1]
        this.path.bezierCurveTo(p1.pos.x, p1.pos.y, p1.pos.x, p1.pos.y, p2.control.x, p2.control.y)
        this.len += p1.r + p2.r // 这一小段贝塞尔曲线被近似的看作为两个节点的半径之和
      }
      const lastC = this.cArr[this.cArr.length - 1]
      this.path.lineTo(lastC.pos.x, lastC.pos.y)
    }

    /**
     * 递归获取路径节点
     * @param c 节点，最开始的参数是叶子节点
     */
    addCurveCircle(c: Circle | null) {
      if (c) {
        this.cArr.push(c)
        this.addCurveCircle(c!.parent)
      }
    }

    draw() {
      const tt = this.to + t
      ctx.setLineDash([Math.max(1, tt), 4000])
      ctx.strokeStyle = this.color
      ctx.stroke(this.path)

      // 绘制完路径，去绘制叶节点
      if (tt >= this.len) {
        // 叶子节点的生长速度，因为我需要一个不断累积的变化，这里只有tt，而tt跟len有关
        // 可以理解成叶子生长完毕用时为该路径的1/4时间
        const raf = map((tt - this.len) * 0.5, 0, this.len / 4, 0, 1)

        const leaf = this.cArr[this.cArr.length - 1]
        leaf.draw(raf)
      }
    }
  }

  /**
   * 判断要创造的circle是否在已存在的circle中有重合
   * @param pos 要判断的circle的坐标
   * @param r 要判断的circle的r
   */
  function cval(pos: Vector, r: number) {
    if (Vector.dist(pos, center) + r > width / 2)
      return false

    for (let i = 0; i < circles.length; i++) {
      const rExp = r + circles[i].r
      // if (xDist > rExp)
      //   continue
      // if (yDist > rExp)
      //   continue

      if ((Vector.dist(pos, circles[i].pos)) < rExp)
        return false
      else continue
    }
    return true
  }

  /**
   * 使用父节点随机创造子节点
   * @param pc 传入的父节点
   * @param r 要生成的circle的半径
   * @param color 要生成的circle的颜色
   */
  function circleGrow(pc: Circle, r: number, color: string) {
    const a = random(TP)
    const pos = pc.pos.copy().add(Vector.fromAngle(a, pc.r + r))
    if (cval(pos, r)) {
      // 控制点是以父节点随机角度生成
      const control = pc.pos.copy().add(Vector.fromAngle(a, pc.r))
      const c = new Circle(pos, control, r, color)

      pc.child.push(c)
      c.parent = pc
      circles.push(c)
    }
  }

  /**
   * 创造一些范围内并互不重叠的节点
   */
  function initCircles() {
    circles.push(new Circle(new Vector(width / 2, height / 2), new Vector(width / 2, height / 2), 10, '#fff'))

    const count = 4000
    let c = paletts[0]
    for (let i = 0; i < count; i++) {
      let r = 1
      if (i < count / 4) {
        r = mFloor(width / 30)
        c = paletts[0]
      }
      else if (i < count / 4 * 2) {
        r = mFloor(width / 40)
        c = paletts[1]
      }
      else if (i < count / 4 * 3) {
        r = mFloor(width / 50)
        c = paletts[2]
      }
      else if (i < count) {
        r = mFloor(width / 60)
        c = paletts[3]
      }
      circleGrow(random(circles), r, c)
    }
  }

  /**
   * 查找叶子节点，递归得到路径
   */
  function initCurves() {
    const strokeStyle = `hsla(${mFloor(random(360))},100%, 50%, 0.5)`

    circles.forEach((c) => {
      if (c.child.length === 0) {
        const curve = new Curve(c, strokeStyle)
        curves.push(curve)
      }
    })
  }

  initCircles()
  initCurves()

  // 不变状态初始化
  ctx.lineJoin = 'round'
  ctx.lineCap = 'round'
  ctx.lineWidth = 4

  function draw() {
    ctx.fillStyle = 'rgb(0,0,0)'
    ctx.fillRect(0, 0, width, height)

    curves.forEach((c) => {
      c.draw()
    })

    ctx.beginPath()
    ctx.fillStyle = '#eee'
    ctx.arc(center.x, center.y, 5, 0, TP)
    ctx.fill()
  }

  function animate() {
    t += tInc
    stats.update()
    draw()
    requestAnimationFrame(animate)
  }
  animate()
})
</script>

<template>
  <div class="h-100vh w-full grid place-items-center">
    <canvas ref="canvas" class="w-800px h-800px" width="800" height="800" />
  </div>
</template>

<style lang='less' scoped>
canvas{
  box-shadow: 0 0 4px #333;
}
</style>
