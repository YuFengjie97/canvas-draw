import p5 from 'p5'

// eslint-disable-next-line new-cap
export const p5Ins = new p5(() => { }, undefined)

export function random(min?: number | Array<any>, max?: number) {
  if (max !== undefined)
    return p5Ins.random(min as number, max)
  else if (Array.isArray(min))
    return p5Ins.random(min)
  else if (min !== undefined)
    return p5Ins.random(min)
  else
    return p5Ins.random()
}

export function randomSeed(seed: number) {
  return p5Ins.randomSeed(seed)
}

export function noise(x: number, y?: number | undefined, z?: number | undefined) {
  return p5Ins.noise(x, y, z)
}

export function noiseSeed(seed: number) {
  return p5Ins.noiseSeed(seed)
}

// export function lerp(start: number, stop: number, amt: number) {
//   return p5Ins.lerp(start, stop, amt)
// }
