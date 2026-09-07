export interface AlbumSlot {
  subjectIndex: number
  rarity: number
  filled: boolean
  claimed: boolean
}

export interface Album {
  id: string
  name: string
  active: boolean
  slots: AlbumSlot[]
}
