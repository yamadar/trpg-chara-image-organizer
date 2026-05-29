import type { Item, Manifest, TaxonomyEntry } from '../types'

export interface FilterOptions {
  races: TaxonomyEntry[]
  genders: TaxonomyEntry[]
  ages: TaxonomyEntry[]
  professions: TaxonomyEntry[]
  monsters: TaxonomyEntry[]
}

/** manifest 内に実在する値だけからフィルタ選択肢を作る（順序は出現順＝分類定義順）。 */
export function deriveOptions(manifest: Manifest): FilterOptions {
  const uniq = (pairs: Array<[string, string]>): TaxonomyEntry[] => {
    const m = new Map<string, string>()
    for (const [key, labelJa] of pairs) if (!m.has(key)) m.set(key, labelJa)
    return Array.from(m, ([key, labelJa]) => ({ key, labelJa }))
  }
  const chars = manifest.characters
  return {
    races: uniq(chars.map((c) => [c.race, c.raceLabel])),
    genders: uniq(chars.map((c) => [c.gender, c.genderLabel])),
    ages: uniq(chars.map((c) => [c.age, c.ageLabel])),
    professions: uniq(chars.map((c) => [c.profession, c.professionLabel])),
    monsters: uniq(manifest.monsters.map((m) => [m.monster, m.monsterLabel])),
  }
}

export interface FilterState {
  types: Set<string>
  races: Set<string>
  genders: Set<string>
  ages: Set<string>
  professions: Set<string>
  monsters: Set<string>
  query: string
}

export function emptyFilter(): FilterState {
  return {
    types: new Set(),
    races: new Set(),
    genders: new Set(),
    ages: new Set(),
    professions: new Set(),
    monsters: new Set(),
    query: '',
  }
}

export function matchesFilter(item: Item, f: FilterState): boolean {
  if (f.types.size && !f.types.has(item.type)) return false

  if (f.query.trim()) {
    const q = f.query.trim().toLowerCase()
    const hay = (
      item.type === 'character'
        ? [item.id, item.raceLabel, item.genderLabel, item.ageLabel, item.professionLabel, ...item.tags]
        : [item.id, item.monsterLabel, ...item.tags]
    )
      .join(' ')
      .toLowerCase()
    if (!hay.includes(q)) return false
  }

  const charActive =
    f.races.size > 0 || f.genders.size > 0 || f.ages.size > 0 || f.professions.size > 0

  if (item.type === 'character') {
    if (f.monsters.size) return false // モンスター種別が選択中ならキャラは隠す
    if (f.races.size && !f.races.has(item.race)) return false
    if (f.genders.size && !f.genders.has(item.gender)) return false
    if (f.ages.size && !f.ages.has(item.age)) return false
    if (f.professions.size && !f.professions.has(item.profession)) return false
  } else {
    if (charActive) return false // キャラ属性が選択中ならモンスターは隠す
    if (f.monsters.size && !f.monsters.has(item.monster)) return false
  }
  return true
}

/** SPA自身が表示に使う画像パス（自オリジン・dev/prod両対応）。 */
export function imageSrc(item: Item): string {
  return `${import.meta.env.BASE_URL}images/${item.file}`
}

export function primaryLabel(item: Item): string {
  return item.type === 'character' ? item.professionLabel : item.monsterLabel
}

export function subLabel(item: Item): string {
  return item.type === 'character'
    ? `${item.raceLabel} / ${item.genderLabel} / ${item.ageLabel}`
    : `モンスター #${item.variant}`
}
