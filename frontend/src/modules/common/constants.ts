import type { Rarity, RewardType } from './types'

export const RARITIES: Rarity[] = [
  { key: 'common', label: 'Common', color: 'var(--color-rarity-common)', base: 0.5 },
  { key: 'uncommon', label: 'Uncommon', color: 'var(--color-rarity-uncommon)', base: 1 },
  { key: 'rare', label: 'Rare', color: 'var(--color-rarity-rare)', base: 2.5 },
  { key: 'epic', label: 'Epic', color: 'var(--color-rarity-epic)', base: 6 },
  { key: 'legendary', label: 'Legendary', color: 'var(--color-rarity-legendary)', base: 15 },
]

/** Per-spin EUR value — used only to convert a Free Spins reward to its BC equivalent for calibration. */
export const SPIN_VALUE_EUR = 0.1

/** Betano Coins — part of the Loyalty schema. Earned through play, never purchased or redeemable for real money. */
export const BC_PER_EUR = 1

export const REWARD_TYPES: RewardType[] = [
  {
    key: 'freebet',
    label: 'Free Bet',
    fmtValue: (v) => '€' + v.toFixed(2),
    toBC: (v) => +(v * BC_PER_EUR).toFixed(2),
  },
  {
    key: 'freespins',
    label: 'Free Spins',
    fmtValue: (v) => String(Math.max(5, Math.round(v * 6))),
    toBC: (v) => +(Math.max(5, Math.round(v * 6)) * SPIN_VALUE_EUR * BC_PER_EUR).toFixed(2),
  },
  {
    key: 'cash',
    label: 'Cash',
    fmtValue: (v) => '€' + v.toFixed(2),
    toBC: (v) => +(v * BC_PER_EUR).toFixed(2),
  },
  {
    key: 'bonusmoney',
    label: 'Bonus Money',
    fmtValue: (v) => '€' + v.toFixed(2),
    toBC: (v) => +(v * BC_PER_EUR).toFixed(2),
  },
]
