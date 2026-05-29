// ディスク上に存在する生成済み画像から data/library.json を生成する。
// 形式は trpg-map-organizer の maps.json を参考にした:
//   { generated_at, total, has_originals, tags:{...}, characters:[...], monsters:[...] }
import { mkdir, writeFile } from 'node:fs/promises'
import { existsSync } from 'node:fs'
import path from 'node:path'
import { races, genders, ages, professions, monsters, labelMap } from '../data/taxonomy'
import { STYLE_ID } from '../data/style'
import { characterCombos, monsterCombos } from './combos'
import {
  DATA_DIR,
  BASE_URL,
  IMAGE_SIZE,
  ORIGINAL_SIZE,
  MODEL,
  MANIFEST_VERSION,
  relFile,
  absFile,
} from './config'

interface TaxEntry {
  key: string
  labelJa: string
}
const pick = (a: { key: string; labelJa: string }): TaxEntry => ({ key: a.key, labelJa: a.labelJa })

interface CharacterItem {
  id: string
  type: 'character'
  file: string
  original: string | null
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
interface MonsterItem {
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

export function buildLibrary(generatedAt: string) {
  const raceL = labelMap(races)
  const genderL = labelMap(genders)
  const ageL = labelMap(ages)
  const profL = labelMap(professions)
  const monL = labelMap(monsters)

  const characterItems: CharacterItem[] = []
  for (const c of characterCombos()) {
    if (!existsSync(absFile('512', 'characters', c.id))) continue
    const hasOriginal = existsSync(absFile('original', 'characters', c.id))
    characterItems.push({
      id: c.id,
      type: 'character',
      file: relFile('512', 'characters', c.id),
      original: hasOriginal ? relFile('original', 'characters', c.id) : null,
      race: c.race,
      raceLabel: raceL[c.race],
      gender: c.gender,
      genderLabel: genderL[c.gender],
      age: c.age,
      ageLabel: ageL[c.age],
      profession: c.profession,
      professionLabel: profL[c.profession],
      tags: [c.race, c.gender, c.age, c.profession],
      has_original: hasOriginal,
    })
  }

  const monsterItems: MonsterItem[] = []
  for (const m of monsterCombos()) {
    if (!existsSync(absFile('512', 'monsters', m.id))) continue
    const hasOriginal = existsSync(absFile('original', 'monsters', m.id))
    monsterItems.push({
      id: m.id,
      type: 'monster',
      file: relFile('512', 'monsters', m.id),
      original: hasOriginal ? relFile('original', 'monsters', m.id) : null,
      monster: m.monster,
      monsterLabel: monL[m.monster],
      variant: m.variant,
      tags: [m.monster],
      has_original: hasOriginal,
    })
  }

  const all = [...characterItems, ...monsterItems]
  const total = all.length

  return {
    generated_at: generatedAt,
    version: MANIFEST_VERSION,
    style: STYLE_ID,
    total,
    counts: { characters: characterItems.length, monsters: monsterItems.length },
    image_size: IMAGE_SIZE,
    original_size: ORIGINAL_SIZE,
    has_originals: total > 0 && all.every((x) => x.has_original),
    model: MODEL,
    base_url: BASE_URL,
    // フィルタ用タクソノミー（maps.json の tags 相当）
    tags: {
      race: races.map(pick),
      gender: genders.map(pick),
      age: ages.map(pick),
      profession: professions.map(pick),
      monster: monsters.map(pick),
    },
    characters: characterItems,
    monsters: monsterItems,
  }
}

export async function writeManifest(generatedAt: string) {
  await mkdir(DATA_DIR, { recursive: true })
  const lib = buildLibrary(generatedAt)
  await writeFile(path.join(DATA_DIR, 'library.json'), JSON.stringify(lib, null, 2) + '\n')
  return lib
}
