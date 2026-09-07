import { defineStore } from 'pinia'
import { reactive, ref } from 'vue'
import { RARITIES } from '@/modules/common/constants'
import { useToast } from '@/modules/common/composables/useToast'
import { useAlbumsStore } from '@/modules/albums/store'
import { useCardsStore } from '@/modules/cards/store'
import AchievementToast from './components/AchievementToast.vue'
import { ACHIEVEMENTS, TOAST_DWELL_MS } from './constants'
import type { Achievement, AchievementState } from './types'

/**
 * Synthetic history of albums this (returning) player has already closed
 * before today — gives the Social screen something to show on first look,
 * and leaves the flagship 100%-completion achievements just out of reach so
 * there's still something to unlock live.
 */
const SEEDED_CLOSED_ALBUMS: { pct: number }[] = [
  { pct: 35 },
  { pct: 60 },
  { pct: 80 },
  { pct: 100 },
  { pct: 45 },
  { pct: 70 },
  { pct: 55 },
  { pct: 100 },
]

export const useAchievementsStore = defineStore('achievements', () => {
  const toast = useToast()

  const closedAlbumsHistory = reactive<{ pct: number }[]>([...SEEDED_CLOSED_ALBUMS])

  /** Album-slot flips this session — the "water a flower" equivalent. */
  const flipCount = ref(0)

  /** Set at close time, since incomplete closures aren't pushed into closedAlbumsHistory. */
  const incompleteAfterFullFlag = ref(false)

  const unlockedAchievements = reactive<Record<string, boolean>>({})

  function recordCardFlip() {
    flipCount.value++
  }

  function achAlbumLabel(a: Achievement): string {
    return a.albumName || 'General'
  }

  function achRarityIndex(a: Achievement): number {
    return RARITIES.findIndex((r) => r.key === a.rarity)
  }

  function achRarityColor(a: Achievement): string {
    return RARITIES[achRarityIndex(a)].color
  }

  function computeAchievementState(ach: Achievement): AchievementState {
    switch (ach.kind) {
      case 'first-close': {
        const has = closedAlbumsHistory.length > 0
        return {
          unlocked: has,
          progress: has ? 'Unlocked' : 'Close your first album to earn this.',
        }
      }
      case 'first-full': {
        const has = closedAlbumsHistory.some((c) => c.pct === 100)
        return { unlocked: has, progress: has ? 'Unlocked' : 'Take one album to 100% completion.' }
      }
      case 'milestone-count': {
        const threshold = ach.threshold ?? 0
        const count = closedAlbumsHistory.filter((c) => c.pct === 100).length
        const current = Math.min(count, threshold)
        return {
          unlocked: count >= threshold,
          progress: `${current} / ${threshold} albums at 100%`,
          current,
          target: threshold,
        }
      }
      case 'total-count': {
        const threshold = ach.threshold ?? 0
        const count = closedAlbumsHistory.length
        const current = Math.min(count, threshold)
        return {
          unlocked: count >= threshold,
          progress: `${current} / ${threshold} albums closed`,
          current,
          target: threshold,
        }
      }
      case 'every-subject-started': {
        const albums = useAlbumsStore()
        const cards = useCardsStore()
        const allStarted = cards.subjects.every((_s, si) => {
          const slot = albums.getSlot(si, 0)
          return !!slot && slot.filled
        })
        return {
          unlocked: allStarted,
          progress: allStarted ? 'Unlocked' : 'Own at least the Common card for every subject.',
        }
      }
      case 'album-milestone': {
        const albums = useAlbumsStore()
        const threshold = ach.threshold ?? 0
        const pct = albums.currentProgressPct
        const has = pct >= threshold
        return {
          unlocked: has,
          progress: has ? 'Unlocked' : `${Math.round(pct)}% — needs ${threshold}%`,
        }
      }
      case 'flip-count': {
        const threshold = ach.threshold ?? 0
        const current = Math.min(flipCount.value, threshold)
        return {
          unlocked: flipCount.value >= threshold,
          progress: `${current} / ${threshold} flips`,
          current,
          target: threshold,
        }
      }
      case 'incomplete-after-full': {
        return {
          unlocked: incompleteAfterFullFlag.value,
          progress: incompleteAfterFullFlag.value
            ? 'Unlocked'
            : "Close an incomplete album after you've already taken one to 100%.",
        }
      }
      default:
        return { unlocked: false, progress: '' }
    }
  }

  /**
   * Silent=true marks already-qualifying achievements as owned without
   * toasting — used once at store creation so the seeded history doesn't
   * fire a wall of "unlocked!" banners before the player has done anything
   * themselves.
   */
  function checkAchievements(silent?: boolean) {
    ACHIEVEMENTS.forEach((ach) => {
      if (unlockedAchievements[ach.id]) return
      if (computeAchievementState(ach).unlocked) {
        unlockedAchievements[ach.id] = true
        if (!silent) {
          const dwell = TOAST_DWELL_MS[ach.rarity] ?? 2400
          toast.push(AchievementToast, { achievement: ach }, dwell)
        }
      }
    })
  }

  // Mirrors the original's load-time silent pass (main.js's boot sequence).
  checkAchievements(true)

  return {
    closedAlbumsHistory,
    flipCount,
    incompleteAfterFullFlag,
    unlockedAchievements,
    recordCardFlip,
    computeAchievementState,
    checkAchievements,
    achRarityIndex,
    achRarityColor,
    achAlbumLabel,
  }
})
