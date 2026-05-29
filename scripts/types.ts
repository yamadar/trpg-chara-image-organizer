// 生成パイプラインと配信JSONで使う型定義。

export interface CharacterCombo {
  type: 'character'
  id: string
  race: string
  gender: string
  age: string
  profession: string
}

export interface MonsterCombo {
  type: 'monster'
  id: string
  monster: string
  variant: number
}

export type Combo = CharacterCombo | MonsterCombo

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
