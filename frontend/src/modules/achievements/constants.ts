import type { RarityKey } from '@/modules/common/types'
import type { Achievement } from './types'

/** Raw seed shape — `domain`/`albumName` are filled in by the `forEach` below, exactly like the original. */
type AchievementSeed = Omit<Achievement, 'domain' | 'albumName'> &
  Partial<Pick<Achievement, 'domain' | 'albumName'>>

const SEED: AchievementSeed[] = [
  // ---- Generic / cross-album ----
  {
    id: 'g_first_close',
    group: 'generic',
    kind: 'first-close',
    name: 'First Close',
    desc: 'Close your first album, any completion %.',
    rarity: 'common',
    glyph: '✦',
    reward: 'badge',
  },
  {
    id: 'g_first_100',
    group: 'generic',
    kind: 'first-full',
    name: 'The Completionist',
    desc: 'Take an album to 100% completion for the first time.',
    rarity: 'legendary',
    glyph: '✦',
    reward: 'badge+title',
    title: 'The Completionist',
  },
  {
    id: 'g_milestone_100_5',
    group: 'generic',
    kind: 'milestone-count',
    threshold: 5,
    name: 'Serial Completionist',
    desc: 'Take 5 albums to 100% completion.',
    rarity: 'epic',
    glyph: '⬢',
    reward: 'badge',
  },
  {
    id: 'g_milestone_100_10',
    group: 'generic',
    kind: 'milestone-count',
    threshold: 10,
    name: 'Vault Completionist',
    desc: 'Take 10 albums to 100% completion.',
    rarity: 'legendary',
    glyph: '⬢',
    reward: 'badge+title',
    title: 'Vault Legend',
  },
  {
    id: 'g_collector_10',
    group: 'generic',
    kind: 'total-count',
    threshold: 10,
    name: 'Collector',
    desc: 'Close 10 albums, any completion.',
    rarity: 'uncommon',
    glyph: '⬢',
    reward: 'badge',
  },
  {
    id: 'g_collector_25',
    group: 'generic',
    kind: 'total-count',
    threshold: 25,
    name: 'The Archivist',
    desc: 'Close 25 albums, any completion.',
    rarity: 'legendary',
    glyph: '⬢',
    reward: 'badge+title',
    title: 'The Archivist',
  },
  // ---- Novelty / easter-egg (titles here aren't gated to difficulty — some
  // are earned by noticing something odd or repeating a trivial action, not
  // by grinding) ----
  {
    id: 'g_unfinished_tomb',
    group: 'generic',
    kind: 'incomplete-after-full',
    name: 'The Unfinished Tomb',
    desc: "Close an album with slots still empty, after you've already taken one to 100% elsewhere. A little ironic, isn't it?",
    hint: "Reaching the summit once doesn't mean every climb after needs to be finished.",
    hidden: true,
    rarity: 'rare',
    glyph: '𓉐',
    reward: 'badge+title',
    title: 'The Unfinished Tomb',
  },
  // ---- Per-album (scoped to Eye of the Nile here; the same set generalizes to any future album) ----
  {
    id: 'a_full_house',
    group: 'album',
    kind: 'every-subject-started',
    name: 'Full House',
    desc: 'Own at least the Common card for every subject in this album — breadth, not depth.',
    rarity: 'common',
    glyph: '▦',
    reward: 'badge',
  },
  {
    id: 'a_milestone_50',
    group: 'album',
    kind: 'album-milestone',
    threshold: 50,
    name: 'Halfway There',
    desc: 'Reach 50% completion on this album.',
    rarity: 'uncommon',
    glyph: '✓',
    reward: 'badge',
  },
  {
    id: 'a_milestone_100',
    group: 'album',
    kind: 'album-milestone',
    threshold: 100,
    name: 'Flawless Finish',
    desc: 'Reach 100% completion on this album — every slot filled.',
    rarity: 'legendary',
    glyph: '♛',
    reward: 'badge+title',
    title: 'Flawless',
  },
  {
    id: 'a_idle_hands',
    group: 'album',
    kind: 'flip-count',
    threshold: 10,
    name: 'Keeper of Idle Hands',
    desc: "Flip an album slot back and forth 10 times, just to see what's there.",
    hint: 'Not every question needs a new answer. Sometimes it just wants to be asked again.',
    hidden: true,
    rarity: 'uncommon',
    glyph: '⬢',
    reward: 'badge+title',
    title: 'Idle Hands',
  },
]

// Every achievement belongs to a domain (which mechanic grants it) — currently
// only Albums, ready for a future domain (betting, streaks) to tag its own
// achievements without touching this file. albumName is the finer-grained axis
// within Albums: undefined means collection-wide ("General"), otherwise it's
// scoped to one specific album by name.
SEED.forEach((a) => {
  if (!a.domain) a.domain = 'albums'
  if (a.group === 'album' && !a.albumName) a.albumName = 'Eye of the Nile'
})

export const ACHIEVEMENTS: Achievement[] = SEED as Achievement[]

// Dwell time and visual weight both scale with rarity — a Common badge is a
// quiet corner note, a Legendary badge+title is the big celebratory moment,
// matching how MMOs weight rare-title announcements.
export const TOAST_DWELL_MS: Record<RarityKey, number> = {
  common: 2200,
  uncommon: 2400,
  rare: 2800,
  epic: 3400,
  legendary: 4400,
}
