<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useAlbumsStore } from '../store'
import { useCardsStore } from '@/modules/cards/store'
import CardFace from '@/modules/cards/components/CardFace.vue'
import SparkOverlay from '@/modules/cards/components/SparkOverlay.vue'
import { glowClassFor, CATEGORY_GLYPH } from '@/modules/cards/constants'
import { useModal } from '@/modules/common/composables/useModal'
import CardDetailModal from '@/modules/cards/components/CardDetailModal.vue'
import type { SubjectCategory } from '@/modules/cards/types'

const albums = useAlbumsStore()
const cards = useCardsStore()
const modal = useModal()

const CATEGORY_ORDER: SubjectCategory[] = [
  'CLASSIC',
  'FEATURE',
  'JACKPOT',
  'MEGAWAYS',
  'BONUS BUY',
  'PROVIDER',
]
const CATEGORY_LABEL: Record<SubjectCategory, string> = {
  CLASSIC: 'Classic',
  FEATURE: 'Feature',
  JACKPOT: 'Jackpot',
  MEGAWAYS: 'Megaways',
  'BONUS BUY': 'Bonus Buy',
  PROVIDER: 'Providers',
}

/** Slots grouped by category, keeping each subject's own slots (and the catalog's subject-major order) together. */
const groups = computed(() =>
  CATEGORY_ORDER.map((cat) => ({
    cat,
    slots: albums.album.slots
      .map((slot, idx) => ({ slot, idx }))
      .filter(({ slot }) => cards.subjects[slot.subjectIndex].cat === cat),
  })).filter((g) => g.slots.length > 0),
)

const activeCat = ref<SubjectCategory | null>(groups.value[0]?.cat ?? null)

/** If the active bookmark's category ever empties out, fall back to the first page instead of showing nothing. */
watch(groups, (gs) => {
  if (!gs.some((g) => g.cat === activeCat.value)) activeCat.value = gs[0]?.cat ?? null
})

const activeGroup = computed(
  () => groups.value.find((g) => g.cat === activeCat.value) ?? groups.value[0],
)

function openDetail(slotIdx: number) {
  modal.open(CardDetailModal, { slotIdx })
}
</script>

<template>
  <div>
    <div class="bookmark-row flex flex-wrap gap-1.5">
      <button
        v-for="g in groups"
        :key="g.cat"
        type="button"
        class="bookmark text-ink-dim hover:text-ink"
        :class="{ 'bookmark-active text-gold': g.cat === activeGroup?.cat }"
        @click="activeCat = g.cat"
      >
        <span class="text-[17px]">{{ CATEGORY_GLYPH[g.cat] }}</span>
        <span class="text-[12.5px] font-semibold">{{ CATEGORY_LABEL[g.cat] }}</span>
        <span class="text-ink-faint font-mono text-[10.5px]">{{ g.slots.length }}</span>
      </button>
    </div>

    <div v-if="activeGroup" class="page-panel border-line-strong bg-panel rounded-b-xl rounded-tr-xl border p-4">
      <div class="slot-grid grid w-full justify-center gap-3">
        <div
          v-for="{ slot, idx } in activeGroup.slots"
          :key="idx"
          class="ai-card relative cursor-pointer rounded-xl"
          :class="[
            slot.filled && !slot.claimed ? glowClassFor(slot.rarity) : null,
            {
              pulsing: slot.filled && slot.rarity >= 2 && albums.album.active && !slot.claimed,
              'opacity-60': slot.claimed,
            },
          ]"
          @click="openDetail(idx)"
        >
          <CardFace
            :subject-index="slot.subjectIndex"
            :rarity-index="slot.rarity"
            :filled="slot.filled"
            :card-no="idx + 1"
          />
          <SparkOverlay :rarity-index="slot.filled ? slot.rarity : null" />
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.bookmark {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 9px 14px 16px;
  background: var(--color-panel);
  border: 1px solid var(--color-line-strong);
  border-bottom: none;
  clip-path: polygon(0 0, 100% 0, 100% 72%, 50% 100%, 0 72%);
  transition: transform 0.15s ease;
}
.bookmark-active {
  background: var(--color-panel-raised);
  border-color: var(--color-gold);
  transform: translateY(-3px);
}
.slot-grid {
  grid-template-columns: repeat(var(--album-cols), var(--card-w-grid));
}
.ai-card {
  width: var(--card-w-grid);
  aspect-ratio: var(--card-ratio);
}
.ai-card.glow-rare {
  box-shadow: 0 0 16px 2px var(--color-rarity-rare);
}
.ai-card.glow-epic {
  box-shadow: 0 0 16px 2px var(--color-rarity-epic);
}
.ai-card.glow-legendary {
  box-shadow: 0 0 16px 2px var(--color-rarity-legendary);
}
.ai-card.glow-rare.pulsing {
  animation: glowPulseRare 2.4s ease-in-out infinite;
}
.ai-card.glow-epic.pulsing {
  animation: glowPulseEpic 2.2s ease-in-out infinite;
}
.ai-card.glow-legendary.pulsing {
  animation: glowPulseLegendary 1.8s ease-in-out infinite;
}
@keyframes glowPulseRare {
  0%,
  100% {
    box-shadow: 0 0 7px 1px var(--color-rarity-rare);
  }
  50% {
    box-shadow: 0 0 16px 2px var(--color-rarity-rare);
  }
}
@keyframes glowPulseEpic {
  0%,
  100% {
    box-shadow: 0 0 7px 1px var(--color-rarity-epic);
  }
  50% {
    box-shadow: 0 0 16px 2px var(--color-rarity-epic);
  }
}
@keyframes glowPulseLegendary {
  0%,
  100% {
    box-shadow: 0 0 7px 1px var(--color-rarity-legendary);
  }
  50% {
    box-shadow: 0 0 16px 2px var(--color-rarity-legendary);
  }
}
</style>
