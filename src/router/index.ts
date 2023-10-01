import type { RouteRecordRaw } from 'vue-router'
import { createRouter, createWebHistory } from 'vue-router'
import App from '@/App.vue'

const routes: Array<RouteRecordRaw> = [{
  path: '/',
  component: App,
  children: [
    {
      path: '',
      component: () => import('@/views/home.vue'),
    },
  ],
}]

export const router = createRouter({
  history: createWebHistory(),
  routes,
})
