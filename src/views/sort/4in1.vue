<script lang="ts" setup>
import { onMounted, ref } from 'vue'
import { bubbleSort, initVisualSort, insertSort, mergeSort, quickSort, selectSort } from '@/utils'

const mfloor = Math.floor
const mrandom = Math.random

const con1 = ref<HTMLElement>()
const con2 = ref<HTMLElement>()
const con3 = ref<HTMLElement>()
const con4 = ref<HTMLElement>()

onMounted(() => {
  const arr = Array.from({ length: 100 }).map(() => mfloor(mrandom() * 100) + 10)

  const arr1 = JSON.parse(JSON.stringify(arr))
  const arr2 = JSON.parse(JSON.stringify(arr))
  const arr3 = JSON.parse(JSON.stringify(arr))
  const arr4 = JSON.parse(JSON.stringify(arr))

  const proxyArr1 = initVisualSort({ con: con1.value!, sourceArr: arr1, delay: 10 })
  const proxyArr2 = initVisualSort({ con: con2.value!, sourceArr: arr2, delay: 10 })
  const proxyArr3 = initVisualSort({ con: con3.value!, sourceArr: arr3, delay: 10 })
  const proxyArr4 = initVisualSort({ con: con4.value!, sourceArr: arr4, delay: 10 })

  selectSort(proxyArr1)
  bubbleSort(proxyArr2)
  // insertSort(proxyArr3)
  quickSort(proxyArr3, 0, proxyArr4.length - 1)
  mergeSort(proxyArr4, 0, proxyArr4.length - 1)
})
</script>

<template>
  <div class="w-full h-100vh flex flex-wrap">
    <div ref="con1" class="w-50% h-50%" />
    <div ref="con2" class="w-50% h-50%" />
    <div ref="con3" class="w-50% h-50%" />
    <div ref="con4" class="w-50% h-50%" />
  </div>
</template>

<style lang='less' scoped>
.view-con{}
</style>
