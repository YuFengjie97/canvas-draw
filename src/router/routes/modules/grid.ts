import type { RouteRecordRaw } from 'vue-router'
import AppVue from '@/App.vue'

export const grid: RouteRecordRaw[] = [{
  path: '/grid',
  component: AppVue,
  redirect: '/grid/art',
  children: [
    {
      path: 'art',
      component: () => import('@/views/grid/art.vue'),
    },
  ],
}]
