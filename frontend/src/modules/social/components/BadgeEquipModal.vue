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

const props = defineProps<{ slotIndex: number }>()

interface Row {
  ach: Achievement
  unlocked: boolean
  isInThisSlot: boolean
  isInOtherSlot: boolean
  equippedSlot: number
}

const achievements = useAchievementsStore()
const social = useSocialStore()
const { source, album, domainOptions, albumOptions, filterList } = useEquipModalFilters()

const rows = computed<Row[]>(() =>
  filterList(ACHIEVEMENTS).map((ach) => {
    const unlocked = achievements.computeAchievementState(ach).unlocked
    // -1 if this badge isn't pinned in any slot right now.
    const equippedSlot = social.profile.equippedBadgeIds.indexOf(ach.id)
    const isInThisSlot = equippedSlot === props.slotIndex
    const isInOtherSlot = equippedSlot >= 0 && !isInThisSlot
    return { ach, unlocked, isInThisSlot, isInOtherSlot, equippedSlot }
  }),
)

function actionLabel(row: Row) {
  if (row.isInThisSlot) return 'Remove'
  if (row.isInOtherSlot) return 'Swap in'
  return 'Equip'
}

function handleAction(row: Row) {
  if (row.isInThisSlot) social.removeBadge(props.slotIndex)
  else social.equipBadgeToSlot(props.slotIndex, row.ach.id)
}
</script>

<template>
  <Modal>
    <p class="font-display m-0 mb-1 pr-9 text-[25px] tracking-[0.02em]">Choose a Badge</p>
    <p class="text-ink-faint m-0 mb-1 text-[12.5px] leading-relaxed">
      Picking a badge that's already pinned in another slot swaps the two.
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
          <span v-if="row.isInOtherSlot" class="ach-slot-tag self-end"
            >Already in slot {{ row.equippedSlot + 1 }}</span
          >
          <Button variant="secondary" :equipped="row.isInThisSlot" @click="handleAction(row)">
            {{ actionLabel(row) }}
          </Button>
        </template>
      </AchievementRow>
    </div>
  </Modal>
</template>

<style scoped>
.ach-slot-tag {
  font-family: 'IBM Plex Mono', monospace;
  font-size: 9px;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  padding: 2px 6px;
  border-radius: 4px;
  background: rgba(var(--gold-rgb), 0.15);
  color: var(--color-gold);
  white-space: nowrap;
}
</style>
