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
  ],
}]
