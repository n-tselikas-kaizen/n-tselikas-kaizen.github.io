import type { ShareData } from '@/modules/common/types'

/** Re-exported so social's own files can `import type { ShareData } from './types'` alongside Profile/SharedMoment. */
export type { ShareData }

export interface Profile {
  name: string
  avatarIdx: number
  equippedTitleId: string | null
  /** Fixed 3 slots (not a growable list) — the badge modal targets a specific slot index and can swap. */
  equippedBadgeIds: [string | null, string | null, string | null]
}

/** A confirmed share, as it sits in the "Recent Shares" feed — same shape as the modal payload that produced it. */
export type SharedMoment = ShareData
