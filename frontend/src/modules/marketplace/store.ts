import { defineStore } from 'pinia'
import { reactive } from 'vue'
import { usePacksStore } from '@/modules/packs/store'
import { PACK_SHOP } from './constants'

export const useMarketplaceStore = defineStore('marketplace', () => {
  /** Betano Coins balance — demo starting balance, not derived from anything. Other modules (Albums closure liquidation, Listings buy/sell) read and mutate this directly. */
  const wallet = reactive({ bc: 250 })

  /** Demo-session counters standing in for real day/week/month purchase windows. */
  const shopPurchaseCounts = reactive<Record<string, number>>({
    single: 0,
    bundle10: 0,
    bundle30: 0,
  })

  function buyPack(key: string) {
    const entry = PACK_SHOP.find((p) => p.key === key)
    if (!entry) return
    if (shopPurchaseCounts[key] >= entry.cap || wallet.bc < entry.price) return
    wallet.bc -= entry.price
    shopPurchaseCounts[key] += 1
    usePacksStore().addPacks(entry.qty)
  }

  /** Used by Demo Tools to zero out the purchase-cap counters. */
  function resetPurchaseLimits() {
    Object.keys(shopPurchaseCounts).forEach((k) => {
      shopPurchaseCounts[k] = 0
    })
  }

  return { wallet, shopPurchaseCounts, buyPack, resetPurchaseLimits }
})
