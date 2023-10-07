import { basic } from './modules/basic'
import { circle } from './modules/circle'
import { polygon } from './modules/polygon'
import { grid } from './modules/grid'
import { test } from './modules/test'
import { cache } from './modules/cache'
import { pixi } from './modules/pixi'

const routes = [...basic, ...circle, ...polygon, ...grid, ...test, ...cache, ...pixi]

export default routes
