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
  <div class="flex flex-wrap">
    <RouterLink v-for="(item, i) in routeLinks" :key="i" class="font-size-1.8rem p-20px" :to="item">
      {{ item }}
    </RouterLink>
  </div>
</template>

<style lang='less' scoped>
.view-con{

}
</style>
