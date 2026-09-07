import { defineStore } from 'pinia'
import { computed, reactive, ref } from 'vue'
import { RARITIES, REWARD_TYPES } from '@/modules/common/constants'
import { seedRng } from '@/modules/common/utils/rng'
import { useToast } from '@/modules/common/composables/useToast'
import { useCardsStore } from '@/modules/cards/store'
import { useAchievementsStore } from '@/modules/achievements/store'
import { useListingsStore } from '@/modules/listings/store'
import { useTradingStore } from '@/modules/trading/store'
import { useMarketplaceStore } from '@/modules/marketplace/store'
import { useSocialStore } from '@/modules/social/store'
import MilestoneToast from './components/MilestoneToast.vue'
import ClosureToast from './components/ClosureToast.vue'
import { CURRENT_ALBUM_ID, MILESTONES, MILESTONE_BONUS } from './constants'
import type { Album, AlbumSlot } from './types'

function buildAlbumSlots(): AlbumSlot[] {
  const cards = useCardsStore()
  const slots: AlbumSlot[] = []
  cards.subjects.forEach((_s, si) => {
    const maxR = cards.subjectMaxRarity(si)
    for (let ri = 0; ri <= maxR; ri++) {
      slots.push({ subjectIndex: si, rarity: ri, filled: false, claimed: false })
    }
  })
  return slots
}

export const useAlbumsStore = defineStore('albums', () => {
  const cards = useCardsStore()
  const toast = useToast()

  const album = reactive<Album>({
    id: CURRENT_ALBUM_ID,
    name: 'Eye of the Nile',
    active: true,
    slots: buildAlbumSlots(),
  })

  const slotLookup = new Map<string, number>()
  album.slots.forEach((slot, idx) => slotLookup.set(slot.subjectIndex + '-' + slot.rarity, idx))

  /** One reward TYPE per subject (rarity only changes the amount within that subject's family of slots). */
  const subjectRewardType = cards.subjects.map(
    () => REWARD_TYPES[Math.floor(seedRng() * REWARD_TYPES.length)],
  )

  const claimedMilestones = reactive<number[]>([])
  const milestoneBonusTotal = ref(0)

  function getSlot(si: number, ri: number): AlbumSlot | null {
    const idx = slotLookup.get(si + '-' + ri)
    return idx === undefined ? null : album.slots[idx]
  }

  const filledCount = computed(() => album.slots.filter((s) => s.filled).length)

  const currentProgressPct = computed(() => {
    if (album.slots.length === 0) return 0
    return (filledCount.value / album.slots.length) * 100
  })

  /** "Rewards claimed" scoreboard total — claimed slots' EUR value plus milestone bonuses. */
  const claimedRewardsTotal = computed(
    () =>
      album.slots.filter((s) => s.claimed).reduce((sum, s) => sum + RARITIES[s.rarity].base, 0) +
      milestoneBonusTotal.value,
  )

  function nextUnclaimedMilestoneIndex(): number {
    const pct = currentProgressPct.value
    for (let i = 0; i < MILESTONES.length; i++) {
      if (MILESTONES[i] <= pct && !claimedMilestones.includes(i)) return i
    }
    return -1
  }

  function fmtSlotReward(si: number, rarityIdx: number): string {
    const type = subjectRewardType[si]
    return type.fmtValue(RARITIES[rarityIdx].base) + ' ' + type.label
  }

  /** The reward calibration indicator: what this slot's actual configured reward is worth in BC. */
  function slotRewardValueBC(si: number, rarityIdx: number): number {
    return subjectRewardType[si].toBC(RARITIES[rarityIdx].base)
  }

  /**
   * Auto-fill pass — the only place a slot ever flips to `filled`. Call after
   * every acquisition path (pack collect, buying a listing, claiming a trade).
   */
  function tryAutoFillSlots(): boolean {
    let anyFilled = false
    album.slots.forEach((slot) => {
      if (slot.filled) return
      if (cards.ownership[slot.subjectIndex][slot.rarity] > 0) {
        cards.ownership[slot.subjectIndex][slot.rarity] -= 1
        slot.filled = true
        anyFilled = true
      }
    })
    return anyFilled
  }

  function claimSlotReward(si: number, ri: number) {
    const slot = getSlot(si, ri)
    if (!slot || !slot.filled || slot.claimed) return
    slot.claimed = true
  }

  function claimSlotAt(slotIdx: number) {
    const slot = album.slots[slotIdx]
    if (!slot || !slot.filled || slot.claimed) return
    slot.claimed = true
    useAchievementsStore().checkAchievements()
  }

  function claimAllSlotRewards() {
    album.slots.forEach((slot) => {
      if (slot.filled && !slot.claimed) claimSlotReward(slot.subjectIndex, slot.rarity)
    })
  }

  function claimAllUI() {
    claimAllSlotRewards()
    useAchievementsStore().checkAchievements()
  }

  function claimMilestone(i: number) {
    if (i < 0 || claimedMilestones.includes(i)) return
    claimedMilestones.push(i)
    milestoneBonusTotal.value += MILESTONE_BONUS[i]
    toast.push(MilestoneToast, { pct: MILESTONES[i], bonus: MILESTONE_BONUS[i] }, 2600)
  }

  /**
   * Closure liquidation. Once this album is gone there's nowhere left for any
   * of its cards to matter, so everything still outstanding (spares, active
   * listings, in-flight trades) converts to BC at the canonical rarity rate.
   */
  function closeAlbum() {
    const achievements = useAchievementsStore()
    const listings = useListingsStore()
    const trading = useTradingStore()
    const marketplace = useMarketplaceStore()
    const social = useSocialStore()

    claimAllSlotRewards()
    let m: number
    while ((m = nextUnclaimedMilestoneIndex()) >= 0) claimMilestone(m)

    trading.liquidateForClosure()
    const { bc: listingsBc, count: listingsCount } = listings.liquidateForClosure()
    let liquidatedBC = listingsBc
    let liquidatedCount = listingsCount

    cards.ownership.forEach((rarities, si) => {
      rarities.forEach((qty, ri) => {
        if (qty > 0) {
          liquidatedBC += cards.cardValueBC(ri) * qty
          liquidatedCount += qty
          cards.ownership[si][ri] = 0
        }
      })
    })

    if (liquidatedBC > 0) {
      marketplace.wallet.bc += liquidatedBC
      const count = liquidatedCount
      toast.push(
        ClosureToast,
        {
          text: `${count} unsold card${count === 1 ? '' : 's'} converted to ${liquidatedBC.toFixed(2)} BC`,
        },
        3400,
      )
    }

    const pct = currentProgressPct.value
    const wasFull = pct === 100
    const albumName = album.name
    if (!wasFull && achievements.closedAlbumsHistory.some((c) => c.pct === 100)) {
      achievements.incompleteAfterFullFlag = true
    }
    achievements.closedAlbumsHistory.push({ pct })
    album.active = false
    achievements.checkAchievements()

    if (wasFull) {
      social.openShareModal({
        glyph: '♛',
        color: RARITIES[4].color,
        title: 'Album Completed!',
        subtitle: albumName,
        body: `${albumName} just closed at 100% completion — every slot filled.`,
      })
    }
  }

  return {
    album,
    subjectRewardType,
    claimedMilestones,
    milestoneBonusTotal,
    getSlot,
    filledCount,
    currentProgressPct,
    claimedRewardsTotal,
    nextUnclaimedMilestoneIndex,
    fmtSlotReward,
    slotRewardValueBC,
    tryAutoFillSlots,
    claimSlotAt,
    claimAllUI,
    claimMilestone,
    closeAlbum,
  }
})
