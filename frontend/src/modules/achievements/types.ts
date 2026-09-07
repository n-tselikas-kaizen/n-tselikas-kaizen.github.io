import type { RarityKey } from '@/modules/common/types'

/** Which mechanic grants an achievement — currently only Albums exists; a future domain (betting, streaks) would tag its own without touching this one. */
export type AchievementGroup = 'generic' | 'album'

export type AchievementKind =
  | 'first-close'
  | 'first-full'
  | 'milestone-count'
  | 'total-count'
  | 'every-subject-started'
  | 'album-milestone'
  | 'flip-count'
  | 'incomplete-after-full'

export type AchievementReward = 'badge' | 'badge+title'

export interface Achievement {
  id: string
  group: AchievementGroup
  kind: AchievementKind
  threshold?: number
  name: string
  desc: string
  /** Shown instead of `desc` while a hidden achievement is still locked (mystery row). */
  hint?: string
  /** Mystery/puzzle achievement — name and progress are hidden until unlocked. */
  hidden?: boolean
  rarity: RarityKey
  glyph: string
  reward: AchievementReward
  /** Title granted on unlock — only present when `reward === 'badge+title'`. */
  title?: string
  /** Which mechanic grants this achievement (only 'albums' exists today). */
  domain: string
  /** Finer-grained axis within a domain — omitted/undefined means collection-wide ("General"). */
  albumName?: string
}

export interface AchievementState {
  unlocked: boolean
  progress: string
  current?: number
  target?: number
}
