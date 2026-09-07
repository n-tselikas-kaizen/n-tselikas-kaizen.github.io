/** One card drawn from a pack — committed to ownership the instant it's drawn. */
export interface Pull {
  subjectIndex: number
  rarity: number
  /** This exact copy filled a previously-empty album slot (de-duped within the same pack). */
  isNewFill: boolean
}
