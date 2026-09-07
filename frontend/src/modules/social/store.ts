import { defineStore } from 'pinia'
import { reactive, ref } from 'vue'
import type { ShareData } from '@/modules/common/types'
import { useModal } from '@/modules/common/composables/useModal'
import { THEME_ICON } from '@/modules/cards/constants'
import { useAlbumsStore } from '@/modules/albums/store'
import ShareModal from './components/ShareModal.vue'
import { AVATAR_GLYPHS } from './constants'
import type { Profile } from './types'

export const useSocialStore = defineStore('social', () => {
  const profile = reactive<Profile>({
    name: 'Card Reader',
    avatarIdx: 0,
    equippedTitleId: null,
    equippedBadgeIds: [null, null, null],
  })

  /** Mocked feed, newest first — Social's "Recent Shares" list. */
  const sharedMoments = reactive<ShareData[]>([])

  /** Flipped true the first time ever a Legendary is pulled — the Packs module owns the check, we just hold the flag. */
  const hasEverPulledLegendary = ref(false)

  /**
   * Rare+ pull sharing is per *variation* (subject x rarity), not per pull —
   * otherwise pulling the same Rare 15 times offers sharing 15 times, and the
   * whole point of a short trigger list falls apart. Keys are `${si}-${ri}`.
   * Starts empty rather than seeded, same reasoning as hasEverPulledLegendary
   * above — keeps things live-demoable. Read/mutated directly by the Packs
   * module via `.has()`/`.add()`.
   */
  const seenRareVariations = reactive(new Set<string>())

  /** Fires once per album, the moment every slot first has something in it — internal, not part of the public contract. */
  const albumFullShareShown = ref(false)

  /** Opens the Share modal with the given preview payload; recording onto sharedMoments only happens if the player confirms. */
  function openShareModal(data: ShareData) {
    useModal().open(ShareModal, { data })
  }

  /** Called by ShareModal on confirm — unshifts the share onto the "Recent Shares" feed. */
  function addSharedMoment(data: ShareData) {
    sharedMoments.unshift(data)
  }

  /**
   * Once every slot has something in it for the first time — 100% completion
   * — independent of which action just filled the last gap. Called after any
   * acquisition that might complete the album.
   */
  function checkFullAlbumShare() {
    const albums = useAlbumsStore()
    if (albumFullShareShown.value || albums.filledCount < albums.album.slots.length) return
    albumFullShareShown.value = true
    openShareModal({
      glyph: THEME_ICON,
      color: 'var(--color-gold)',
      title: 'Every Slot Filled!',
      subtitle: albums.album.name,
      body: `Every slot in ${albums.album.name} has something in it now — 100% complete.`,
    })
  }

  function cycleAvatar() {
    profile.avatarIdx = (profile.avatarIdx + 1) % AVATAR_GLYPHS.length
  }

  function equipTitle(achId: string) {
    profile.equippedTitleId = achId
  }

  function removeTitle() {
    profile.equippedTitleId = null
  }

  /**
   * If this badge is already pinned in a different slot, the two slots swap
   * contents rather than the achievement just vanishing from the old one —
   * nothing gets silently unequipped by picking it somewhere else.
   */
  function equipBadgeToSlot(slotIndex: number, achId: string) {
    const otherIndex = profile.equippedBadgeIds.indexOf(achId)
    if (otherIndex >= 0 && otherIndex !== slotIndex) {
      profile.equippedBadgeIds[otherIndex] = profile.equippedBadgeIds[slotIndex]
    }
    profile.equippedBadgeIds[slotIndex] = achId
  }

  function removeBadge(slotIndex: number) {
    profile.equippedBadgeIds[slotIndex] = null
  }

  return {
    profile,
    sharedMoments,
    hasEverPulledLegendary,
    seenRareVariations,
    openShareModal,
    checkFullAlbumShare,
    addSharedMoment,
    cycleAvatar,
    equipTitle,
    removeTitle,
    equipBadgeToSlot,
    removeBadge,
  }
})
