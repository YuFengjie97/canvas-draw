import { basic } from './modules/basic'
import { circle } from './modules/circle'
import { polygon } from './modules/polygon'
import { grid } from './modules/grid'

const routes = [...basic, ...circle, ...polygon, ...grid]

export default routes
