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
    width: 400px;
    height: 400px;
    box-shadow: 0 0 6px #333;
  `

  const ctx = canvasEl.getContext('2d')!
  return ctx
}
