import type { CharacterItem, Item, Library, MonsterItem } from '../types'

const base = import.meta.env.BASE_URL

export type Mode = 'characters' | 'monsters'
export type CharCategory = 'race' | 'gender' | 'age' | 'profession'

export interface Selection {
  race: Set<string>
  gender: Set<string>
  age: Set<string>
  profession: Set<string>
  monster: Set<string>
}

export function emptySelection(): Selection {
  return {
    race: new Set(),
    gender: new Set(),
    age: new Set(),
    profession: new Set(),
    monster: new Set(),
  }
}

/** SPA自身が表示に使う 512px 画像パス（自オリジン・dev/prod両対応）。 */
export function imageSrc(item: Item): string {
  return `${base}${item.file}`
}
/** 原寸画像のローカルパス（無ければ null）。 */
export function originalSrc(item: Item): string | null {
  return item.original ? `${base}${item.original}` : null
}
/** 他サイト共有用の絶対URL（manifest.base_url 起点）。 */
export function absoluteUrl(lib: Library, relPath: string): string {
  return lib.base_url + relPath
}

function matchesQuery(haystack: string[], query: string): boolean {
  const q = query.trim().toLowerCase()
  if (!q) return true
  return haystack.join(' ').toLowerCase().includes(q)
}

export function matchesCharacter(c: CharacterItem, sel: Selection, query: string): boolean {
  if (sel.race.size && !sel.race.has(c.race)) return false
  if (sel.gender.size && !sel.gender.has(c.gender)) return false
  if (sel.age.size && !sel.age.has(c.age)) return false
  if (sel.profession.size && !sel.profession.has(c.profession)) return false
  return matchesQuery([c.id, c.raceLabel, c.genderLabel, c.ageLabel, c.professionLabel, ...c.tags], query)
}

export function matchesMonster(m: MonsterItem, sel: Selection, query: string): boolean {
  if (sel.monster.size && !sel.monster.has(m.monster)) return false
  return matchesQuery([m.id, m.monsterLabel, ...m.tags], query)
}

export function primaryLabel(item: Item): string {
  return item.type === 'character' ? item.professionLabel : item.monsterLabel
}

export function subLabel(item: Item): string {
  return item.type === 'character'
    ? `${item.raceLabel} / ${item.genderLabel} / ${item.ageLabel}`
    : `モンスター #${item.variant}`
}
