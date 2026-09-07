<script setup lang="ts">
import { computed } from 'vue'
import BadgeIcon from './BadgeIcon.vue'
import { useAchievementsStore } from '../store'
import { ACHIEVEMENTS } from '../constants'

// Homepage — a static (non-scrolling) grid of achievement cards, all of the
// collection-wide set at a glance. Clicking any card, or "View all", goes to
// the standalone Achievements page for the full detailed list.
const achievements = useAchievementsStore()

const fullList = computed(() => ACHIEVEMENTS.filter((a) => a.group === 'generic'))
// Homepage shows a preview only — "View all" has the complete set.
const previewList = computed(() => fullList.value.slice(0, 4))
const unlockedCount = computed(
  () => fullList.value.filter((a) => achievements.unlockedAchievements[a.id]).length,
)

const previewItems = computed(() =>
  previewList.value.map((ach) => {
    const unlocked = !!achievements.unlockedAchievements[ach.id]
    const isMystery = !!ach.hidden && !unlocked
    const state = achievements.computeAchievementState(ach)
    const hasBar = !isMystery && state.current != null && state.target != null
    const current = state.current ?? 0
    const target = state.target ?? 1
    const pct = hasBar ? Math.max(0, Math.min(100, (current / target) * 100)) : 0
    return { ach, unlocked, isMystery, state, hasBar, pct }
  }),
)
</script>

<template>
  <div class="mb-6">
    <div class="mb-3.5 flex flex-wrap items-baseline justify-between gap-3">
      <p class="font-display m-0 text-xl">
        Achievements
        <span class="text-ink-dim ml-1 font-mono text-[12.5px]"
          >({{ unlockedCount }} / {{ fullList.length }})</span
        >
      </p>
      <RouterLink
        :to="{ name: 'achievements' }"
        class="text-gold border-gold rounded-md border px-3.5 py-1.5 text-xs font-semibold"
      >
        View all →
      </RouterLink>
    </div>
    <div class="flex flex-nowrap gap-3.5">
      <RouterLink
        v-for="item in previewItems"
        :key="item.ach.id"
        :to="{ name: 'achievements' }"
        class="bg-panel border-line-strong hover:border-gold flex min-w-0 flex-1 items-center gap-3.5 rounded-[10px] border px-5 py-[18px] text-left"
      >
        <BadgeIcon :achievement="item.ach" :unlocked="item.unlocked" :size="44" :font-size="19" />
        <div class="min-w-0 flex-1">
          <p class="text-ink m-0 mb-1.5 truncate text-sm leading-tight font-semibold">
            {{ item.isMystery ? '???' : item.ach.name }}
          </p>
          <div v-if="item.hasBar" class="flex items-center gap-2">
            <div class="bg-line-strong h-1.5 min-w-0 flex-1 overflow-hidden rounded-full">
              <div class="bg-gold h-full rounded-full" :style="{ width: `${item.pct}%` }" />
            </div>
            <span class="text-ink-dim shrink-0 font-mono text-[10.5px] whitespace-nowrap"
              >{{ item.state.current }}/{{ item.state.target }}</span
            >
          </div>
        </div>
      </RouterLink>
    </div>
  </div>
</template>
