<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  current: number
  max: number
  targetMin?: number
  targetMax?: number
}>()

const colorClass = computed(() => {
  const min = props.targetMin ?? 0
  const max = props.targetMax ?? props.max
  if (props.current >= props.max) return 'text-red-500'
  if (props.current > max) return 'text-amber-500'
  if (props.current >= min && props.current <= max) return 'text-green-600 dark:text-green-400'
  return 'text-gray-400'
})
</script>

<template>
  <span class="text-xs font-medium" :class="colorClass">
    {{ current }} / {{ max }} characters
  </span>
</template>
