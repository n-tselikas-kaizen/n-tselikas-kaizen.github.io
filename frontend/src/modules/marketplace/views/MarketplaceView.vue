<script setup lang="ts">
import { computed } from 'vue'
import BcIcon from '@/components/ui/icons/BcIcon.vue'
import PackShopCard from '../components/PackShopCard.vue'
import { useMarketplaceStore } from '../store'
import { PACK_SHOP } from '../constants'

const marketplace = useMarketplaceStore()

const showResetNote = computed(() =>
  Object.values(marketplace.shopPurchaseCounts).some((v) => v > 0),
)
</script>

<template>
  <div>
    <p class="text-gold m-0 mb-2 font-mono text-xs tracking-[0.14em] uppercase">
      Marketplace · item-agnostic shop · Betano Coins
    </p>
    <h1 class="m-0 mb-1.5 text-[46px] leading-none">Marketplace</h1>
    <p class="text-ink-dim mb-7 max-w-[660px] text-[14.5px] leading-relaxed">
      Betano Coins (BC), part of Betano's Loyalty schema — earned through play, never purchased with
      real money and never redeemable back into it. Spend BC on packs here, and on whatever else
      earns a place in this shop later. Card listings aren't here — a card only ever belongs to the
      one album it came from, so buying and selling them happens inside that album's own Listings
      screen.
    </p>

    <div
      class="bg-panel-raised border-line-strong mb-2 inline-flex items-center gap-[9px] rounded-full border py-[9px] pr-[18px] pl-[11px]"
    >
      <span
        class="bg-gold flex h-7 w-7 shrink-0 items-center justify-center overflow-hidden rounded-full"
      >
        <BcIcon :size="16" />
      </span>
      <b class="text-ink font-mono text-[17px]">{{ marketplace.wallet.bc.toFixed(2) }}</b>
      <span class="text-ink-faint font-mono text-xs">BC</span>
    </div>

    <p class="font-display mt-[22px] mb-3.5 text-xl">Packs</p>
    <div class="mb-2 grid grid-cols-[repeat(auto-fit,minmax(190px,1fr))] gap-3.5">
      <PackShopCard v-for="pack in PACK_SHOP" :key="pack.key" :pack="pack" />
    </div>
    <p v-if="showResetNote" class="text-ink-faint -mt-2 mb-3 text-xs leading-relaxed">
      Purchase limits reset on their normal day/week/month cadence — this demo session just tracks
      them as counters. (Reset control lives in Demo Tools.)
    </p>

    <p class="text-ink-faint border-line mt-[22px] border-t pt-3.5 text-[11px] leading-relaxed">
      Prices, bundle discounts, and purchase caps are placeholders pending a real economy-balance
      pass (Roadmap §6) and a responsible-gaming review (Roadmap §5) — packs bought here still open
      with random contents, same odds table as an earned pack. Once there's more than one album,
      this section groups by album — a small, curated catalog stays browsable without needing
      filters, unlike player listings.
    </p>
  </div>
</template>
