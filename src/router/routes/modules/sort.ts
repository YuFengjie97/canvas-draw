import type { RouteRecordRaw } from 'vue-router'
import AppVue from '@/App.vue'

export const sort: RouteRecordRaw[] = [{
  path: '/sort',
  component: AppVue,
  redirect: '/sort/',
  children: [
    {
      path: 'selection',
      component: () => import('@/views/sort/selection.vue'),
    },
    {
      path: '4in1',
      component: () => import('@/views/sort/4in1.vue'),
    },
  ],
}]
