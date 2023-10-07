import type { RouteRecordRaw } from 'vue-router'
import AppVue from '@/App.vue'

export const pixi: RouteRecordRaw[] = [{
  path: '/pixi',
  component: AppVue,
  redirect: '/pixi/test',
  children: [
    {
      path: 'test',
      component: () => import('@/views/pixi/test.vue'),
    },

  ],
}]
