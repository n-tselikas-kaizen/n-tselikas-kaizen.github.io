<script setup lang="ts">
import CardFace from '@/modules/cards/components/CardFace.vue'

/**
 * One "trade table" slot — full card size so a filled slot reads as an
 * actual card (art, rarity badge, overlay) rather than a small icon. Tapping
 * a filled+interactive slot reopens the picker for that slot (to swap the
 * choice); the hover-revealed remove overlay clears it directly instead.
 * Empty slots are always interactive (there's nothing to view read-only).
 */
withDefaults(
  defineProps<{
    si?: number | null
    ri?: number | null
    interactive?: boolean
  }>(),
  { si: null, ri: null, interactive: true },
)
defineEmits<{ open: []; remove: [] }>()
</script>

<template>
  <button
    v-if="si === null || ri === null"
    type="button"
    class="border-line-strong bg-panel hover:border-gold flex w-[150px] flex-col items-center justify-center rounded-xl border-[1.5px] border-dashed p-0 font-sans"
    style="aspect-ratio: 260 / 427"
    @click="$emit('open')"
  >
    <span class="text-ink-faint text-[34px] leading-none">+</span>
  </button>
  <div
    v-else
    class="group relative w-[150px] overflow-hidden rounded-xl"
    :class="interactive ? 'cursor-pointer' : 'cursor-default opacity-[0.92]'"
    style="aspect-ratio: 260 / 427"
    @click="interactive && $emit('open')"
  >
    <CardFace :subject-index="si" :rarity-index="ri" />
    <div
      v-if="interactive"
      class="absolute inset-0 z-[4] flex items-center justify-center opacity-0 transition-opacity duration-150 group-hover:opacity-100"
      style="background: rgba(6, 13, 9, 0.72)"
      title="Remove"
      @click.stop="$emit('remove')"
    >
      <span class="text-ink text-[34px] leading-none">−</span>
    </div>
  </div>
</template>
