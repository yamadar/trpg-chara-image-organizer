// ディスク上に存在する生成済み画像から manifest.json / taxonomy.json を生成する。
import { mkdir, writeFile } from 'node:fs/promises'
import { existsSync } from 'node:fs'
import path from 'node:path'
import { races, genders, ages, professions, monsters, labelMap } from '../data/taxonomy'
import { STYLE_ID } from '../data/style'
import { characterCombos, monsterCombos } from './combos'
import type { Manifest, ManifestCharacter, ManifestMonster } from './types'
import {
  IMAGES_DIR,
  BASE_URL,
  IMAGE_SIZE,
  MODEL,
  MANIFEST_VERSION,
  charFile,
  monsterFile,
} from './config'

/** 画像が存在する組合せだけを拾って manifest を組み立てる。 */
export function buildManifest(generatedAt: string): Manifest {
  const raceL = labelMap(races)
  const genderL = labelMap(genders)
  const ageL = labelMap(ages)
  const profL = labelMap(professions)
  const monL = labelMap(monsters)

  const characters: ManifestCharacter[] = []
  for (const c of characterCombos()) {
    const rel = charFile(c.id)
    if (!existsSync(path.join(IMAGES_DIR, rel))) continue
    characters.push({
      id: c.id,
      type: 'character',
      race: c.race,
      raceLabel: raceL[c.race],
      gender: c.gender,
      genderLabel: genderL[c.gender],
      age: c.age,
      ageLabel: ageL[c.age],
      profession: c.profession,
      professionLabel: profL[c.profession],
      tags: [c.race, c.gender, c.age, c.profession],
      file: rel,
      url: BASE_URL + rel,
      width: IMAGE_SIZE,
      height: IMAGE_SIZE,
    })
  }

  const monsterEntries: ManifestMonster[] = []
  for (const m of monsterCombos()) {
    const rel = monsterFile(m.id)
    if (!existsSync(path.join(IMAGES_DIR, rel))) continue
    monsterEntries.push({
      id: m.id,
      type: 'monster',
      monster: m.monster,
      monsterLabel: monL[m.monster],
      variant: m.variant,
      tags: [m.monster, 'monster'],
      file: rel,
      url: BASE_URL + rel,
      width: IMAGE_SIZE,
      height: IMAGE_SIZE,
    })
  }

  return {
    version: MANIFEST_VERSION,
    generatedAt,
    style: STYLE_ID,
    imageSize: IMAGE_SIZE,
    baseUrl: BASE_URL,
    model: MODEL,
    characters,
    monsters: monsterEntries,
  }
}

/** SPAのフィルタ構築や他サイト向けの属性辞書。 */
function buildTaxonomyJson() {
  const pick = (a: { key: string; labelJa: string }) => ({ key: a.key, labelJa: a.labelJa })
  return {
    races: races.map(pick),
    genders: genders.map(pick),
    ages: ages.map(pick),
    professions: professions.map(pick),
    monsters: monsters.map(pick),
  }
}

export async function writeManifest(generatedAt: string): Promise<Manifest> {
  await mkdir(IMAGES_DIR, { recursive: true })
  const manifest = buildManifest(generatedAt)
  await writeFile(
    path.join(IMAGES_DIR, 'manifest.json'),
    JSON.stringify(manifest, null, 2) + '\n',
  )
  await writeFile(
    path.join(IMAGES_DIR, 'taxonomy.json'),
    JSON.stringify(buildTaxonomyJson(), null, 2) + '\n',
  )
  return manifest
}
