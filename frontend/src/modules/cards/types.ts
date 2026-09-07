export type SubjectCategory =
  'CLASSIC' | 'FEATURE' | 'JACKPOT' | 'MEGAWAYS' | 'BONUS BUY' | 'PROVIDER'

/**
 * A game or provider in the catalog. `band` (0 = top popularity, 4 = bottom)
 * is the only thing that determines how many rarity slots it gets in an
 * album — see BAND_MAX_RARITY.
 */
export interface Subject {
  name: string
  provider: string
  cat: SubjectCategory
  band: 0 | 1 | 2 | 3 | 4
}
