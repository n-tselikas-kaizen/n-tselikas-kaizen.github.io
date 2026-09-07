<script setup lang="ts">
import { computed, ref } from 'vue'
import { RARITIES } from '@/modules/common/constants'
import { useCardsStore } from '@/modules/cards/store'
import CardFace from '@/modules/cards/components/CardFace.vue'
import FilterChips from '@/components/ui/FilterChips.vue'
import Button from '@/components/ui/Button.vue'
import { useListingsStore } from '../store'

/**
 * Every sellable card renders at once in a scrolling strip — however many
 * fit is however many show, and a partial next one naturally peeks at the
 * trailing edge. Selecting a card shrinks that one card and opens its price
 * editor beneath it; every other card, including scrolling, stays
 * interactive. Clicking the already-selected card cancels it; clicking a
 * different one while one's open just switches which one's being edited.
 */
const cards = useCardsStore()
const listings = useListingsStore()

const rarityFilterOptions: { value: number | null; label: string }[] = [
  { value: null, label: 'All' },
  ...RARITIES.map((r, ri) => ({ value: ri, label: r.label })),
]
const sellFilterRarity = ref<number | null>(null)
const sellSelectedKey = ref<string | null>(null)
const priceInput = ref('')

const combos = computed(() => {
  const all = cards.sellableCombos()
  return sellFilterRarity.value === null ? all : all.filter((c) => c.ri === sellFilterRarity.value)
})

const emptyMessage = computed(
  () =>
    'Nothing to sell' +
    (sellFilterRarity.value !== null ? ' at ' + RARITIES[sellFilterRarity.value].label : '') +
    ' right now.',
)

function keyOf(si: number, ri: number): string {
  return si + '-' + ri
}

function selectCard(si: number, ri: number) {
  const key = keyOf(si, ri)
  if (sellSelectedKey.value === key) {
    sellSelectedKey.value = null
    return
  }
  sellSelectedKey.value = key
  priceInput.value = cards.cardValueBC(ri).toFixed(2)
}

function confirmList(si: number, ri: number) {
  const typed = parseFloat(priceInput.value)
  const price = Math.max(0.1, isNaN(typed) ? cards.cardValueBC(ri) : typed)
  listings.confirmSellListing(si, ri, price)
  sellSelectedKey.value = null
}

const viewport = ref<HTMLElement | null>(null)
function scrollCarousel(dir: number) {
  if (!viewport.value) return
  viewport.value.scrollBy({ left: dir * viewport.value.clientWidth * 0.8, behavior: 'smooth' })
}
</script>

<template>
  <div>
    <FilterChips v-model="sellFilterRarity" :options="rarityFilterOptions" class="mb-4" />

    <div class="mb-2 flex items-start gap-3">
      <button
        class="bg-panel border-line-strong text-ink-dim hover:enabled:border-gold hover:enabled:text-gold mt-[170px] flex h-[38px] w-[38px] shrink-0 items-center justify-center rounded-full border text-[15px] disabled:opacity-30"
        :disabled="combos.length === 0"
        aria-label="Scroll left"
        @click="scrollCarousel(-1)"
      >
        ←
      </button>

      <div ref="viewport" class="carousel-viewport min-w-0 flex-1">
        <p
          v-if="combos.length === 0"
          class="text-ink-faint my-6 mx-3 text-xs leading-relaxed whitespace-nowrap"
        >
          {{ emptyMessage }}
        </p>
        <div v-else class="flex w-max items-start gap-4 px-1 pt-1 pb-2">
          <div
            v-for="combo in combos"
            :key="keyOf(combo.si, combo.ri)"
            class="flex w-[230px] shrink-0 flex-col items-center"
          >
            <div
              class="sell-card relative cursor-pointer"
              :class="
                sellSelectedKey === keyOf(combo.si, combo.ri)
                  ? 'selected h-[321.7px] w-[196px]'
                  : 'aspect-[260/427] w-[230px]'
              "
              @click="selectCard(combo.si, combo.ri)"
            >
              <CardFace :subject-index="combo.si" :rarity-index="combo.ri" />
              <span
                class="owned-badge absolute right-2.5 bottom-2.5 z-[3] rounded-md px-1.5 py-1 font-mono text-[11px]"
              >
                ×{{ cards.ownership[combo.si][combo.ri] }} owned
              </span>
            </div>

            <div
              v-if="sellSelectedKey === keyOf(combo.si, combo.ri)"
              class="price-editor bg-panel border-line-strong flex h-14 w-[196px] items-center justify-center gap-2 rounded-b-xl border border-t-0 px-3"
            >
              <input
                v-model="priceInput"
                type="number"
                step="0.1"
                min="0.1"
                class="price-input text-gold w-11 border-0 border-b border-dashed bg-transparent text-center font-mono text-[15px] font-semibold outline-none"
              />
              <span class="text-ink-faint shrink-0 font-mono text-[9.5px]">BC</span>
              <Button class="!px-3 !py-1.5 !text-[11.5px]" @click="confirmList(combo.si, combo.ri)"
                >List</Button
              >
            </div>
          </div>
        </div>
      </div>

      <button
        class="bg-panel border-line-strong text-ink-dim hover:enabled:border-gold hover:enabled:text-gold mt-[170px] flex h-[38px] w-[38px] shrink-0 items-center justify-center rounded-full border text-[15px] disabled:opacity-30"
        :disabled="combos.length === 0"
        aria-label="Scroll right"
        @click="scrollCarousel(1)"
      >
        →
      </button>
    </div>
  </div>
</template>

<style scoped>
.carousel-viewport {
  overflow-x: auto;
  overflow-y: visible;
  scroll-behavior: smooth;
  scrollbar-width: none;
  -ms-overflow-style: none;
}
.carousel-viewport::-webkit-scrollbar {
  display: none;
}

/* Width AND height are both pinned explicitly (not left to aspect-ratio) so the
   card + price editor together add up to the same height a resting card resolves
   to — see listings.css for the source of this sizing. */
.sell-card {
  border-radius: 12px;
  transition:
    width 0.25s ease,
    height 0.25s ease,
    border-radius 0.25s ease;
}
.sell-card.selected {
  border-radius: 12px 12px 0 0;
}
/* CardFace owns its own border/rounding; when this card is expanded, square off
   its bottom corners and drop its bottom border so it reads as one continuous
   shape with the price editor below, not two stacked boxes. */
.sell-card.selected :deep(.ai-face) {
  border-radius: 12px 12px 0 0;
  border-bottom: none;
}

.owned-badge {
  background: rgba(6, 13, 9, 0.75);
  color: var(--color-ink);
}

.price-input::-webkit-outer-spin-button,
.price-input::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}
.price-input {
  -moz-appearance: textfield;
  border-bottom-color: var(--color-line-strong);
}
.price-input:focus {
  border-bottom-color: var(--color-gold);
}
</style>
