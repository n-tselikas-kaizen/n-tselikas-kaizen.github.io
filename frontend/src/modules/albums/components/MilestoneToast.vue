<script setup lang="ts">
import ToastBox from '@/components/ui/ToastBox.vue'
import BcIcon from '@/components/ui/icons/BcIcon.vue'

defineProps<{ pct: number; bonus: number }>()
</script>

<template>
  <ToastBox>
    <template #icon><BcIcon :size="20" /></template>
    <template #eyebrow>Milestone claimed</template>
    <template #name>{{ pct }}% — +€{{ bonus.toFixed(2) }}</template>
  </ToastBox>
</template>
