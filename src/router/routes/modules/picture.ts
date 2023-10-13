import type { RouteRecordRaw } from 'vue-router'
import AppVue from '@/App.vue'

export const picture: RouteRecordRaw[] = [{
  path: '/picture',
  component: AppVue,
  redirect: '/picture/xRay',
  children: [
    {
      path: 'xRay',
      component: () => import('@/views/picture/xRay.vue'),
    },

  ],
}]
