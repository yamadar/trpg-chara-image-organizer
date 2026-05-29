// data/library.json に対応する型（trpg-map-organizer の maps.json を参考にした形式）。

export interface TaxEntry {
  key: string
  labelJa: string
}

export interface CharacterItem {
  id: string
  type: 'character'
  file: string // 512px webp（サイト相対: images/512/characters/...）
  original: string | null // 原寸 webp（images/original/characters/...）
  race: string
  raceLabel: string
  gender: string
  genderLabel: string
  age: string
  ageLabel: string
  profession: string
  professionLabel: string
  tags: string[]
  has_original: boolean
}

export interface MonsterItem {
  id: string
  type: 'monster'
  file: string
  original: string | null
  monster: string
  monsterLabel: string
  variant: number
  tags: string[]
  has_original: boolean
}

export type Item = CharacterItem | MonsterItem

export interface Library {
  generated_at: string
  version: string
  style: string
  total: number
  counts: { characters: number; monsters: number }
  image_size: number
  original_size: number
  has_originals: boolean
  model: string
  base_url: string
  tags: {
    race: TaxEntry[]
    gender: TaxEntry[]
    age: TaxEntry[]
    profession: TaxEntry[]
    monster: TaxEntry[]
  }
  characters: CharacterItem[]
  monsters: MonsterItem[]
}
