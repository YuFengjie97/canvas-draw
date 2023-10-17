import { basic } from './modules/basic'
import { circle } from './modules/circle'
import { polygon } from './modules/polygon'
import { grid } from './modules/grid'
import { test } from './modules/test'
import { cache } from './modules/cache'
import { pixi } from './modules/pixi'
import { picture } from './modules/picture'
import { sort } from './modules/sort'

const routes = [...sort, ...basic, ...circle, ...polygon, ...grid, ...test, ...cache, ...pixi, ...picture]

export default routes
