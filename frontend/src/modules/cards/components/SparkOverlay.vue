<script setup lang="ts">
import { computed } from 'vue'
import { EPIC_SPARK_STYLES, LEGENDARY_SPARK_STYLES } from '../constants'

const props = defineProps<{ rarityIndex: number | null }>()

const sparks = computed(() => {
  if (props.rarityIndex === 3)
    return EPIC_SPARK_STYLES.map((style) => ({ style, cls: 'spark-epic' }))
  if (props.rarityIndex === 4)
    return LEGENDARY_SPARK_STYLES.map((style) => ({ style, cls: 'spark-legendary' }))
  return []
})

function parseStyle(css: string): Record<string, string> {
  return Object.fromEntries(
    css
      .split(';')
      .map((rule) => rule.trim())
      .filter(Boolean)
      .map((rule) => rule.split(':').map((s) => s.trim())) as [string, string][],
  )
}
</script>

<template>
  <div class="pointer-events-none absolute inset-0 z-[5]">
    <span
      v-for="(spark, i) in sparks"
      :key="i"
      class="spark absolute text-[13px]"
      :class="spark.cls"
      :style="{ ...parseStyle(spark.style), animationDelay: i * 0.3 + 's' }"
      >✦</span
    >
  </div>
</template>

<style scoped>
.spark {
  animation: sparkTwinkle 1.6s ease-in-out infinite;
}
.spark-epic {
  color: var(--color-rarity-epic);
  text-shadow: 0 0 6px var(--color-rarity-epic);
}
.spark-legendary {
  color: var(--color-rarity-legendary);
  text-shadow: 0 0 6px var(--color-rarity-legendary);
}
@keyframes sparkTwinkle {
  0%,
  100% {
    opacity: 0;
    transform: scale(0.4);
  }
  50% {
    opacity: 1;
    transform: scale(1.15);
  }
}
</style>
