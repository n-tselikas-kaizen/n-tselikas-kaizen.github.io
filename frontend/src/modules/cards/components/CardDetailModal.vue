<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from 'vue'
import Modal from '@/components/ui/Modal.vue'
import CopiesIcon from '@/components/ui/icons/CopiesIcon.vue'
import { useAlbumsStore } from '@/modules/albums/store'
import { useAchievementsStore } from '@/modules/achievements/store'
import { useCardsStore } from '../store'
import CardFace from './CardFace.vue'

const props = defineProps<{ slotIdx: number }>()

const albums = useAlbumsStore()
const cards = useCardsStore()
const achievements = useAchievementsStore()

const slot = computed(() => albums.album.slots[props.slotIdx])
const spares = computed(() => cards.ownership[slot.value.subjectIndex][slot.value.rarity])

const actionLabel = computed(() => {
  if (!albums.album.active) return slot.value.claimed ? 'Claimed' : 'Album closed'
  if (slot.value.claimed) return 'Claimed'
  if (slot.value.filled)
    return `Claim (${albums.fmtSlotReward(slot.value.subjectIndex, slot.value.rarity)})`
  return 'Open packs to find this card'
})
const actionDisabled = computed(
  () => !albums.album.active || slot.value.claimed || !slot.value.filled,
)

function claim() {
  albums.claimSlotAt(props.slotIdx)
}

// ---- Drag-to-rotate, mirrors the original's mouse/touch chord drag ----
const angle = ref(0)
const dragging = ref(false)
let startX = 0
let startAngle = 0
let transitionEnabled = true

function pointerX(e: MouseEvent | TouchEvent): number {
  return 'touches' in e && e.touches[0] ? e.touches[0].clientX : (e as MouseEvent).clientX
}
function onDown(e: MouseEvent | TouchEvent) {
  dragging.value = true
  startX = pointerX(e)
  startAngle = angle.value
  transitionEnabled = false
}
function onMove(e: MouseEvent | TouchEvent) {
  if (!dragging.value) return
  angle.value = startAngle + (pointerX(e) - startX) * 0.5
  if (e.cancelable) e.preventDefault()
}
function onUp() {
  if (!dragging.value) return
  dragging.value = false
  transitionEnabled = true
  angle.value = Math.round(angle.value / 180) * 180
}

onMounted(() => {
  achievements.recordCardFlip()
  achievements.checkAchievements()
  window.addEventListener('mousemove', onMove)
  window.addEventListener('mouseup', onUp)
})
onUnmounted(() => {
  window.removeEventListener('mousemove', onMove)
  window.removeEventListener('mouseup', onUp)
})
</script>

<template>
  <Modal>
    <div class="detail-card-stage flex flex-col items-center gap-[18px] pt-2">
      <div
        class="detail-card"
        :class="{ dragging }"
        @mousedown="onDown"
        @touchstart.passive="onDown"
        @touchmove.prevent="onMove"
        @touchend="onUp"
      >
        <div
          class="detail-card-inner"
          :style="{
            transform: `rotateY(${angle}deg)`,
            transition: transitionEnabled ? 'transform 0.3s ease' : 'none',
          }"
        >
          <div
            class="detail-face front"
            :style="
              slot.filled
                ? {
                    borderColor:
                      'var(--color-rarity-' +
                      ['common', 'uncommon', 'rare', 'epic', 'legendary'][slot.rarity] +
                      ')',
                  }
                : {}
            "
          >
            <CardFace
              :subject-index="slot.subjectIndex"
              :rarity-index="slot.rarity"
              :filled="slot.filled"
              :card-no="slotIdx + 1"
            />
            <div v-if="slot.filled" class="detail-copy-badge">
              <CopiesIcon :size="13" />
              <span>×{{ spares }}</span>
            </div>
          </div>
          <div class="detail-face back flex items-center justify-center">
            <span class="text-[64px]" style="color: rgba(201, 162, 39, 0.28)">𓂀</span>
          </div>
        </div>
      </div>
      <button
        class="card-action-btn"
        :class="{ 'claimed-state': slot.claimed }"
        :disabled="actionDisabled"
        @click="claim"
      >
        {{ actionLabel }}
      </button>
    </div>
  </Modal>
</template>

<style scoped>
.detail-card-stage {
  perspective: 1400px;
}
.detail-card {
  width: var(--card-w);
  aspect-ratio: var(--card-ratio);
  cursor: grab;
  touch-action: none;
  user-select: none;
}
.detail-card.dragging {
  cursor: grabbing;
}
.detail-card-inner {
  width: 100%;
  height: 100%;
  position: relative;
  transform-style: preserve-3d;
}
.detail-face {
  position: absolute;
  inset: 0;
  border-radius: 16px;
  backface-visibility: hidden;
  overflow: hidden;
  border: 2px solid var(--color-line-strong);
  background: var(--color-panel);
  box-shadow: 0 16px 44px rgba(0, 0, 0, 0.45);
}
.detail-face.back {
  transform: rotateY(180deg);
}
.detail-copy-badge {
  position: absolute;
  bottom: 9px;
  right: 9px;
  z-index: 3;
  display: flex;
  align-items: center;
  gap: 4px;
  background: rgba(6, 13, 9, 0.75);
  border-radius: 6px;
  padding: 3px 7px;
  font-family: 'IBM Plex Mono', monospace;
  font-size: 11px;
  color: var(--color-ink);
}
.detail-copy-badge :deep(svg) {
  color: var(--color-gold);
}
.card-action-btn {
  font-family: 'Inter', sans-serif;
  font-size: 12px;
  font-weight: 600;
  border-radius: 6px;
  padding: 8px 16px;
  cursor: pointer;
  border: 1px solid var(--color-gold);
  background: transparent;
  color: var(--color-gold);
}
.card-action-btn.claimed-state {
  background: var(--color-gold);
  color: var(--color-gold-ink);
  cursor: default;
}
.card-action-btn:disabled {
  color: var(--color-ink-faint);
  border-color: var(--color-line-strong);
  cursor: default;
}
</style>
