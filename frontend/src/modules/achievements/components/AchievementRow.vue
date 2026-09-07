<script setup lang="ts">
import { computed } from 'vue'
import BadgeIcon from './BadgeIcon.vue'
import { useAchievementsStore } from '../store'
import { RARITIES } from '@/modules/common/constants'
import type { Achievement } from '../types'

/**
 * Read-only achievement row — the mechanic, not the reward. No equip controls
 * live here; the `#actions` slot lets a consumer (the Social module's Title
 * and Badge equip modals) inject Equip/Remove/Swap buttons into this same row
 * layout without duplicating the markup.
 */
const props = withDefaults(defineProps<{ achievement: Achievement; showRarity?: boolean }>(), {
  showRarity: false,
})

const achievements = useAchievementsStore()

const state = computed(() => achievements.computeAchievementState(props.achievement))
const unlocked = computed(() => state.value.unlocked)
// Puzzle achievements are solved-or-not, not a fraction — showing the computed
// numeric progress (e.g. "3 / 10 flips") would hand the mechanic away, so the
// hint replaces it entirely instead of sitting alongside it.
const isMystery = computed(() => !!props.achievement.hidden && !unlocked.value)
const displayName = computed(() => (isMystery.value ? '???' : props.achievement.name))
const displayDesc = computed(() =>
  isMystery.value ? props.achievement.hint : props.achievement.desc,
)
const hasBar = computed(
  () => !isMystery.value && state.value.current != null && state.value.target != null,
)
const displayProgress = computed(() =>
  isMystery.value || hasBar.value ? '' : state.value.progress,
)
const rarityIndex = computed(() => achievements.achRarityIndex(props.achievement))
const barPct = computed(() => {
  const current = state.value.current ?? 0
  const target = state.value.target ?? 1
  return Math.max(0, Math.min(100, (current / target) * 100))
})
</script>

<template>
  <div
    class="bg-panel border-line-strong mb-2 flex items-center gap-3.5 rounded-lg border px-3.5 py-3"
    :class="[!unlocked && !isMystery && 'opacity-75', isMystery && 'border-dashed opacity-[0.85]']"
  >
    <BadgeIcon :achievement="achievement" :unlocked="unlocked" />
    <div class="min-w-0 flex-1">
      <div class="flex flex-wrap items-center gap-2">
        <span class="text-ink text-[13.5px] font-semibold">{{ displayName }}</span>
        <span
          v-if="showRarity && !isMystery"
          class="font-mono text-[9.5px] tracking-[0.05em] uppercase"
          :style="{ color: RARITIES[rarityIndex].color }"
        >
          {{ RARITIES[rarityIndex].label }}
        </span>
      </div>
      <p
        class="text-ink-faint mt-[3px] mb-0 text-xs leading-relaxed"
        :class="{ italic: isMystery }"
      >
        {{ displayDesc }}
      </p>
      <p v-if="displayProgress" class="text-ink-dim mt-1.5 mb-0 font-mono text-[11px]">
        {{ displayProgress }}
      </p>
      <div v-if="hasBar" class="mt-1.5 flex items-center gap-2">
        <div class="bg-line-strong h-1.5 min-w-0 flex-1 overflow-hidden rounded-full">
          <div class="bg-gold h-full rounded-full" :style="{ width: `${barPct}%` }" />
        </div>
        <span class="text-ink-dim shrink-0 whitespace-nowrap font-mono text-[10.5px]"
          >{{ state.current }}/{{ state.target }}</span
        >
      </div>
    </div>
    <div v-if="$slots.actions" class="flex shrink-0 flex-col gap-1.5">
      <slot name="actions" />
    </div>
  </div>
</template>
