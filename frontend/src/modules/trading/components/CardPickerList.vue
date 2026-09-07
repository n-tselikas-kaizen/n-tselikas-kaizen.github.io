<script setup lang="ts">
import { computed, ref } from 'vue'
import FilterChips from '@/components/ui/FilterChips.vue'
import Button from '@/components/ui/Button.vue'
import { RARITIES } from '@/modules/common/constants'
import { SUBJECTS, CATEGORY_GLYPH, THEME_ICON } from '@/modules/cards/constants'
import { useCardsStore } from '@/modules/cards/store'
import type { CardCombo } from '@/modules/common/types'
import type { TradeAsk } from '../types'
import { askCardMatches } from '../store'

/**
 * The filterable card-picker list — shared by the trade table's offer/want
 * slots and the respond flow's give slot. `combos` is already filtered to
 * the right pool by the caller (full catalog for "want", the player's own
 * spares for "offer"/"give", further narrowed to eligible counters for
 * "give"); this component only adds the rarity filter on top.
 */
const props = withDefaults(
  defineProps<{
    combos: CardCombo[]
    selected: CardCombo | null
    showQty?: boolean
    matchAsk?: TradeAsk | null
  }>(),
  { showQty: true, matchAsk: null },
)
const emit = defineEmits<{ pick: [combo: CardCombo | null] }>()

const cards = useCardsStore()
const filterRarity = ref<number | null>(null)

const filterOptions = computed(() => [
  { value: null as number | null, label: 'All' },
  ...RARITIES.map((r, ri) => ({ value: ri as number | null, label: r.label })),
])

const filteredCombos = computed(() =>
  filterRarity.value === null
    ? props.combos
    : props.combos.filter((c) => c.ri === filterRarity.value),
)

function isSelected(c: CardCombo): boolean {
  return !!props.selected && props.selected.si === c.si && props.selected.ri === c.ri
}
function glyphFor(si: number): string {
  return CATEGORY_GLYPH[SUBJECTS[si].cat] || THEME_ICON
}
</script>

<template>
  <div>
    <FilterChips
      :options="filterOptions"
      :model-value="filterRarity"
      @update:model-value="filterRarity = $event"
    />
    <div class="mt-3.5">
      <p v-if="filteredCombos.length === 0" class="text-ink-faint m-0 text-xs">
        Nothing here right now.
      </p>
      <div
        v-for="c in filteredCombos"
        :key="c.si + '-' + c.ri"
        class="border-line-strong bg-panel mb-2 flex items-center gap-3.5 rounded-lg border p-3.5"
      >
        <div
          class="flex h-[46px] w-[46px] shrink-0 items-center justify-center rounded-full border text-[19px]"
          :style="{
            background: RARITIES[c.ri].color,
            color: 'var(--color-gold-ink)',
            borderColor: RARITIES[c.ri].color,
          }"
        >
          {{ glyphFor(c.si) }}
        </div>
        <div class="min-w-0 flex-1">
          <div class="flex flex-wrap items-center gap-2">
            <span class="text-ink text-[13.5px] font-semibold">{{ SUBJECTS[c.si].name }}</span>
            <span
              class="font-mono text-[9.5px] tracking-[0.05em] uppercase"
              :style="{ color: RARITIES[c.ri].color }"
            >
              {{ RARITIES[c.ri].label }}
            </span>
            <span
              v-if="matchAsk"
              class="rounded px-1.5 py-0.5 font-mono text-[9px] tracking-[0.04em] whitespace-nowrap uppercase"
              :style="
                askCardMatches(matchAsk, c.si, c.ri)
                  ? 'background:rgba(47,184,143,0.18);color:var(--color-rarity-uncommon);'
                  : 'background:rgba(62,134,214,0.18);color:var(--color-rarity-rare);'
              "
            >
              {{ askCardMatches(matchAsk, c.si, c.ri) ? 'Matches' : 'Counter' }}
            </span>
          </div>
          <p class="text-ink-faint m-0 mt-0.5 text-xs leading-relaxed">
            {{ SUBJECTS[c.si].provider
            }}<template v-if="showQty"> · ×{{ cards.ownership[c.si][c.ri] }} owned</template>
          </p>
        </div>
        <Button
          variant="secondary"
          :equipped="isSelected(c)"
          @click="emit('pick', isSelected(c) ? null : { si: c.si, ri: c.ri })"
        >
          {{ isSelected(c) ? 'Remove' : 'Select' }}
        </Button>
      </div>
    </div>
  </div>
</template>
