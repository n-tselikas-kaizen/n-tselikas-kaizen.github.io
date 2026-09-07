<script setup lang="ts">
import { useAlbumsStore } from '../store'
import { CURRENT_ALBUM_ID } from '../constants'
import Scoreboard from '../components/Scoreboard.vue'
import MilestoneBar from '../components/MilestoneBar.vue'
import SlotGrid from '../components/SlotGrid.vue'
import TradeIcon from '@/components/ui/icons/TradeIcon.vue'
import BcIcon from '@/components/ui/icons/BcIcon.vue'
import Button from '@/components/ui/Button.vue'
import { usePacksStore } from '@/modules/packs/store'
import { useTradingStore } from '@/modules/trading/store'
import { useListingsStore } from '@/modules/listings/store'
import AlbumAchievementTeaser from '@/modules/achievements/components/AlbumAchievementTeaser.vue'

const albums = useAlbumsStore()
const packs = usePacksStore()
const trading = useTradingStore()
const listings = useListingsStore()

function claimAll() {
  albums.claimAllUI()
}
</script>

<template>
  <div>
    <RouterLink
      :to="{ name: 'home' }"
      class="text-ink-faint hover:text-ink-dim mb-[18px] inline-flex items-center gap-1 font-mono text-xs"
    >
      ← Albums
    </RouterLink>
    <p class="text-gold m-0 mb-2 font-mono text-xs tracking-[0.14em] uppercase">
      Albums domain · {{ albums.album.name }}
    </p>
    <h1 class="m-0 mb-1.5 text-[46px] leading-none">{{ albums.album.name }}</h1>
    <p class="text-ink-dim mb-7 max-w-[660px] text-[14.5px] leading-relaxed">
      Tap a card to see what you've got.
    </p>

    <Scoreboard />
    <p class="font-display my-5 mb-2.5 text-xl">Completion</p>
    <MilestoneBar />

    <AlbumAchievementTeaser />

    <div class="mb-3.5 flex flex-wrap items-baseline justify-between gap-3">
      <p class="font-display m-0 text-xl">Slots</p>
      <div class="flex items-center gap-2.5">
        <Button
          variant="secondary"
          class="!px-[18px] !py-2.5 !text-[13px]"
          :equipped="false"
          :disabled="
            !albums.album.active || !albums.album.slots.some((s) => s.filled && !s.claimed)
          "
          @click="claimAll"
        >
          Claim all
        </Button>
        <span class="relative inline-flex">
          <RouterLink
            :to="{ name: 'pack', params: { albumId: CURRENT_ALBUM_ID } }"
            title="Packs"
            class="bg-gold text-gold-ink flex h-10 w-10 items-center justify-center rounded-[11px]"
          >
            <span
              class="font-display flex h-5 w-5 items-center justify-center rounded border-[1.5px] border-current text-[13px]"
              >?</span
            >
          </RouterLink>
          <span
            v-if="packs.packInventory > 0"
            class="border-bg absolute -top-1 -right-1 h-3 w-3 rounded-full border-2"
            style="background: var(--color-rarity-uncommon)"
          />
        </span>
        <span class="relative inline-flex">
          <RouterLink
            :to="{ name: 'trade', params: { albumId: CURRENT_ALBUM_ID } }"
            title="Trade"
            class="bg-gold text-gold-ink flex h-10 w-10 items-center justify-center rounded-[11px]"
          >
            <TradeIcon :size="22" />
          </RouterLink>
          <span
            v-if="trading.hasAttention"
            class="border-bg absolute -top-1 -right-1 h-3 w-3 rounded-full border-2"
            :style="{
              background: trading.needsReview
                ? 'var(--color-rarity-rare)'
                : 'var(--color-rarity-uncommon)',
            }"
          />
        </span>
        <span class="relative inline-flex">
          <RouterLink
            :to="{ name: 'listings', params: { albumId: CURRENT_ALBUM_ID } }"
            title="Listings"
            class="bg-gold text-gold-ink flex h-10 w-10 items-center justify-center rounded-[11px]"
          >
            <BcIcon :size="22" />
          </RouterLink>
          <span
            v-if="listings.hasPendingSales"
            class="border-bg absolute -top-1 -right-1 h-3 w-3 rounded-full border-2"
            style="background: var(--color-rarity-uncommon)"
          />
        </span>
      </div>
    </div>

    <SlotGrid />
  </div>
</template>
