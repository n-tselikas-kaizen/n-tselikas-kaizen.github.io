import { defineStore } from 'pinia'
import { computed, reactive } from 'vue'
import { useCardsStore } from '@/modules/cards/store'
import { useAlbumsStore } from '@/modules/albums/store'
import { useAchievementsStore } from '@/modules/achievements/store'
import { useSocialStore } from '@/modules/social/store'
import { useMarketplaceStore } from '@/modules/marketplace/store'
import { DEMO_BUYER_NAMES } from './constants'
import type { Listing, MarketListing, PendingSale } from './types'

/**
 * Listings — exclusive to Eye of the Nile. This is NOT a cross-album
 * marketplace: a card pulled from this album's packs can only ever be
 * listed, browsed, or bought here. A future album would own its own
 * separate copies of everything below, never share these arrays.
 *
 * `marketListings` is seeded, mocked "other players'" activity for this
 * album — not backed by a real second account's ledger or wallet. It gets
 * cleared out (not paid out) the moment the album closes.
 */
export const useListingsStore = defineStore('listings', () => {
  const cards = useCardsStore()

  let myListingSeq = 1
  let saleConfirmSeq = 1

  /** The player's own active listings for this album — {id, subjectIndex, rarity, price}. */
  const myListings = reactive<Listing[]>([])

  /** Mocked "other players'" listings for this album — seeded, not backed by a real second account's ledger. */
  const marketListings = reactive<MarketListing[]>([
    { id: 'm1', seller: 'NileRunner88', subjectIndex: 0, rarity: 2, price: 2.5 },
    { id: 'm2', seller: 'ScarabQueen', subjectIndex: 6, rarity: 3, price: 5.5 },
    { id: 'm3', seller: 'PharaohFan', subjectIndex: 3, rarity: 1, price: 0.9 },
    { id: 'm4', seller: 'DeltaDrifter', subjectIndex: 7, rarity: 4, price: 16.0 },
    { id: 'm5', seller: 'SandStormer', subjectIndex: 1, rarity: 2, price: 2.2 },
  ])

  /** Sales awaiting player confirmation — {id, subjectIndex, rarity, price, buyer}. */
  const pendingSaleConfirmations = reactive<PendingSale[]>([])

  const hasPendingSales = computed(() => pendingSaleConfirmations.length > 0)

  /** Lists a spare card: pulls it out of the fungible ownership pool the moment it's listed. */
  function confirmSellListing(si: number, ri: number, price: number) {
    if (!cards.removeOwnership(si, ri, 1)) return
    myListings.push({ id: 'my' + myListingSeq++, subjectIndex: si, rarity: ri, price })
  }

  /** Cancels one of the player's own listings — the card goes back into the fungible pool. */
  function cancelListing(id: string) {
    const idx = myListings.findIndex((l) => l.id === id)
    if (idx < 0) return
    const listing = myListings[idx]
    cards.addOwnership(listing.subjectIndex, listing.rarity, 1)
    myListings.splice(idx, 1)
  }

  /** Buys another player's listing — spends shared BC, same wallet Marketplace's pack shop reads. */
  function buyListing(id: string) {
    const marketplace = useMarketplaceStore()
    const idx = marketListings.findIndex((l) => l.id === id)
    if (idx < 0) return
    const listing = marketListings[idx]
    if (marketplace.wallet.bc < listing.price) return
    marketplace.wallet.bc -= listing.price
    cards.addOwnership(listing.subjectIndex, listing.rarity, 1)
    marketListings.splice(idx, 1)
    useAlbumsStore().tryAutoFillSlots()
    useAchievementsStore().checkAchievements()
    useSocialStore().checkFullAlbumShare()
  }

  /**
   * Demo stand-in for "another player bought one of your listings." The
   * oldest active listing goes first — its card is already gone; what's
   * pending is only the BC credit and clearing the notification.
   */
  function simulateListingSale() {
    if (myListings.length === 0) return
    const sold = myListings.shift()
    if (!sold) return
    const buyer = DEMO_BUYER_NAMES[Math.floor(Math.random() * DEMO_BUYER_NAMES.length)]
    pendingSaleConfirmations.push({
      id: 'sale' + saleConfirmSeq++,
      subjectIndex: sold.subjectIndex,
      rarity: sold.rarity,
      price: sold.price,
      buyer,
    })
  }

  /** Credits exactly what the buyer paid, not the canonical rarity rate, and clears the notification. */
  function confirmSale(id: string) {
    const idx = pendingSaleConfirmations.findIndex((s) => s.id === id)
    if (idx < 0) return
    useMarketplaceStore().wallet.bc += pendingSaleConfirmations[idx].price
    pendingSaleConfirmations.splice(idx, 1)
  }

  /**
   * Closure liquidation. Any of the player's own unsold listings convert to
   * BC at the canonical rarity rate, same as the rest of their unclaimed
   * spares. Other players' listings just vanish — this demo doesn't track
   * other accounts' wallets, so there's no payout to credit for those.
   */
  function liquidateForClosure(): { bc: number; count: number } {
    let bc = 0
    let count = 0
    myListings.forEach((listing) => {
      bc += cards.cardValueBC(listing.rarity)
      count += 1
    })
    myListings.splice(0, myListings.length)
    marketListings.splice(0, marketListings.length)
    return { bc, count }
  }

  return {
    myListings,
    marketListings,
    pendingSaleConfirmations,
    hasPendingSales,
    confirmSellListing,
    cancelListing,
    buyListing,
    simulateListingSale,
    confirmSale,
    liquidateForClosure,
  }
})
