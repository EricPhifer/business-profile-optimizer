<script setup lang="ts">
import type { Track } from '../../types'

defineProps<{ track: Track }>()
</script>

<template>
  <span
    class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
    :class="track === 'A'
      ? 'bg-stone-100 text-stone-700 dark:bg-stone-800 dark:text-stone-300'
      : 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-300'"
  >
    {{ track === 'A' ? 'A: Setup' : 'B: Optimize' }}
  </span>
</template>
