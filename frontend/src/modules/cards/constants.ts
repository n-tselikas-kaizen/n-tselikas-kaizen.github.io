import type { Subject } from './types'

export const CATEGORY_GLYPH: Record<string, string> = {
  CLASSIC: '𓋹',
  FEATURE: '𓆣',
  JACKPOT: '𓊹',
  MEGAWAYS: '𓆓',
  'BONUS BUY': '𓅓',
  PROVIDER: '𓅜',
}

/** Generic theme mark: card backs + not-yet-owned fronts. */
export const THEME_ICON = '𓂀'

/**
 * Catalog — Revision v2. 24 games + 10 providers = 34 subjects → 86 total
 * slots (2×5 + 5×4 + 10×3 + 9×2 + 8×1). Ranking is a hand-picked placeholder
 * pending real play/spin data.
 */
export const SUBJECTS: Subject[] = [
  // ---- Band 0 — top 5% (5 slots: Common → Legendary) ----
  { name: 'Book of Dead', provider: "Play'n GO", cat: 'CLASSIC', band: 0 },
  { name: 'Book of Ra Deluxe', provider: 'Novomatic', cat: 'CLASSIC', band: 0 },
  // ---- Band 1 — next 15% (4 slots: Common → Epic) ----
  { name: "Play'n GO", provider: "Play'n GO", cat: 'PROVIDER', band: 1 },
  { name: 'Pragmatic Play', provider: 'Pragmatic Play', cat: 'PROVIDER', band: 1 },
  { name: 'Legacy of Dead', provider: "Play'n GO", cat: 'FEATURE', band: 1 },
  { name: 'Cleopatra', provider: 'IGT', cat: 'CLASSIC', band: 1 },
  { name: 'Novomatic / Amusnet', provider: 'Novomatic', cat: 'PROVIDER', band: 1 },
  // ---- Band 2 — next 30% (3 slots: Common → Rare) ----
  { name: 'IGT', provider: 'IGT', cat: 'PROVIDER', band: 2 },
  { name: 'Eye of Horus', provider: 'Gamomat', cat: 'FEATURE', band: 2 },
  { name: 'Gamomat', provider: 'Gamomat', cat: 'PROVIDER', band: 2 },
  { name: 'Cleopatra II', provider: 'IGT', cat: 'CLASSIC', band: 2 },
  { name: 'MegaJackpots Cleopatra', provider: 'IGT', cat: 'JACKPOT', band: 2 },
  { name: 'Ramses Book', provider: 'Gamomat', cat: 'CLASSIC', band: 2 },
  {
    name: 'John Hunter and the Tomb of the Scarab Queen',
    provider: 'Pragmatic Play',
    cat: 'BONUS BUY',
    band: 2,
  },
  { name: 'Sun of Egypt 3', provider: 'Bgaming', cat: 'MEGAWAYS', band: 2 },
  { name: 'Egyptian Rebirth II', provider: 'Spinomenal', cat: 'CLASSIC', band: 2 },
  { name: 'Rise of Dead', provider: "Play'n GO", cat: 'CLASSIC', band: 2 },
  // ---- Band 3 — next 25% (2 slots: Common → Uncommon) ----
  { name: 'Spinomenal', provider: 'Spinomenal', cat: 'PROVIDER', band: 3 },
  { name: 'Bgaming', provider: 'Bgaming', cat: 'PROVIDER', band: 3 },
  { name: 'Book of Ra Deluxe 6', provider: 'Novomatic', cat: 'CLASSIC', band: 3 },
  { name: 'Ramses II Deluxe', provider: 'Novomatic', cat: 'CLASSIC', band: 3 },
  { name: 'Eye of Horus Megaways', provider: 'Gamomat', cat: 'MEGAWAYS', band: 3 },
  {
    name: 'John Hunter and the Book of Tut',
    provider: 'Pragmatic Play',
    cat: 'BONUS BUY',
    band: 3,
  },
  { name: 'Booming Games', provider: 'Booming Games', cat: 'PROVIDER', band: 3 },
  { name: 'Games Global', provider: 'Games Global', cat: 'PROVIDER', band: 3 },
  { name: 'Egyptian Rebirth', provider: 'Spinomenal', cat: 'CLASSIC', band: 3 },
  // ---- Band 4 — remaining 25% (1 slot: Common only) ----
  { name: 'Sun of Egypt 2', provider: 'Bgaming', cat: 'MEGAWAYS', band: 4 },
  { name: 'Cleocatra', provider: 'Pragmatic Play', cat: 'CLASSIC', band: 4 },
  { name: 'NetEnt', provider: 'NetEnt', cat: 'PROVIDER', band: 4 },
  { name: 'Pyramid: Quest for Immortality', provider: 'NetEnt', cat: 'JACKPOT', band: 4 },
  { name: 'Book of Gold', provider: 'Booming Games', cat: 'CLASSIC', band: 4 },
  { name: 'Ancient Egypt Classic', provider: 'Games Global', cat: 'CLASSIC', band: 4 },
  { name: 'Book of Gold: Multichance', provider: 'Booming Games', cat: 'FEATURE', band: 4 },
  { name: 'Ancient Egypt Classic Jackpot King', provider: 'Games Global', cat: 'JACKPOT', band: 4 },
]

/** Band → highest rarity index that subject supports as an album slot (0=Common..4=Legendary). */
export const BAND_MAX_RARITY = [4, 3, 2, 1, 0]

export const EPIC_SPARK_STYLES = ['top:-6px; left:22%;', 'bottom:-6px; left:68%;']

export const LEGENDARY_SPARK_STYLES = [
  'top:-6px; left:12%;',
  'top:24%; right:-8px;',
  'top:64%; right:-8px;',
  'bottom:-6px; left:55%;',
  'bottom:24%; left:-8px;',
  'top:-6px; left:78%;',
]

export function glowClassFor(rarityIdx: number): string | null {
  if (rarityIdx === 2) return 'glow-rare'
  if (rarityIdx === 3) return 'glow-epic'
  if (rarityIdx === 4) return 'glow-legendary'
  return null
}
