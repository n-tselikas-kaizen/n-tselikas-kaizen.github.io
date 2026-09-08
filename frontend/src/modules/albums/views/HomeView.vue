<script setup lang="ts">
import { computed } from 'vue'
import { useAlbumsStore } from '../store'
import { CURRENT_ALBUM_ID } from '../constants'
import AlbumTile from '../components/AlbumTile.vue'
import { RARITIES } from '@/modules/common/constants'
import { usePacksStore } from '@/modules/packs/store'
import { useTradingStore } from '@/modules/trading/store'
import { useListingsStore } from '@/modules/listings/store'
import HomeAchievementCards from '@/modules/achievements/components/HomeAchievementCards.vue'

const albums = useAlbumsStore()
const packs = usePacksStore()
const trading = useTradingStore()
const listings = useListingsStore()

const complete = computed(() => albums.filledCount === albums.album.slots.length)
const tierColor = computed(() =>
  complete.value
    ? RARITIES[4].color
    : albums.currentProgressPct > 0
      ? 'var(--color-gold)'
      : 'var(--color-ink-faint)',
)
const progressText = computed(
  () =>
    `${Math.round(albums.currentProgressPct)}% complete (${albums.filledCount} / ${albums.album.slots.length} slots)`,
)
</script>

<template>
  <div>
    <p class="text-gold m-0 mb-2 font-mono text-xs tracking-[0.14em] uppercase">
      Betano Legends · homepage · Albums domain · not final art or copy
    </p>
    <div class="mb-0.5 flex items-baseline justify-between gap-3">
      <h1 class="m-0 text-[46px] leading-none">Betano Legends</h1>
      <RouterLink
        :to="{ name: 'how-to-play' }"
        title="How to Play"
        class="bg-panel-raised border-gold text-gold flex h-10 w-10 items-center justify-center rounded-[11px] border"
      >
        <span
          class="font-display flex h-[22px] w-[22px] items-center justify-center rounded-full border-2 border-current text-[13px] italic"
          >i</span
        >
      </RouterLink>
    </div>
    <p class="text-ink-dim mb-7 max-w-[660px] text-[14.5px] leading-relaxed">
      Pick an album to open it up.
    </p>

    <p class="font-display mb-3.5 text-xl">Available</p>
    <div class="mb-9 grid max-w-[600px] grid-cols-[repeat(auto-fill,minmax(140px,1fr))] gap-4">
      <RouterLink
        v-if="albums.album.active"
        :to="{ name: 'album', params: { albumId: CURRENT_ALBUM_ID } }"
      >
        <AlbumTile
          :name="albums.album.name"
          :theme="`Egyptian Gods · ${albums.album.slots.length} slots`"
          :progress-text="progressText"
          :tier-color="tierColor"
          :has-packs="packs.packInventory > 0"
          :has-trade-attention="trading.hasAttention"
          :has-sale-attention="listings.hasPendingSales"
        />
      </RouterLink>
    </div>

    <p class="font-display mb-3.5 text-xl">Upcoming</p>
    <div class="mb-2 grid grid-cols-3 gap-3.5 max-[760px]:grid-cols-1">
      <div class="bg-panel border-line-strong rounded-lg border border-dashed p-5 opacity-65">
        <span
          class="text-ink-faint border-line-strong mb-2.5 inline-block rounded border px-1.5 py-0.5 font-mono text-[10.5px] tracking-[0.08em] uppercase"
          >Coming soon</span
        >
        <p class="font-display m-0 mb-1 text-lg">Gates of the Pantheon</p>
        <p class="text-ink-faint m-0 text-xs leading-relaxed">
          Greek mythology universe — Gates of Olympus and friends.
        </p>
      </div>
      <div class="bg-panel border-line-strong rounded-lg border border-dashed p-5 opacity-65">
        <span
          class="text-ink-faint border-line-strong mb-2.5 inline-block rounded border px-1.5 py-0.5 font-mono text-[10.5px] tracking-[0.08em] uppercase"
          >Coming soon</span
        >
        <p class="font-display m-0 mb-1 text-lg">Provider Spotlight: Pragmatic Play</p>
        <p class="text-ink-faint m-0 text-xs leading-relaxed">
          Every slot pinned to one studio's catalogue instead of a theme.
        </p>
      </div>
      <div
        class="bg-panel rounded-lg border p-5 opacity-[0.82]"
        style="border-color: rgba(201, 162, 39, 0.4)"
      >
        <span
          class="text-gold-ink bg-gold border-gold mb-2.5 inline-block rounded border px-1.5 py-0.5 font-mono text-[10.5px] tracking-[0.08em] uppercase"
          >Gold+ exclusive</span
        >
        <p class="font-display m-0 mb-1 text-lg">Vault of the High Roller</p>
        <p class="text-ink-faint m-0 text-xs leading-relaxed">
          Only ever offered to Gold-tier players and above — an assignment decision, not a harder
          game.
        </p>
      </div>
    </div>

    <p class="font-display mt-8 mb-3.5 text-xl">Collections</p>
    <div
      v-if="!albums.album.active"
      class="mb-2 grid max-w-[600px] grid-cols-[repeat(auto-fill,minmax(140px,1fr))] gap-4"
    >
      <RouterLink :to="{ name: 'album', params: { albumId: CURRENT_ALBUM_ID } }">
        <AlbumTile
          :name="albums.album.name"
          theme="Egyptian Gods · Closed"
          :progress-text="progressText"
          :tier-color="tierColor"
          closed
        />
      </RouterLink>
    </div>
    <div
      v-if="albums.album.active"
      class="bg-panel border-line-strong mb-2 flex flex-wrap items-center justify-between gap-4 rounded-lg border border-dashed px-[22px] py-5"
    >
      <p class="text-ink-faint m-0 max-w-[500px] text-[13px] leading-relaxed">
        Closed albums move here once they stop being active — a running record of what you've
        already finished.
      </p>
      <button
        class="text-ink-faint border-line-strong cursor-default rounded-md border px-4 py-2 text-[12.5px] font-medium whitespace-nowrap"
        disabled
        title="Coming in a later iteration"
      >
        View all →
      </button>
    </div>

    <div class="mt-8">
      <HomeAchievementCards />
    </div>

    <p class="text-ink-faint border-line mt-8 border-t pt-3.5 text-[11px] leading-relaxed">
      Prototype for internal review. Game names, provider names, odds, and reward amounts are
      placeholders — not final economy numbers or confirmed licensing. All data is synthetic.<br />
      Build: 2026-09-08-b · 80 slots
    </p>
  </div>
</template>
