/** One of the player's own active listings for this album. */
export interface Listing {
  id: string
  subjectIndex: number
  rarity: number
  price: number
}

/**
 * A demo stand-in for "another player bought one of your listings" — the
 * card already left ownership the moment it was listed, so what's pending
 * here is only the BC credit and clearing the notification.
 */
export interface PendingSale {
  id: string
  subjectIndex: number
  rarity: number
  price: number
  buyer: string
}

/** A mocked "other player's" listing for this album, browsable but not backed by a real second account. */
export interface MarketListing {
  id: string
  seller: string
  subjectIndex: number
  rarity: number
  price: number
}
