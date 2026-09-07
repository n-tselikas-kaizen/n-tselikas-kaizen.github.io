/** One buyable entry in the BC pack shop (Marketplace screen). */
export interface PackShopEntry {
  key: string
  label: string
  /** How many packs this entry grants when bought. */
  qty: number
  /** Total BC cost for the whole entry (not per-pack). */
  price: number
  /** Human-readable purchase-cap cadence, e.g. "5 / day". */
  limitLabel: string
  /** How many times this entry can be bought within its cadence window (demo-session counter, not a real day/week/month window). */
  cap: number
}
