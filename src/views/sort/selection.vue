<script lang="ts" setup>
import { onMounted, ref } from 'vue'
import { initVisualSort, selectSort } from '@/utils'

const mrandom = Math.random
const mfloor = Math.floor

const con = ref<HTMLElement>()

onMounted(() => {
  const arr = Array.from({ length: 100 }).map(() => mfloor(mrandom() * 100 + 10))
  const arrProxy = initVisualSort({
    con: con.value!,
    sourceArr: arr,
    delay: 3,
  })

  selectSort(arrProxy)
})
</script>

<template>
  <div ref="con" class="w-full h-100vh" />
</template>

<style lang='less' scoped>
</style>
