import { random } from './p5'

const { floor } = Math

/**
 *
 * @param v 变化的值
 * @param t1 v映射目标范围的起始值
 * @param t2 v映射目标范围的终点值
 * @param s1 v范围的起始值
 * @param s2 v范围的终点值
 * @returns v映射到t1到t2的值
 */
export function map(v: number, s1: number, s2: number, t1: number, t2: number) {
  if (v < s1)
    return t1
  if (v > s2)
    return t2

  return (v - s1) / (s2 - s1) * (t2 - t1) + t1
}

export function lerp(start: number, end: number, amt: number) {
  return map(amt, 0, 1, start, end)
}

export function randomRGB() {
  const r = floor(random(0, 255))
  const g = floor(random(0, 255))
  const b = floor(random(0, 255))
  return `rgb(${r},${g},${b})`
}
