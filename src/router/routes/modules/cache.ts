import type { RouteRecordRaw } from 'vue-router'
import AppVue from '@/App.vue'

export const cache: RouteRecordRaw[] = [{
  path: '/cache',
  component: AppVue,
  redirect: '/circle',
  children: [
    {
      path: '',
      component: () => import('@/views/cache/index.vue'),
    },
    {
      path: 'drawImg',
      component: () => import('@/views/cache/drawImg.vue'),
    },
  ],
}]
