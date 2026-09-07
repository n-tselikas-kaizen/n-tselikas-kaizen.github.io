<script setup lang="ts">
import { computed, ref } from 'vue'
import BadgeIcon from './BadgeIcon.vue'
import AchievementRow from './AchievementRow.vue'
import { useAchievementsStore } from '../store'
import { ACHIEVEMENTS } from '../constants'

// Album page's collapsible achievement accordion — kept as-is structurally,
// per the original: expand/collapse is local, ephemeral UI state, not
// something other surfaces need to read.
const achievements = useAchievementsStore()
const expanded = ref(false)

const list = computed(() => ACHIEVEMENTS.filter((a) => a.group === 'album'))
const unlockedList = computed(() =>
  list.value.filter((a) => achievements.unlockedAchievements[a.id]),
)
const previewIcons = computed(() => unlockedList.value.slice(0, 4))

function toggle() {
  expanded.value = !expanded.value
}
</script>

<template>
  <div class="mb-6">
    <button
      class="bg-panel border-line-strong hover:border-gold flex w-full flex-wrap items-center gap-3.5 border px-4 py-3 text-left"
      :class="expanded ? 'rounded-t-lg border-b-transparent' : 'rounded-lg'"
      @click="toggle"
    >
      <div class="flex shrink-0 gap-1.5">
        <BadgeIcon
          v-for="ach in previewIcons"
          :key="ach.id"
          :achievement="ach"
          :unlocked="true"
          :size="32"
          :font-size="14"
        />
        <span v-if="previewIcons.length === 0" class="text-ink-faint text-xs"
          >Nothing unlocked yet</span
        >
      </div>
      <div class="min-w-[140px] flex-1">
        <p class="text-ink-faint m-0 mb-[3px] font-mono text-[9.5px] tracking-[0.07em] uppercase">
          This album's achievements
        </p>
        <p class="text-ink-dim m-0 font-mono text-[12.5px]">
          {{ unlockedList.length }} / {{ list.length }} unlocked
        </p>
      </div>
      <span class="text-gold shrink-0 font-mono text-[11px]">{{
        expanded ? '▲ Hide' : '▼ Show'
      }}</span>
    </button>
    <div
      v-if="expanded"
      class="border-line-strong bg-bg border-t-line -mt-px rounded-b-lg border px-3 pt-3 pb-1"
    >
      <AchievementRow v-for="ach in list" :key="ach.id" :achievement="ach" />
    </div>
  </div>
</template>
