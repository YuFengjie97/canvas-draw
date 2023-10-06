import type { RouteRecordRaw } from 'vue-router'
import AppVue from '@/App.vue'

export const test: RouteRecordRaw[] = [{
  path: '/test',
  component: AppVue,
  redirect: '/test/gradient',
  children: [
    {
      path: 'gradient',
      component: () => import('@/views/test/gradient.vue'),
    },

  ],
}]
