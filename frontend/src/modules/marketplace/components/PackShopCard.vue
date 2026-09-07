<script setup lang="ts">
import { computed } from 'vue'
import BcIcon from '@/components/ui/icons/BcIcon.vue'
import Button from '@/components/ui/Button.vue'
import { useMarketplaceStore } from '../store'
import { PACK_SHOP } from '../constants'
import type { PackShopEntry } from '../types'

const props = defineProps<{ pack: PackShopEntry }>()

const marketplace = useMarketplaceStore()

/** Single-pack price is the reference bundles "save" against. */
const baselinePrice = PACK_SHOP[0].price

const used = computed(() => marketplace.shopPurchaseCounts[props.pack.key] ?? 0)
const capped = computed(() => used.value >= props.pack.cap)
const perPackPrice = computed(() => props.pack.price / props.pack.qty)
const savingsPct = computed(() =>
  props.pack.key === PACK_SHOP[0].key
    ? null
    : Math.round((1 - perPackPrice.value / baselinePrice) * 100),
)
const disabled = computed(() => capped.value || marketplace.wallet.bc < props.pack.price)

function buy() {
  marketplace.buyPack(props.pack.key)
}
</script>

<template>
  <div class="bg-panel border-line-strong rounded-[10px] border p-[18px] text-center">
    <p class="font-display m-0 mb-1 text-[19px]">{{ pack.label }}</p>
    <p class="text-ink-faint m-0 mb-3 font-mono text-[11px]">
      {{ pack.qty }} pack{{ pack.qty > 1 ? 's' : '' }} · Eye of the Nile
    </p>

    <div class="mb-1.5 flex items-center justify-center gap-[7px]">
      <span
        class="bg-gold flex h-7 w-7 shrink-0 items-center justify-center overflow-hidden rounded-full"
      >
        <BcIcon :size="16" />
      </span>
      <span class="text-ink font-mono text-[21px] font-semibold">{{ pack.price.toFixed(0) }}</span>
    </div>

    <p class="text-rarity-uncommon m-0 mb-3 min-h-[12px] font-mono text-[10px]">
      {{ savingsPct ? `Save ${savingsPct}% vs single packs` : '' }}
    </p>

    <p class="text-ink-faint m-0 mb-3 text-[11px] leading-relaxed">
      Limit {{ pack.limitLabel }} · {{ used }} / {{ pack.cap }} used{{
        capped ? ' (demo period)' : ''
      }}
    </p>

    <Button variant="primary" class="w-full" :disabled="disabled" @click="buy">
      {{ capped ? 'Limit reached' : 'Buy' }}
    </Button>
  </div>
</template>
