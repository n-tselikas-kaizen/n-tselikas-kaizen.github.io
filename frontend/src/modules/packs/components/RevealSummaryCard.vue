<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { RARITIES } from '@/modules/common/constants'
import { useCardsStore } from '@/modules/cards/store'
import { useAlbumsStore } from '@/modules/albums/store'
import { useSocialStore } from '@/modules/social/store'
import { CATEGORY_GLYPH, THEME_ICON } from '@/modules/cards/constants'
import { useRarityFlash } from '../composables/useRarityFlash'
import type { Pull } from '../types'
import '../styles.css'

/**
 * One compact, already-flipped card in the final 3-over-2 summary grid —
 * rarity badge text, the "+1" tag, the "New" fill tag, the off-catalog tag,
 * and (when `showShare` — first time this exact subject+rarity has ever
 * been pulled, resolved once by the parent as the grid was built) a share
 * affordance. Mirrors revealSummaryCardHTML()'s markup, minus the art (the
 * summary grid never showed art, just name + rarity label).
 */
const props = defineProps<{ pull: Pull; index: number; showShare: boolean }>()

const cards = useCardsStore()
const albums = useAlbumsStore()
const social = useSocialStore()

const subject = computed(() => cards.subjects[props.pull.subjectIndex])
const rarity = computed(() => RARITIES[props.pull.rarity])
const noSlot = computed(() => !cards.slotExists(props.pull.subjectIndex, props.pull.rarity))

const { flashClass, sparks, trigger } = useRarityFlash()

onMounted(() => {
  // Each Rare+ pull flashes on its own stagger as the summary cards settle
  // in, rather than all firing together.
  if (props.pull.rarity >= 2) {
    setTimeout(() => trigger(props.pull.rarity), props.index * 90 + 420)
  }
})

function onShare() {
  social.openShareModal({
    glyph: CATEGORY_GLYPH[subject.value.cat] || THEME_ICON,
    color: rarity.value.color,
    title: subject.value.name,
    subtitle: rarity.value.label + ' pull',
    body: `Pulled from a pack opened for ${albums.album.name}.`,
  })
}
</script>

<template>
  <div class="reveal-card flipped" :class="flashClass" :style="{ '--rdelay': index * 90 + 'ms' }">
    <div class="reveal-card-inner">
      <div class="reveal-face reveal-back" />
      <div
        class="reveal-face reveal-front"
        :style="{ borderColor: rarity.color, boxShadow: `0 0 12px ${rarity.color}73` }"
      >
        <span class="rf-plus">+1</span>
        <span v-if="pull.isNewFill" class="rf-new-tag">New</span>
        <span class="rf-name">{{ subject.name }}</span>
        <span class="rf-rar" :style="{ color: rarity.color }">{{ rarity.label }}</span>
        <span
          v-if="noSlot"
          class="rf-no-slot"
          title="No slot for this rarity in this album — trade or sell material"
        >
          No slot here
        </span>
      </div>
    </div>
    <button v-if="showShare" class="reveal-share-btn" title="Share this pull" @click="onShare">
      ⤴
    </button>
    <span
      v-for="s in sparks"
      :key="s.id"
      class="burst-spark"
      :class="s.cls"
      :style="{ left: s.left, top: s.top, animationDelay: s.delay }"
      >✦</span
    >
  </div>
</template>
