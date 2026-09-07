<script setup lang="ts">
import { computed } from 'vue'
import ToastBox from '@/components/ui/ToastBox.vue'
import { RARITIES } from '@/modules/common/constants'
import type { Achievement } from '../types'

const props = defineProps<{ achievement: Achievement }>()

const color = computed(
  () => RARITIES.find((r) => r.key === props.achievement.rarity)?.color ?? 'var(--color-gold)',
)
// Dwell time and visual weight both scale with rarity — Legendary is the big
// celebratory moment (matches `.ach-toast.rarity-legendary` in the original).
const isLegendary = computed(() => props.achievement.rarity === 'legendary')
const shimmer = computed(() => props.achievement.reward === 'badge+title' && isLegendary.value)
const rewardText = computed(() =>
  props.achievement.reward === 'badge+title'
    ? `Badge + Title: “${props.achievement.title}”`
    : 'Badge earned',
)
</script>

<template>
  <ToastBox :icon-bg="color" :large="isLegendary">
    <template #icon>{{ achievement.glyph }}</template>
    <template #eyebrow>Achievement unlocked</template>
    <template #name>
      <span :class="{ 'shimmer-text': shimmer }">{{ achievement.name }}</span>
    </template>
    <template #reward>{{ rewardText }}</template>
  </ToastBox>
</template>
