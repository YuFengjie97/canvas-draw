import { isNumber } from './math'

const mfloor = Math.floor

export function initVisualSort({ sourceArr, con, delay = 30 }: {
  sourceArr: number[]
  con: HTMLElement
  delay?: number
}) {
  const color = '#00b894'
  const colorSet = '#d63031'
  const colorGet = '#fd79a8'
  const messages: Array<{
    type: 'set' | 'get'
    index: string
    val?: number
  }> = []

  const div = document.createElement('div')
  con.appendChild(div)

  const { width } = con.getBoundingClientRect()
  const len = sourceArr.length
  const barWidth = (width / len)

  div.style.cssText = `
      width: 100%;
      height: 100%;
      position: relative;
    `
  const max = sourceArr.reduce((acc, item) => acc > item ? acc : item, sourceArr[0])
  function getH(val: number) {
    return (val / max * 100)
  }

  // 初始化bar
  const bars: HTMLElement[] = sourceArr.map((item, i) => {
    const el = document.createElement('div')
    div.appendChild(el)
    el.style.cssText = `
        position: absolute;
        bottom: 0;
        left: ${i * barWidth}px;
        width: ${barWidth}px;
        height: ${getH(item)}%;
        transition: height 0.3s;
        background: ${color};
      `
    return el
  })

  const arrProxy = new Proxy(sourceArr, {
    set(target, p, newValue) {
      target[p] = newValue
      if (isNumber(p)) {
        messages.push({
          type: 'set',
          index: p as string,
          val: newValue,
        })
      }

      return true
    },
    get(target, p) {
      if (isNumber(p)) {
        messages.push({
          type: 'get',
          index: p as string,
        })
      }

      return target[p]
    },
  })

  setInterval(() => {
    const ms = messages.shift()
    if (ms) {
      const { index, type, val } = ms

      bars[index].style.background = type === 'set' ? colorSet : colorGet
      if (val)
        bars[index].style.height = `${getH(val)}%`

      setTimeout(() => {
        (bars[index] as HTMLElement).style.background = color
      }, delay)
    }
  }, delay)

  return arrProxy
}
