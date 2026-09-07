<script setup lang="ts">
import { computed } from 'vue'
import { RARITIES } from '@/modules/common/constants'
import { useCardsStore } from '../store'
import { CATEGORY_GLYPH, THEME_ICON } from '../constants'

/**
 * The front face of one card — art + rarity badge + name/provider overlay.
 * Shared by the album grid, pack pull reveals, the sell carousel, and trade
 * slots; each wraps this in whatever structural container (flip card,
 * picker slot, ...) that context needs.
 */
const props = withDefaults(
  defineProps<{
    subjectIndex: number
    rarityIndex: number
    /** Unfilled slots show the plain themed silhouette instead of real art. */
    filled?: boolean
    cardNo?: number | null
    newTag?: boolean
    showBadge?: boolean
    showOverlay?: boolean
  }>(),
  { filled: true, cardNo: null, newTag: false, showBadge: true, showOverlay: true },
)

const cards = useCardsStore()
const subject = computed(() => cards.subjects[props.subjectIndex])
const rarity = computed(() => RARITIES[props.rarityIndex])
const noSlot = computed(() => !cards.slotExists(props.subjectIndex, props.rarityIndex))
const categoryGlyph = computed(() => CATEGORY_GLYPH[subject.value.cat] || THEME_ICON)

const borderStyle = computed(() =>
  props.filled
    ? { borderColor: rarity.value.color, boxShadow: `0 0 12px ${rarity.value.color}73` }
    : {},
)
</script>

<template>
  <div
    class="ai-face relative h-full w-full overflow-hidden rounded-xl border-2"
    :style="borderStyle"
  >
    <div v-if="filled" class="ai-art-rich relative flex h-full w-full items-center justify-center">
      <span class="art-stripes absolute inset-0" />
      <span class="relative z-[1] text-[74px]" style="color: rgba(201, 162, 39, 0.55)">{{
        categoryGlyph
      }}</span>
      <span
        class="absolute right-3 bottom-2.5 z-[1] text-[19px]"
        style="color: rgba(244, 241, 232, 0.28)"
        >{{ THEME_ICON }}</span
      >
    </div>
    <div v-else class="ai-art-plain flex h-full w-full items-center justify-center">
      <span class="text-[68px]" style="color: rgba(201, 162, 39, 0.28)">{{ THEME_ICON }}</span>
    </div>

    <span
      v-if="cardNo !== null"
      class="text-ink-dim absolute top-2 left-[9px] z-[2] rounded px-1.5 py-0.5 font-mono text-[10px] tracking-[0.03em]"
      style="background: rgba(11, 23, 16, 0.55)"
    >
      No. {{ String(cardNo).padStart(3, '0') }}
    </span>

    <span
      v-if="showBadge && filled"
      class="absolute top-2 right-[9px] z-[2] rounded-full px-3 py-[5px] font-mono text-[9.5px] font-bold tracking-[0.05em] text-white uppercase"
      style="text-shadow: 0 1px 2px rgba(0, 0, 0, 0.45); box-shadow: 0 1px 4px rgba(0, 0, 0, 0.35)"
      :style="{ background: rarity.color }"
    >
      {{ rarity.label }}
    </span>

    <span
      v-if="newTag"
      class="text-gold-ink bg-gold absolute top-2 left-1/2 z-[2] -translate-x-1/2 rounded px-1.5 py-0.5 font-mono text-[9.5px] font-bold uppercase"
    >
      New
    </span>

    <div
      v-if="showOverlay && filled"
      class="absolute inset-x-0 bottom-0 z-[2] px-3.5 pt-[34px] pb-3"
      style="
        background: linear-gradient(
          to top,
          rgba(6, 13, 9, 0.92) 30%,
          rgba(6, 13, 9, 0.55) 70%,
          transparent 100%
        );
      "
    >
      <span
        class="text-gold mb-1.5 inline-block rounded px-1.5 py-0.5 font-mono text-[9.5px] tracking-[0.05em]"
        style="background: rgba(201, 162, 39, 0.16)"
      >
        {{ subject.cat }}
      </span>
      <span
        v-if="noSlot"
        class="text-ink-faint mb-1 block rounded px-1.5 py-0.5 font-mono text-[9px] tracking-[0.03em]"
        style="background: rgba(244, 241, 232, 0.1); width: fit-content"
        title="No slot for this rarity in this album — trade or sell material"
      >
        No slot in this album
      </span>
      <p class="text-ink m-0 mb-0.5 text-sm leading-tight font-semibold">{{ subject.name }}</p>
      <p class="text-ink-dim m-0 font-mono text-[11px]">{{ subject.provider }}</p>
    </div>
  </div>
</template>

<style scoped>
.art-stripes {
  background: repeating-linear-gradient(
    135deg,
    rgba(201, 162, 39, 0.06) 0 10px,
    transparent 10px 20px
  );
}
.ai-art-plain {
  background:
    radial-gradient(circle at 30% 20%, rgba(201, 162, 39, 0.16), transparent 60%),
    linear-gradient(160deg, #152a1c, #0b1710);
}
.ai-art-rich {
  background:
    radial-gradient(circle at 30% 20%, rgba(201, 162, 39, 0.35), transparent 60%),
    linear-gradient(160deg, #1c3524, #0b1710);
}
</style>
