<script setup lang="ts">
import { computed } from 'vue'
import { useAchievementsStore } from '../store'
import type { Achievement } from '../types'

const props = withDefaults(
  defineProps<{
    achievement: Achievement
    unlocked: boolean
    /** Circle diameter in px — ach-row uses the 46/19 default, teaser icons use 32/14, home cards use 44/19. */
    size?: number
    fontSize?: number
  }>(),
  { size: 46, fontSize: 19 },
)

const achievements = useAchievementsStore()

const isMystery = computed(() => !!props.achievement.hidden && !props.unlocked)
const icon = computed(() =>
  props.unlocked ? props.achievement.glyph : isMystery.value ? '❔' : '🔒',
)
const color = computed(() => achievements.achRarityColor(props.achievement))
</script>

<template>
  <div
    class="border-line-strong text-ink-faint bg-panel-raised flex shrink-0 items-center justify-center rounded-full border"
    :class="[
      !unlocked && !isMystery && 'opacity-[0.55]',
      isMystery && 'border-dashed opacity-[0.85]',
    ]"
    :style="{
      width: `${size}px`,
      height: `${size}px`,
      fontSize: `${fontSize}px`,
      ...(unlocked
        ? {
            background: color,
            color: 'var(--color-gold-ink)',
            borderStyle: 'solid',
            borderColor: color,
          }
        : {}),
    }"
  >
    {{ icon }}
  </div>
</template>
