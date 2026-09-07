export type RarityKey = 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary'

export interface Rarity {
  key: RarityKey
  label: string
  color: string
  /** Canonical EUR value at this rarity — the basis for card BC value and the reward calibration indicator. */
  base: number
}

export type RewardTypeKey = 'freebet' | 'freespins' | 'cash' | 'bonusmoney'

export interface RewardType {
  key: RewardTypeKey
  label: string
  fmtValue: (v: number) => string
  toBC: (v: number) => number
}

/** A (subject, rarity) pair — the unit everything ownership/trading/listings deals in. */
export interface CardCombo {
  si: number
  ri: number
}

/** Payload for the Share modal (Social module) — produced by Albums, Packs, and Trading; consumed by Social. */
export interface ShareData {
  glyph: string
  color: string
  title: string
  subtitle: string
  body: string
}
