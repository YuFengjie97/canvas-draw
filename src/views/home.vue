<script lang="ts" setup>
import { ref } from 'vue'
import routes from '@/router/routes'

const routeLinks = ref<Array<string>>([])

routes.forEach((r) => {
  const path = r.path
  const children = r.children

  children?.forEach((c) => {
    routeLinks.value.push(`${path}/${c.path}`)
  })
})
</script>

<template>
  <div class="flex flex-col flex-wrap">
    <RouterLink v-for="(item, i) in routeLinks" :key="i" class="font-size-0.8rem p-10px" :to="item">
      {{ item }}
    </RouterLink>
  </div>
</template>

<style lang='less' scoped>
.view-con{

}
</style>
