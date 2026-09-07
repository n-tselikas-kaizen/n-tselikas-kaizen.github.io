<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { RARITIES } from '@/modules/common/constants'
import { useCardsStore } from '@/modules/cards/store'
import { useSocialStore } from '@/modules/social/store'
import PullCardFlip from './PullCardFlip.vue'
import RevealSummaryCard from './RevealSummaryCard.vue'
import type { Pull } from '../types'

/**
 * Both reveal paths land here in the end: one-at-a-time flips through the 5
 * pulls first (quickOpen=false, showSinglePull in the source), quick-open
 * skips straight to the two-row summary grid (showReveal). Mirrors that
 * both funnel into the exact same summary step.
 */
const props = defineProps<{ pulls: Pull[]; quickOpen: boolean }>()
const emit = defineEmits<{ dismiss: []; log: [text: string] }>()

const cards = useCardsStore()
const social = useSocialStore()

const phase = ref<'single' | 'summary'>(props.quickOpen ? 'summary' : 'single')
const singleIndex = ref(0)
const singleFlipped = ref(false)

const singleHint = computed(() => {
  if (!singleFlipped.value)
    return `Card ${singleIndex.value + 1} of ${props.pulls.length} — tap to reveal`
  return singleIndex.value < props.pulls.length - 1 ? 'Tap to continue' : 'Tap to finish'
})

function onSingleCardTap() {
  if (!singleFlipped.value) {
    singleFlipped.value = true
  } else if (singleIndex.value < props.pulls.length - 1) {
    singleIndex.value += 1
    singleFlipped.value = false
  } else {
    enterSummary()
  }
}

interface SummaryItem {
  pull: Pull
  showShare: boolean
  index: number
}
const summaryItems = ref<SummaryItem[]>([])
const rows = computed(() => [summaryItems.value.slice(0, 3), summaryItems.value.slice(3, 5)])

/**
 * Resolves once, the moment the summary grid appears: each Rare+ pull's
 * share eligibility (first time this exact subject+rarity has ever been
 * pulled), the pack-log line, and the one-time first-ever-Legendary
 * auto-share — mirroring showReveal()/revealSummaryCardHTML(), which
 * computed all of this as the grid's HTML was built, not on every re-render.
 */
function enterSummary() {
  summaryItems.value = props.pulls.map((pull, index) => {
    const key = pull.subjectIndex + '-' + pull.rarity
    const isNewVariation = pull.rarity >= 2 && !social.seenRareVariations.has(key)
    if (pull.rarity >= 2) social.seenRareVariations.add(key)
    return { pull, showShare: isNewVariation, index }
  })

  const byTier: Record<string, number> = {}
  props.pulls.forEach((p) => {
    const label = RARITIES[p.rarity].label
    byTier[label] = (byTier[label] || 0) + 1
  })
  emit(
    'log',
    'Pulled: ' +
      Object.entries(byTier)
        .map(([k, v]) => `${v}× ${k}`)
        .join(', '),
  )

  const firstLegendary = props.pulls.find((p) => p.rarity === 4)
  if (!social.hasEverPulledLegendary && firstLegendary) {
    social.hasEverPulledLegendary = true
    social.openShareModal({
      glyph: '♛',
      color: RARITIES[4].color,
      title: 'Your First Legendary!',
      subtitle: cards.subjects[firstLegendary.subjectIndex].name,
      body: "The first Legendary you've ever pulled. Worth remembering.",
    })
  }

  phase.value = 'summary'
}

onMounted(() => {
  if (phase.value === 'summary') enterSummary()
})

function dismiss() {
  emit('dismiss')
}
</script>

<template>
  <div v-if="phase === 'single'" class="flex flex-col items-center gap-3.5">
    <PullCardFlip :pull="pulls[singleIndex]" :flipped="singleFlipped" @click="onSingleCardTap" />
    <p class="text-ink-faint m-0 font-mono text-[11.5px]">{{ singleHint }}</p>
  </div>
  <div v-else class="flex flex-col items-center gap-3.5">
    <div class="flex flex-col items-center gap-3.5">
      <div v-for="(row, ri) in rows" :key="ri" class="flex justify-center gap-2.5">
        <RevealSummaryCard
          v-for="item in row"
          :key="item.index"
          :pull="item.pull"
          :index="item.index"
          :show-share="item.showShare"
        />
      </div>
    </div>
    <button
      class="border-gold text-gold rounded-md border px-[18px] py-2 font-sans text-[13px] font-semibold"
      @click="dismiss"
    >
      Continue
    </button>
  </div>
</template>
