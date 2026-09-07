<script setup lang="ts">
import { computed } from 'vue'
import { useModal } from '@/modules/common/composables/useModal'
import { RARITIES } from '@/modules/common/constants'
import { SUBJECTS, CATEGORY_GLYPH, THEME_ICON } from '@/modules/cards/constants'
import { useCardsStore } from '@/modules/cards/store'
import Button from '@/components/ui/Button.vue'
import { askCardMatches, isCounterAllowed, tradeWantLabel } from '../store'
import type { MarketTradeAsk } from '../types'
import TradeTableModal from './TradeTableModal.vue'

/** One visible (non-reserved) board ask, with a single "Respond" action. */
const props = defineProps<{ ask: MarketTradeAsk }>()
const cards = useCardsStore()
const modal = useModal()

const hasEligible = computed(() => {
  const combos = cards.sellableCombos()
  return combos.some(
    (c) => askCardMatches(props.ask, c.si, c.ri) || isCounterAllowed(props.ask, c.ri),
  )
})

function glyphFor(si: number): string {
  return CATEGORY_GLYPH[SUBJECTS[si].cat] || THEME_ICON
}

function respond() {
  modal.open(TradeTableModal, { context: 'respond', askId: props.ask.id })
}
</script>

<template>
  <div
    class="border-line-strong bg-panel mb-2 flex flex-wrap items-center gap-3.5 rounded-lg border px-4 py-3"
  >
    <div
      class="flex h-[38px] w-[38px] shrink-0 items-center justify-center rounded-md text-[17px]"
      :style="{ background: RARITIES[ask.ri].color }"
    >
      {{ glyphFor(ask.si) }}
    </div>
    <div class="min-w-[160px] flex-1">
      <p class="text-ink m-0 mb-0.5 text-[13.5px] font-semibold">
        {{ SUBJECTS[ask.si].name }}
        <span class="text-ink-faint font-normal">({{ RARITIES[ask.ri].label }})</span>
      </p>
      <p class="text-ink-faint font-mono text-[10.5px]">
        {{ ask.poster }} · {{ tradeWantLabel(ask) }}
      </p>
    </div>
    <Button v-if="hasEligible" variant="primary" class="shrink-0" @click="respond">Respond</Button>
    <Button
      v-else
      variant="primary"
      class="shrink-0"
      disabled
      title="Nothing in your collection is close enough in rarity"
    >
      No eligible card
    </Button>
  </div>
</template>
