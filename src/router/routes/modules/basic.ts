import type { RouteRecordRaw } from 'vue-router'

export const basic: RouteRecordRaw[] = [{
  path: '/',
  component: () => import('@/views/home.vue'),
}]
