import { defineStore } from 'pinia'
import { reactive } from 'vue'
import { RARITIES, BC_PER_EUR } from '@/modules/common/constants'
import type { CardCombo } from '@/modules/common/types'
import { SUBJECTS } from './constants'

/**
 * Cards — the domain almost everything else touches. Owns the subject
 * catalog and the ownership ledger: one row per subject, one column per
 * rarity (0=Common..4=Legendary), regardless of whether that subject
 * actually has an album slot at that rarity. A copy at a rarity outside a
 * subject's `slots` is real, ownable inventory — just never anything but
 * trade/sell material, since no slot exists for it.
 */
export const useCardsStore = defineStore('cards', () => {
  const subjects = SUBJECTS

  /** ownership[subjectIndex][rarityIndex] — starts completely empty, on purpose. */
  const ownership = reactive<number[][]>(subjects.map(() => [0, 0, 0, 0, 0]))

  /** subjectsByRarity[rarityIndex] — subject indices with an album slot at that rarity, for pack draws. */
  const subjectsByRarity: number[][] = [0, 1, 2, 3, 4].map((ri) =>
    subjects.reduce<number[]>((acc, s, si) => {
      if (s.slots.includes(ri)) acc.push(si)
      return acc
    }, []),
  )

  function slotRarities(si: number): number[] {
    return subjects[si].slots
  }

  function slotExists(si: number, ri: number): boolean {
    return subjects[si].slots.includes(ri)
  }

  /** A random subject that actually has an album slot at this rarity — what a pack pull draws from. */
  function randomSubjectAtRarity(ri: number): number {
    const eligible = subjectsByRarity[ri]
    return eligible[Math.floor(Math.random() * eligible.length)]
  }

  function cardValueBC(rarityIdx: number): number {
    return +(RARITIES[rarityIdx].base * BC_PER_EUR).toFixed(2)
  }

  function addOwnership(si: number, ri: number, qty = 1) {
    ownership[si][ri] += qty
  }

  /** Returns false (no mutation) if fewer than `qty` spare copies exist. */
  function removeOwnership(si: number, ri: number, qty = 1): boolean {
    if (!ownership[si] || ownership[si][ri] < qty) return false
    ownership[si][ri] -= qty
    return true
  }

  function sellableCombos(): CardCombo[] {
    const combos: CardCombo[] = []
    subjects.forEach((_s, si) => {
      RARITIES.forEach((_r, ri) => {
        if (ownership[si][ri] > 0) combos.push({ si, ri })
      })
    })
    return combos
  }

  function allCatalogCombos(): CardCombo[] {
    const combos: CardCombo[] = []
    subjects.forEach((_s, si) => RARITIES.forEach((_r, ri) => combos.push({ si, ri })))
    return combos
  }

  return {
    subjects,
    ownership,
    slotRarities,
    slotExists,
    randomSubjectAtRarity,
    cardValueBC,
    addOwnership,
    removeOwnership,
    sellableCombos,
    allCatalogCombos,
  }
})
