<script setup lang="ts">
import type { DeliverableStatus } from '../../types'

defineProps<{ status: DeliverableStatus }>()

const colors: Record<DeliverableStatus, string> = {
  draft: 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300',
  published: 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-300',
  expired: 'bg-amber-100 text-amber-700 dark:bg-amber-900 dark:text-amber-300',
  archived: 'bg-red-100 text-red-600 dark:bg-red-900 dark:text-red-300',
}
</script>

<template>
  <span
    class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize"
    :class="colors[status]"
  >
    {{ status }}
  </span>
</template>
