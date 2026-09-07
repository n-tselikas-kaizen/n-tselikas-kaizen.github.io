<script setup lang="ts">
withDefaults(defineProps<{ size?: number }>(), { size: 20 })
</script>

<template>
  <svg
    :width="size"
    :height="size"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    stroke-width="2"
    stroke-linecap="round"
    stroke-linejoin="round"
  >
    <rect x="8" y="3" width="12" height="15" rx="2" />
    <rect x="4" y="7" width="12" height="15" rx="2" fill="var(--color-panel-raised)" />
  </svg>
</template>
