export type SubjectCategory =
  'CLASSIC' | 'FEATURE' | 'JACKPOT' | 'MEGAWAYS' | 'BONUS BUY' | 'PROVIDER'

/**
 * A game or provider in the catalog. `slots` lists the exact rarity indices
 * (0=Common..4=Legendary) this subject has an album card for — popularity
 * decides one base rarity (Common/Uncommon/Rare for games, always Uncommon
 * for providers), and only the top performers additionally get a single
 * Epic or Legendary duplicate of that same card with richer art.
 */
export interface Subject {
  name: string
  provider: string
  cat: SubjectCategory
  slots: number[]
}
