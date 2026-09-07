<script setup lang="ts">
import { watch } from 'vue'
import CardFace from '@/modules/cards/components/CardFace.vue'
import { THEME_ICON } from '@/modules/cards/constants'
import { useRarityFlash } from '../composables/useRarityFlash'
import type { Pull } from '../types'
import '../styles.css'

/**
 * The single big flip card used by the one-at-a-time pull reveal — front is
 * a plain themed silhouette, back is the real card (reuses CardFace, same
 * as everywhere else a revealed card renders). `flipped` and advancing to
 * the next pull are owned by the parent (PullReveal); a plain `click`
 * listener on this component falls through to its root element natively,
 * so the parent just does `@click="..."` on the tag. This component only
 * self-triggers its own rarity flash once the flip lands.
 */
const props = defineProps<{ pull: Pull; flipped: boolean }>()

const { flashClass, sparks, trigger } = useRarityFlash()

watch(
  () => props.flipped,
  (flipped) => {
    if (flipped && props.pull.rarity >= 2) {
      // Delayed to land as the card finishes its flip (0.5s transition),
      // not while it's still mid-turn.
      setTimeout(() => trigger(props.pull.rarity), 500)
    }
  },
)
</script>

<template>
  <div class="pull-card relative" :class="[{ flipped }, flashClass]">
    <div class="pull-card-inner">
      <div
        class="pull-face front border-line-strong flex items-center justify-center overflow-hidden rounded-xl border-2"
        style="
          background:
            radial-gradient(circle at 30% 20%, rgba(201, 162, 39, 0.16), transparent 60%),
            linear-gradient(160deg, #152a1c, #0b1710);
        "
      >
        <span class="text-[48px]" style="color: rgba(201, 162, 39, 0.28)">{{ THEME_ICON }}</span>
      </div>
      <div class="pull-face back">
        <CardFace
          :subject-index="pull.subjectIndex"
          :rarity-index="pull.rarity"
          :new-tag="pull.isNewFill"
        />
      </div>
    </div>
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
