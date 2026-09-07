<script setup lang="ts">
import { useAlbumsStore } from '../store'
import CardFace from '@/modules/cards/components/CardFace.vue'
import SparkOverlay from '@/modules/cards/components/SparkOverlay.vue'
import { glowClassFor } from '@/modules/cards/constants'
import { useModal } from '@/modules/common/composables/useModal'
import CardDetailModal from '@/modules/cards/components/CardDetailModal.vue'

const albums = useAlbumsStore()
const modal = useModal()

function openDetail(slotIdx: number) {
  modal.open(CardDetailModal, { slotIdx })
}
</script>

<template>
  <div class="slot-grid grid w-fit max-w-full justify-start gap-3">
    <div
      v-for="(slot, idx) in albums.album.slots"
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
</template>

<style scoped>
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
