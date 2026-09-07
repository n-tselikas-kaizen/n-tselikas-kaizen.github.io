<script setup lang="ts">
import { ref } from 'vue'
import Modal from '@/components/ui/Modal.vue'
import Button from '@/components/ui/Button.vue'
import { useModal } from '@/modules/common/composables/useModal'
import type { ShareData } from '@/modules/common/types'
import { useSocialStore } from '../store'

const props = defineProps<{ data: ShareData }>()

const social = useSocialStore()
const { close } = useModal()
const shared = ref(false)

function confirmShare() {
  social.addSharedMoment(props.data)
  shared.value = true
  setTimeout(() => close(), 1600)
}
</script>

<template>
  <Modal>
    <template v-if="!shared">
      <p class="font-display m-0 mb-1 pr-9 text-[25px] tracking-[0.02em]">Share this?</p>
      <p class="text-ink-faint m-0 mb-1 text-[12.5px] leading-relaxed">
        A showcase only — nothing posts to Betano's real Social platform, but it'll show up in your
        profile's Recent Shares.
      </p>
      <div class="share-preview-card" :style="{ borderColor: data.color }">
        <div class="share-preview-glyph" :style="{ color: data.color }">{{ data.glyph }}</div>
        <p class="share-preview-title">{{ data.title }}</p>
        <p class="share-preview-subtitle">{{ data.subtitle }}</p>
        <p class="share-preview-body">{{ data.body }}</p>
      </div>
      <div class="flex gap-2.5">
        <Button class="flex-1" @click="confirmShare">Share to Profile</Button>
        <Button variant="secondary" class="shrink-0" @click="close">Not now</Button>
      </div>
    </template>
    <template v-else>
      <p class="font-display m-0 mb-1 pr-9 text-[25px] tracking-[0.02em]">Shared!</p>
      <p class="text-ink-faint m-0 text-[12.5px] leading-relaxed">
        (Mocked — no real post was made, but check your profile's Recent Shares.)
      </p>
    </template>
  </Modal>
</template>

<style scoped>
.share-preview-card {
  border: 2px solid var(--color-gold);
  border-radius: 10px;
  padding: 22px 20px;
  text-align: center;
  background: var(--color-panel);
  margin: 16px 0 18px;
}
.share-preview-glyph {
  font-size: 38px;
  margin-bottom: 8px;
  line-height: 1;
}
.share-preview-title {
  font-family: 'Bebas Neue', sans-serif;
  font-size: 21px;
  letter-spacing: 0.02em;
  margin: 0 0 2px;
  color: var(--color-ink);
}
.share-preview-subtitle {
  font-family: 'IBM Plex Mono', monospace;
  font-size: 11px;
  color: var(--color-ink-faint);
  margin: 0 0 10px;
  text-transform: uppercase;
  letter-spacing: 0.04em;
}
.share-preview-body {
  font-size: 12.5px;
  color: var(--color-ink-dim);
  line-height: 1.55;
  margin: 0;
}
</style>
