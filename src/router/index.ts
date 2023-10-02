import { createRouter, createWebHistory } from 'vue-router'
import { type App } from 'vue'
import { basic } from './routes/modules/basic'
import { circle } from './routes/modules/circle'
import { polygon } from './routes/modules/polygon'

export const router = createRouter({
  history: createWebHistory(),
  routes: [...basic, ...circle, ...polygon],
})

export function setupRouter(app: App) {
  app.use(router)
}
