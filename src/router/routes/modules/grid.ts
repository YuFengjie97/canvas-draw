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
    {
      path: 'flow',
      component: () => import('@/views/grid/flow.vue'),
    },
    {
      path: 'flow2',
      component: () => import('@/views/grid/flow2.vue'),
    },
  ],
}]
