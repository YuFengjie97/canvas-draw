import { random } from './p5'

const { floor } = Math

/**
 *
 * @param v 变化的值
 * @param t1 v映射目标范围的起始值
 * @param t2 v映射目标范围的终点值
 * @param s1 v范围的起始值
 * @param s2 v范围的终点值
 * @returns v映射到t1到t2的值
 */
export function map(v: number, s1: number, s2: number, t1: number, t2: number) {
  if (v < s1)
    return t1
  if (v > s2)
    return t2

  return (v - s1) / (s2 - s1) * (t2 - t1) + t1
}

export function lerp(start: number, end: number, amt: number) {
  return map(amt, 0, 1, start, end)
}

export function randomRGB() {
  const r = floor(random(0, 255))
  const g = floor(random(0, 255))
  const b = floor(random(0, 255))
  return `rgb(${r},${g},${b})`
}

export function isNumber(val: any) {
  return /^\d+$/.test(val)
}

export function swap(arr: number[], i: number, j: number) {
  const temp = arr[i]
  arr[i] = arr[j]
  arr[j] = temp
}

export function selectSort(arr: number[]) {
  for (let i = 0; i < arr.length; i++) {
    let k = i
    for (let j = i; j < arr.length; j++) {
      if (arr[j] < arr[k])
        k = j
    }
    swap(arr, i, k)
  }
}

export function bubbleSort(arr: number[]) {
  for (let i = arr.length - 1; i >= 0; i--) {
    for (let j = 0; j < i; j++) {
      if (arr[j] > arr[j + 1])
        swap(arr, j, j + 1)
    }
  }
}

export function insertSort(arr: number[]) {
  for (let i = 1; i < arr.length; i++) {
    const base = arr[i]
    let j = i - 1
    while (j >= 0 && arr[j] > base) {
      arr[j + 1] = arr[j]
      j--
    }
    arr[j + 1] = base
  }
}

/**
 * File: quick_sort.ts
 * Created Time: 2022-12-12
 * Author: Justin (xiefahit@gmail.com)
 */
function partition(nums: number[], left: number, right: number): number {
  // 以 nums[left] 作为基准数
  let i = left
  let j = right
  while (i < j) {
    while (i < j && nums[j] >= nums[left])
      j-- // 从右向左找首个小于基准数的元素

    while (i < j && nums[i] <= nums[left])
      i++ // 从左向右找首个大于基准数的元素

    swap(nums, i, j) // 交换这两个元素
  }
  swap(nums, i, left) // 将基准数交换至两子数组的分界线
  return i // 返回基准数的索引
}
export function quickSort(nums: number[], left: number, right: number): void {
  // 子数组长度为 1 时终止
  while (left < right) {
    // 哨兵划分操作
    const pivot = partition(nums, left, right)
    // 对两个子数组中较短的那个执行快排
    if (pivot - left < right - pivot) {
      quickSort(nums, left, pivot - 1) // 递归排序左子数组
      left = pivot + 1 // 剩余未排序区间为 [pivot + 1, right]
    }
    else {
      quickSort(nums, pivot + 1, right) // 递归排序右子数组
      right = pivot - 1 // 剩余未排序区间为 [left, pivot - 1]
    }
  }
}

/**
 * File: merge_sort.ts
 * Created Time: 2022-12-12
 * Author: Justin (xiefahit@gmail.com)
 */
/* 合并左子数组和右子数组 */
// 左子数组区间 [left, mid]
// 右子数组区间 [mid + 1, right]
function merge(nums: number[], left: number, mid: number, right: number): void {
  // 初始化辅助数组
  const tmp = nums.slice(left, right + 1)
  // 左子数组的起始索引和结束索引
  const leftStart = left - left
  const leftEnd = mid - left
  // 右子数组的起始索引和结束索引
  const rightStart = mid + 1 - left
  const rightEnd = right - left
  // i, j 分别指向左子数组、右子数组的首元素
  let i = leftStart
  let j = rightStart
  // 通过覆盖原数组 nums 来合并左子数组和右子数组
  for (let k = left; k <= right; k++) {
    if (i > leftEnd) {
      // 若“左子数组已全部合并完”，则选取右子数组元素，并且 j++
      nums[k] = tmp[j++]
      // 否则，若“右子数组已全部合并完”或“左子数组元素 <= 右子数组元素”，则选取左子数组元素，并且 i++
    }
    else if (j > rightEnd || tmp[i] <= tmp[j]) {
      nums[k] = tmp[i++]
      // 否则，若“左右子数组都未全部合并完”且“左子数组元素 > 右子数组元素”，则选取右子数组元素，并且 j++
    }
    else {
      nums[k] = tmp[j++]
    }
  }
}

/* 归并排序 */
export function mergeSort(nums: number[], left: number, right: number): void {
  // 终止条件
  if (left >= right)
    return // 当子数组长度为 1 时终止递归
  // 划分阶段
  const mid = Math.floor((left + right) / 2) // 计算中点
  mergeSort(nums, left, mid) // 递归左子数组
  mergeSort(nums, mid + 1, right) // 递归右子数组
  // 合并阶段
  merge(nums, left, mid, right)
}
