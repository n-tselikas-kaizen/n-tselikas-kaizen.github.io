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
 * Catalog — Revision v4. 45 games + 14 providers = 59 subjects → 80 total
 * slots. Each subject has exactly one base card (Common/Uncommon/Rare for
 * games by play-popularity thirds, always Uncommon for providers); the top
 * performers within that top tier additionally get a single Epic or
 * Legendary duplicate of the same card with richer illustration. Ranking is
 * a hand-picked placeholder pending real play/spin data. The block below
 * appends the Revision v4 catalog expansion — existing subjects keep their
 * original slots untouched, so nothing that already referenced them by index
 * shifts or changes tier.
 */
export const SUBJECTS: Subject[] = [
  // ---- Games: top third (Rare) — top 2 also Legendary, next 4 also Epic ----
  { name: 'Book of Dead', provider: "Play'n GO", cat: 'CLASSIC', slots: [2, 4] },
  { name: 'Book of Ra Deluxe', provider: 'Novomatic', cat: 'CLASSIC', slots: [2, 4] },
  // ---- Providers: top 3 (Legendary duplicate), next 4 (Epic duplicate), rest plain Uncommon ----
  { name: "Play'n GO", provider: "Play'n GO", cat: 'PROVIDER', slots: [1, 4] },
  { name: 'Pragmatic Play', provider: 'Pragmatic Play', cat: 'PROVIDER', slots: [1, 4] },
  { name: 'Legacy of Dead', provider: "Play'n GO", cat: 'FEATURE', slots: [2, 3] },
  { name: 'Cleopatra', provider: 'IGT', cat: 'CLASSIC', slots: [2, 3] },
  { name: 'Novomatic / Amusnet', provider: 'Novomatic', cat: 'PROVIDER', slots: [1, 4] },
  { name: 'IGT', provider: 'IGT', cat: 'PROVIDER', slots: [1, 3] },
  { name: 'Eye of Horus', provider: 'Gamomat', cat: 'FEATURE', slots: [2, 3] },
  { name: 'Gamomat', provider: 'Gamomat', cat: 'PROVIDER', slots: [1, 3] },
  { name: 'Cleopatra II', provider: 'IGT', cat: 'CLASSIC', slots: [2, 3] },
  // ---- Games: top third (Rare), no Epic/Legendary duplicate ----
  { name: 'MegaJackpots Cleopatra', provider: 'IGT', cat: 'JACKPOT', slots: [2] },
  { name: 'Ramses Book', provider: 'Gamomat', cat: 'CLASSIC', slots: [2] },
  // ---- Games: middle third (Uncommon) ----
  {
    name: 'John Hunter and the Tomb of the Scarab Queen',
    provider: 'Pragmatic Play',
    cat: 'BONUS BUY',
    slots: [1],
  },
  { name: 'Sun of Egypt 3', provider: 'Bgaming', cat: 'MEGAWAYS', slots: [1] },
  { name: 'Egyptian Rebirth II', provider: 'Spinomenal', cat: 'CLASSIC', slots: [1] },
  { name: 'Rise of Dead', provider: "Play'n GO", cat: 'CLASSIC', slots: [1] },
  { name: 'Spinomenal', provider: 'Spinomenal', cat: 'PROVIDER', slots: [1, 3] },
  { name: 'Bgaming', provider: 'Bgaming', cat: 'PROVIDER', slots: [1, 3] },
  { name: 'Book of Ra Deluxe 6', provider: 'Novomatic', cat: 'CLASSIC', slots: [1] },
  { name: 'Ramses II Deluxe', provider: 'Novomatic', cat: 'CLASSIC', slots: [1] },
  { name: 'Eye of Horus Megaways', provider: 'Gamomat', cat: 'MEGAWAYS', slots: [1] },
  {
    name: 'John Hunter and the Book of Tut',
    provider: 'Pragmatic Play',
    cat: 'BONUS BUY',
    slots: [1],
  },
  { name: 'Booming Games', provider: 'Booming Games', cat: 'PROVIDER', slots: [1] },
  { name: 'Games Global', provider: 'Games Global', cat: 'PROVIDER', slots: [1] },
  // ---- Games: bottom third (Common) ----
  { name: 'Egyptian Rebirth', provider: 'Spinomenal', cat: 'CLASSIC', slots: [0] },
  { name: 'Sun of Egypt 2', provider: 'Bgaming', cat: 'MEGAWAYS', slots: [0] },
  { name: 'Cleocatra', provider: 'Pragmatic Play', cat: 'CLASSIC', slots: [0] },
  { name: 'NetEnt', provider: 'NetEnt', cat: 'PROVIDER', slots: [1] },
  { name: 'Pyramid: Quest for Immortality', provider: 'NetEnt', cat: 'JACKPOT', slots: [0] },
  { name: 'Book of Gold', provider: 'Booming Games', cat: 'CLASSIC', slots: [0] },
  { name: 'Ancient Egypt Classic', provider: 'Games Global', cat: 'CLASSIC', slots: [0] },
  { name: 'Book of Gold: Multichance', provider: 'Booming Games', cat: 'FEATURE', slots: [0] },
  {
    name: 'Ancient Egypt Classic Jackpot King',
    provider: 'Games Global',
    cat: 'JACKPOT',
    slots: [0],
  },
  // ---- Revision v4 expansion — new games, Rare base + Epic/Legendary duplicate ----
  { name: 'Legacy of Egypt', provider: "Play'n GO", cat: 'CLASSIC', slots: [2, 3] },
  { name: 'Riches of Ra', provider: "Play'n GO", cat: 'CLASSIC', slots: [2, 4] },
  { name: "Pharaoh's Fortune", provider: 'IGT', cat: 'CLASSIC', slots: [2, 3] },
  { name: 'Ramesses Riches', provider: 'Games Global', cat: 'JACKPOT', slots: [2, 3] },
  { name: 'Fortunes of Egypt', provider: 'Blueprint Gaming', cat: 'CLASSIC', slots: [2, 3] },
  // ---- Revision v4 expansion — new games, middle third (Uncommon) ----
  { name: "Pharaoh's Gold III", provider: 'Novomatic', cat: 'CLASSIC', slots: [1] },
  {
    name: 'John Hunter and the Egyptian Book of Mystery',
    provider: 'Pragmatic Play',
    cat: 'BONUS BUY',
    slots: [1],
  },
  { name: 'Eye of Horus Golden Nights Bonus', provider: 'Gamomat', cat: 'FEATURE', slots: [1] },
  { name: 'Nile Fortune', provider: 'NetEnt', cat: 'JACKPOT', slots: [1] },
  { name: 'Egyptian Dreams', provider: 'Amatic', cat: 'CLASSIC', slots: [1] },
  { name: 'Egyptian Dreams Deluxe', provider: 'Amatic', cat: 'FEATURE', slots: [1] },
  { name: 'Coins of Egypt', provider: 'Booongo', cat: 'BONUS BUY', slots: [1] },
  { name: 'Legend of Cleopatra', provider: 'Booongo', cat: 'JACKPOT', slots: [1] },
  // ---- Revision v4 expansion — new games, bottom third (Common) ----
  { name: 'Anubis Rising', provider: 'Gamomat', cat: 'FEATURE', slots: [0] },
  { name: "Pharaoh's Rebirth", provider: 'Spinomenal', cat: 'FEATURE', slots: [0] },
  { name: 'Scarab Rebirth', provider: 'Spinomenal', cat: 'CLASSIC', slots: [0] },
  { name: 'Sands of Giza', provider: 'Bgaming', cat: 'MEGAWAYS', slots: [0] },
  { name: 'Golden Osiris', provider: 'Booming Games', cat: 'FEATURE', slots: [0] },
  { name: 'Rise of Egypt', provider: 'EGT', cat: 'CLASSIC', slots: [0] },
  { name: '40 Egypt', provider: 'EGT', cat: 'CLASSIC', slots: [0] },
  { name: 'Fortunes of Egypt Megaways', provider: 'Blueprint Gaming', cat: 'MEGAWAYS', slots: [0] },
  // ---- Revision v4 expansion — new providers ----
  { name: 'EGT', provider: 'EGT', cat: 'PROVIDER', slots: [1, 4] },
  { name: 'Blueprint Gaming', provider: 'Blueprint Gaming', cat: 'PROVIDER', slots: [1, 3] },
  { name: 'Amatic', provider: 'Amatic', cat: 'PROVIDER', slots: [1, 3] },
  { name: 'Booongo', provider: 'Booongo', cat: 'PROVIDER', slots: [1] },
]

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
