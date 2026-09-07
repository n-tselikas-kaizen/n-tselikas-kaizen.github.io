<script setup lang="ts">
import { useCardsStore } from '@/modules/cards/store'
import { useAlbumsStore } from '@/modules/albums/store'
import { useMarketplaceStore } from '@/modules/marketplace/store'
import ListingRow from '../components/ListingRow.vue'
import SellCarousel from '../components/SellCarousel.vue'
import { useListingsStore } from '../store'
import type { MarketListing } from '../types'

const props = defineProps<{ albumId: string }>()

const cards = useCardsStore()
const albums = useAlbumsStore()
const marketplace = useMarketplaceStore()
const listings = useListingsStore()

function diffLabel(l: MarketListing): string {
  const rec = cards.cardValueBC(l.rarity)
  if (Math.abs(l.price - rec) < 0.01) return 'at market rate'
  return l.price < rec ? 'below market rate' : 'above market rate'
}
</script>

<template>
  <div>
    <RouterLink
      :to="{ name: 'album', params: { albumId: props.albumId } }"
      class="text-ink-faint hover:text-ink-dim mb-[18px] inline-flex items-center gap-1 font-mono text-xs"
    >
      ← {{ albums.album.name }}
    </RouterLink>
    <p class="text-gold m-0 mb-2 font-mono text-xs tracking-[0.14em] uppercase">
      Listings · {{ albums.album.name }} · exclusive to this album
    </p>
    <h1 class="m-0 mb-1.5 text-[46px] leading-none">Listings</h1>
    <p class="text-ink-dim mb-7 max-w-[660px] text-[14.5px] leading-relaxed">
      Sell your spares from this album, or pick up what other players are offering — none of it
      crosses over to any other album, since a card pulled here only ever belongs here.
    </p>

    <template v-if="listings.hasPendingSales">
      <p class="font-display m-0 mb-3.5 text-xl">Sales to confirm</p>
      <div class="mb-2">
        <ListingRow
          v-for="sale in listings.pendingSaleConfirmations"
          :key="sale.id"
          :subject-index="sale.subjectIndex"
          :rarity="sale.rarity"
          :meta-text="'bought by ' + sale.buyer"
          :price="sale.price"
          action-label="Confirm"
          @action="listings.confirmSale(sale.id)"
        />
      </div>
    </template>

    <p class="font-display m-0 mb-3.5 text-xl">Sell your cards</p>
    <SellCarousel />

    <p class="font-display mt-[28px] mb-3.5 text-xl">Your active listings</p>
    <div>
      <ListingRow
        v-for="listing in listings.myListings"
        :key="listing.id"
        :subject-index="listing.subjectIndex"
        :rarity="listing.rarity"
        meta-text="listed by you"
        :price="listing.price"
        action-label="Cancel"
        action-variant="secondary"
        @action="listings.cancelListing(listing.id)"
      />
      <p v-if="listings.myListings.length === 0" class="text-ink-faint m-0 text-xs leading-relaxed">
        You have nothing listed right now.
      </p>
    </div>

    <p class="font-display mt-8 mb-3.5 text-xl">Browse listings</p>
    <div>
      <ListingRow
        v-for="listing in listings.marketListings"
        :key="listing.id"
        :subject-index="listing.subjectIndex"
        :rarity="listing.rarity"
        :meta-text="'sold by ' + listing.seller + ' · ' + diffLabel(listing)"
        :price="listing.price"
        action-label="Buy"
        :action-disabled="marketplace.wallet.bc < listing.price"
        @action="listings.buyListing(listing.id)"
      />
      <p
        v-if="listings.marketListings.length === 0"
        class="text-ink-faint m-0 text-xs leading-relaxed"
      >
        No listings available right now.
      </p>
    </div>

    <p class="text-ink-faint border-line mt-[22px] border-t pt-3.5 text-[11px] leading-relaxed">
      Mocked listings from synthetic demo accounts — not a real multi-user marketplace yet. If this
      album closes, any of your unsold listings here convert straight to BC along with the rest of
      your unclaimed spares.
    </p>
  </div>
</template>
