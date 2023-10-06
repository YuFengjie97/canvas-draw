export function initCanvas(con: HTMLElement, op: {
  width: number
  height: number
} = {
  width: 400,
  height: 400,
}): CanvasRenderingContext2D {
  const canvasEl = document.createElement('canvas')
  canvasEl.width = op.width
  canvasEl.height = op.height
  con.appendChild(canvasEl)

  canvasEl.style.cssText = `
    width: ${op.width}px;
    height: ${op.height}px;
    box-shadow: 0 0 6px #333;
  `

  const ctx = canvasEl.getContext('2d')!
  return ctx
}

export function getBufferCanvas(op: { width: number; height: number } = {
  width: 400,
  height: 400,
}) {
  const bufferCanvas = document.createElement('canvas')
  const bufferCtx = bufferCanvas.getContext('2d')
  bufferCanvas.style.cssText = `width: ${op.width}px; height: ${op.height}px`
  bufferCanvas.width = op.width
  bufferCanvas.height = op.height

  return bufferCtx!
}

// 比较偏漏的一个计算fps的方法，已经用stats.js代替了
export function initFps(con: HTMLElement) {
  const el = document.createElement('div')
  el.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    background: #333;
    color: #fff;
    border-radius: 8px;
    padding: 10px 16px;
    min-width: 100px;
  `

  // 使用requestAnimationFrame的方式计算帧数
  let lastSecondStamp = 0
  let lastStamp = 0
  function calFps() {
    const t = new Date().getTime()
    const val = Math.floor(1000 / (t - lastStamp))
    lastStamp = t
    if (t - lastSecondStamp >= 1000) {
      el.innerHTML = `FPS: ${val}`
      lastSecondStamp = t
    }
    requestAnimationFrame(calFps)
  }
  calFps()

  con.appendChild(el)
}
