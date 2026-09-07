<script setup lang="ts">
import ToastBox from '@/components/ui/ToastBox.vue'
import BcIcon from '@/components/ui/icons/BcIcon.vue'

defineProps<{ text: string }>()
</script>

<template>
  <ToastBox>
    <template #icon><BcIcon :size="20" /></template>
    <template #eyebrow>Album closed</template>
    <template #name>{{ text }}</template>
  </ToastBox>
</template>
