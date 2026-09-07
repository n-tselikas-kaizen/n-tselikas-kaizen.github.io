<script setup lang="ts">
import TradeIcon from '@/components/ui/icons/TradeIcon.vue'
import BcIcon from '@/components/ui/icons/BcIcon.vue'

withDefaults(
  defineProps<{
    name: string
    theme: string
    progressText: string
    tierColor: string
    closed?: boolean
    hasPacks?: boolean
    hasTradeAttention?: boolean
    hasSaleAttention?: boolean
  }>(),
  { closed: false, hasPacks: false, hasTradeAttention: false, hasSaleAttention: false },
)
</script>

<template>
  <div class="album-tile-wrap relative">
    <div
      class="bg-panel-raised border-line-strong hover:border-gold cursor-pointer overflow-hidden rounded-[10px] border transition-colors"
    >
      <div
        class="relative flex h-[200px] items-center justify-center text-[44px]"
        style="
          color: rgba(201, 162, 39, 0.55);
          background:
            radial-gradient(circle at 30% 20%, rgba(201, 162, 39, 0.35), transparent 60%),
            linear-gradient(160deg, #1c3524, #0b1710);
        "
      >
        𓂀
      </div>
      <div class="px-4 pt-3.5 pb-4">
        <p class="font-display m-0 mb-[3px] text-[19px]">{{ name }}</p>
        <p class="text-ink-faint m-0 mb-2.5 font-mono text-[10.5px]">{{ theme }}</p>
        <div class="text-ink-dim flex items-center gap-1.5 text-[11.5px]">
          <span class="h-2 w-2 rounded-full" :style="{ background: tierColor }" />
          {{ progressText }}
        </div>
      </div>
    </div>
    <div v-if="!closed" class="absolute top-5 -right-2.5 flex flex-col gap-1.5">
      <span
        v-if="hasPacks"
        class="border-gold-ink flex h-7 w-5 items-center justify-center rounded-[5px] border-[1.5px]"
        style="background: var(--color-gold)"
        title="Packs on hand for this album"
      >
        <span class="font-display text-gold-ink text-sm leading-none">?</span>
      </span>
      <span
        v-if="hasTradeAttention"
        class="border-gold-ink flex h-7 w-5 items-center justify-center rounded-[5px] border-[1.5px]"
        style="background: var(--color-gold)"
        title="Trade needs your attention"
      >
        <TradeIcon :size="13" color="var(--color-gold-ink)" />
      </span>
      <span
        v-if="hasSaleAttention"
        class="border-gold-ink flex h-7 w-5 items-center justify-center rounded-[5px] border-[1.5px]"
        style="background: var(--color-gold)"
        title="A listing sold — confirm it in Listings"
      >
        <BcIcon :size="12" />
      </span>
    </div>
  </div>
</template>
