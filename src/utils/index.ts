import p5 from 'p5'

// eslint-disable-next-line new-cap
export const p5Ins = new p5(() => {}, undefined)

export function random(min?: number, max?: number) {
  return p5Ins.random(min, max)
}

const { floor } = Math

export function map(v: number, t1: number, t2: number, s1: number, s2: number) {
  if (v < s1)
    return t1
  if (v > s2)
    return t2

  return (v - s1) / (s2 - s1) * (t2 - t1) + t1
}

export function randomRGB() {
  const r = floor(random(0, 255))
  const g = floor(random(0, 255))
  const b = floor(random(0, 255))
  return `rgb(${r},${g},${b})`
}
