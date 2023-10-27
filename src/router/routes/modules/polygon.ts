import type { RouteRecordRaw } from 'vue-router'
import AppVue from '@/App.vue'

export const polygon: RouteRecordRaw[] = [{
  path: '/polygon',
  component: AppVue,
  redirect: '/circle/normal',
  children: [
    {
      path: 'normal',
      component: () => import('@/views/polygon/normal.vue'),
    },
    {
      path: 'bezier',
      component: () => import('@/views/polygon/bezier.vue'),
    },
    {
      path: 'bezierMore',
      component: () => import('@/views/polygon/bezierMore.vue'),
    },
    {
      path: 'ink',
      component: () => import('@/views/polygon/ink.vue'),
    },
    {
      path: 'thunder',
      component: () => import('@/views/polygon/thunder.vue'),
    },
    {
      path: 'lines',
      component: () => import('@/views/polygon/lines.vue'),
    },
  ],
}]
