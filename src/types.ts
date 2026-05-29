// 配信 manifest.json と対応する型（ブラウザ側）。

export interface ManifestCharacter {
  id: string
  type: 'character'
  race: string
  raceLabel: string
  gender: string
  genderLabel: string
  age: string
  ageLabel: string
  profession: string
  professionLabel: string
  tags: string[]
  file: string
  url: string
  width: number
  height: number
}

export interface ManifestMonster {
  id: string
  type: 'monster'
  monster: string
  monsterLabel: string
  variant: number
  tags: string[]
  file: string
  url: string
  width: number
  height: number
}

export type Item = ManifestCharacter | ManifestMonster

export interface Manifest {
  version: string
  generatedAt: string
  style: string
  imageSize: number
  baseUrl: string
  model: string
  characters: ManifestCharacter[]
  monsters: ManifestMonster[]
}

export interface TaxonomyEntry {
  key: string
  labelJa: string
}
