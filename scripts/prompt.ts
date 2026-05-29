// 組合せ(Combo)から画像生成プロンプトを組み立てる。
import {
  races,
  genders,
  ages,
  professions,
  monsters,
  type Attribute,
} from '../data/taxonomy'
import {
  STYLE_PREAMBLE,
  CHARACTER_FRAMING,
  MONSTER_FRAMING,
  MONSTER_MENACE,
  BACKGROUND,
  CONSTRAINTS,
  MONSTER_VARIANT_HINTS,
} from '../data/style'
import type { Combo, CharacterCombo, MonsterCombo } from './types'

function byKey(attrs: Attribute[]): Map<string, Attribute> {
  return new Map(attrs.map((a) => [a.key, a]))
}
const raceMap = byKey(races)
const genderMap = byKey(genders)
const ageMap = byKey(ages)
const professionMap = byKey(professions)
const monsterMap = byKey(monsters)

// 同種・同職でも個体差を出すための決定的な差分語。
const HAIR = ['black hair', 'dark brown hair', 'blond hair', 'red hair', 'silver hair', 'auburn hair']
const EXPRESSION = [
  'a determined expression',
  'a calm expression',
  'a stern expression',
  'a confident expression',
  'a thoughtful expression',
  'a friendly expression',
]
// 毛髪を持たない種族（髪色の指定を避ける）。
const HAIRLESS = new Set(['dragonborn', 'lizardfolk'])

/** 文字列から決定的な32bitハッシュ（FNV-1a）。同じidは常に同じ見た目差分になる。 */
function hash(s: string): number {
  let h = 2166136261
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i)
    h = Math.imul(h, 16777619)
  }
  return h >>> 0
}

export function buildCharacterPrompt(c: CharacterCombo): string {
  const race = raceMap.get(c.race)
  const gender = genderMap.get(c.gender)
  const age = ageMap.get(c.age)
  const prof = professionMap.get(c.profession)
  if (!race || !gender || !age || !prof) {
    throw new Error(`unknown attribute key in combo ${c.id}`)
  }

  const h = hash(c.id)
  const expr = EXPRESSION[(h >>> 8) % EXPRESSION.length]
  const appearance = HAIRLESS.has(c.race)
    ? `They have ${expr}.`
    : `They have ${HAIR[h % HAIR.length]} and ${expr}.`

  return [
    STYLE_PREAMBLE,
    `Subject: a ${age.prompt} ${gender.prompt} ${race.prompt}. They are a ${prof.prompt}. ${appearance}`,
    CHARACTER_FRAMING,
    BACKGROUND,
    CONSTRAINTS,
  ].join(' ')
}

export function buildMonsterPrompt(m: MonsterCombo): string {
  const mon = monsterMap.get(m.monster)
  if (!mon) throw new Error(`unknown monster key in combo ${m.id}`)
  const hint = MONSTER_VARIANT_HINTS[(m.variant - 1) % MONSTER_VARIANT_HINTS.length]
  return [
    STYLE_PREAMBLE,
    `Subject: ${mon.prompt}. ${hint} ${MONSTER_MENACE}`,
    MONSTER_FRAMING,
    BACKGROUND,
    CONSTRAINTS,
  ].join(' ')
}

export function buildPrompt(combo: Combo): string {
  return combo.type === 'character' ? buildCharacterPrompt(combo) : buildMonsterPrompt(combo)
}
