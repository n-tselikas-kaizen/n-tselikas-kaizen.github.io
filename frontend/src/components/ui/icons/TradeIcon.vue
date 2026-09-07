<script setup lang="ts">
withDefaults(defineProps<{ size?: number; color?: string }>(), {
  size: 22,
  color: 'var(--color-gold-ink)',
})
</script>

<template>
  <svg
    :width="size"
    :height="size"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    :stroke="color"
    stroke-width="2"
    stroke-linecap="round"
    stroke-linejoin="round"
  >
    <path d="M4 7h13" />
    <path d="M14 4l3 3-3 3" />
    <path d="M20 17H7" />
    <path d="M10 20l-3-3 3-3" />
  </svg>
</template>
