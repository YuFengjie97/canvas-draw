import { createRouter, createWebHistory } from 'vue-router'
import { type App } from 'vue'
import { basic } from './routes/modules/basic'
import { circle } from './routes/modules/circle'

export const router = createRouter({
  history: createWebHistory(),
  routes: [...basic, ...circle],
})

export function setupRouter(app: App) {
  app.use(router)
}
