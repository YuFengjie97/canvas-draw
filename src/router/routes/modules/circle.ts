import type { RouteRecordRaw } from 'vue-router'
import AppVue from '@/App.vue'

export const circle: RouteRecordRaw[] = [{
  path: '/circle',
  component: AppVue,
  redirect: '/circle/gradient',
  children: [
    {
      path: 'gradient',
      component: () => import('@/views/circle/gradient.vue'),
    },
    {
      path: 'grow',
      component: () => import('@/views/circle/grow.vue'),
    },
  ],
}]
