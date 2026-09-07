<script setup lang="ts">
import { computed } from 'vue'
import Modal from '@/components/ui/Modal.vue'
import Button from '@/components/ui/Button.vue'
import FilterChips from '@/components/ui/FilterChips.vue'
import AchievementRow from '@/modules/achievements/components/AchievementRow.vue'
import { useAchievementsStore } from '@/modules/achievements/store'
import { ACHIEVEMENTS } from '@/modules/achievements/constants'
import type { Achievement } from '@/modules/achievements/types'
import { useSocialStore } from '../store'
import { useEquipModalFilters } from '../composables/useEquipModalFilters'

interface Row {
  ach: Achievement
  unlocked: boolean
  isEquipped: boolean
}

const achievements = useAchievementsStore()
const social = useSocialStore()
const { source, album, domainOptions, albumOptions, filterList } = useEquipModalFilters()

/** Only the achievements that grant a title show up here — the reward (title), not the mechanic, is what's being managed. */
const titleAchievements = computed(() => ACHIEVEMENTS.filter((a) => a.reward === 'badge+title'))

const rows = computed<Row[]>(() =>
  filterList(titleAchievements.value).map((ach) => ({
    ach,
    unlocked: achievements.computeAchievementState(ach).unlocked,
    isEquipped: social.profile.equippedTitleId === ach.id,
  })),
)

function toggle(row: Row) {
  if (row.isEquipped) social.removeTitle()
  else social.equipTitle(row.ach.id)
}
</script>

<template>
  <Modal>
    <p class="font-display m-0 mb-1 pr-9 text-[25px] tracking-[0.02em]">Choose a Title</p>
    <p class="text-ink-faint m-0 mb-1 text-[12.5px] leading-relaxed">
      Only the achievements that grant a title show up here — locked ones stay dimmed until you earn
      them.
    </p>

    <p class="text-ink-faint mt-3.5 mb-1.5 font-mono text-[9.5px] tracking-[0.07em] uppercase">
      Source
    </p>
    <FilterChips v-model="source" :options="domainOptions" />
    <p class="text-ink-faint mt-3.5 mb-1.5 font-mono text-[9.5px] tracking-[0.07em] uppercase">
      Album
    </p>
    <FilterChips v-model="album" :options="albumOptions" />

    <div class="mt-3.5">
      <AchievementRow v-for="row in rows" :key="row.ach.id" :achievement="row.ach">
        <template v-if="row.unlocked" #actions>
          <Button variant="secondary" :equipped="row.isEquipped" @click="toggle(row)">
            {{ row.isEquipped ? 'Remove' : 'Equip' }}
          </Button>
        </template>
      </AchievementRow>
    </div>
  </Modal>
</template>
