import { defineStore } from 'pinia'
import { ref } from 'vue'
import { weightedDraw } from '@/modules/common/utils/rng'
import { useCardsStore } from '@/modules/cards/store'
import { useAlbumsStore } from '@/modules/albums/store'
import { useAchievementsStore } from '@/modules/achievements/store'
import { useSocialStore } from '@/modules/social/store'
import { PACK_ODDS } from './constants'
import type { Pull } from './types'

/**
 * Packs — draws + commits pulls, nothing about the reveal UI. A pack's
 * contents are real the instant they're drawn (see openPack), never gated
 * behind a later "Add to album" tap or any of the fly-apart/reveal
 * animation the caller plays afterwards.
 */
export const usePacksStore = defineStore('packs', () => {
  const cards = useCardsStore()
  const albums = useAlbumsStore()

  /** "Eye of the Nile" packs on hand. */
  const packInventory = ref(2)

  /** Skip the one-at-a-time reveal, jump straight to the full 5-card grid. */
  const quickOpenMode = ref(false)

  /** Grants packs — the contract other modules (Loyalty actions, Marketplace, Demo Tools) grant packs through. */
  function addPacks(n = 1) {
    packInventory.value += n
  }

  /**
   * Draws 5 pulls and commits them to the ownership ledger immediately —
   * before a single frame of the cut/fly/reveal animation plays. Tags each
   * pull `isNewFill` (this exact copy filled a previously-empty slot),
   * de-duping within the same pack: if a pack pulls the same never-owned
   * (subject, rarity) twice, only the first counts as "new".
   */
  function openPack(): Pull[] {
    const achievements = useAchievementsStore()
    const social = useSocialStore()

    packInventory.value -= 1

    const pulls: Pull[] = []
    for (let i = 0; i < 5; i++) {
      const rarity = weightedDraw(PACK_ODDS)
      const subjectIndex = Math.floor(Math.random() * cards.subjects.length)
      pulls.push({ subjectIndex, rarity, isNewFill: false })
    }

    const claimedThisBatch = new Set<string>()
    pulls.forEach((p) => {
      const slot = cards.slotExists(p.subjectIndex, p.rarity)
        ? albums.getSlot(p.subjectIndex, p.rarity)
        : null
      const key = p.subjectIndex + '-' + p.rarity
      p.isNewFill = !!(slot && !slot.filled && !claimedThisBatch.has(key))
      if (p.isNewFill) claimedThisBatch.add(key)
      cards.addOwnership(p.subjectIndex, p.rarity, 1)
    })

    albums.tryAutoFillSlots()
    achievements.checkAchievements()
    social.checkFullAlbumShare()

    return pulls
  }

  return { packInventory, quickOpenMode, addPacks, openPack }
})
