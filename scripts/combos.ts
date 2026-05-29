// 生成対象（種族×性別×年齢×職業 と モンスター×バリアント）の組合せを構築する。
import { races, genders, ages, professions, monsters, MONSTER_VARIANTS } from '../data/taxonomy'
import type { CharacterCombo, MonsterCombo } from './types'

export function characterCombos(): CharacterCombo[] {
  const out: CharacterCombo[] = []
  for (const race of races) {
    for (const gender of genders) {
      for (const age of ages) {
        for (const profession of professions) {
          out.push({
            type: 'character',
            id: `char-${race.key}-${gender.key}-${age.key}-${profession.key}`,
            race: race.key,
            gender: gender.key,
            age: age.key,
            profession: profession.key,
          })
        }
      }
    }
  }
  return out
}

export function monsterCombos(): MonsterCombo[] {
  const out: MonsterCombo[] = []
  for (const m of monsters) {
    for (let v = 1; v <= MONSTER_VARIANTS; v++) {
      out.push({ type: 'monster', id: `monster-${m.key}-${v}`, monster: m.key, variant: v })
    }
  }
  return out
}

// パイロット: 全変数を横断する代表 約12枚（キャラ10 + モンスター2）。
const PILOT_CHARACTERS: Array<[string, string, string, string]> = [
  ['human', 'male', 'young', 'fighter'],
  ['human', 'female', 'elderly', 'wizard'],
  ['elf', 'female', 'young', 'ranger'],
  ['dwarf', 'male', 'middle', 'cleric'],
  ['halfling', 'male', 'young', 'rogue'],
  ['tiefling', 'female', 'young', 'sorcerer'],
  ['half-orc', 'male', 'middle', 'barbarian'],
  ['dragonborn', 'male', 'young', 'paladin'],
  ['gnome', 'female', 'middle', 'bard'],
  ['beastfolk', 'female', 'young', 'monk'],
]
const PILOT_MONSTERS: Array<[string, number]> = [
  ['goblin', 1],
  ['dragon', 1],
]

export function pilotCharacterCombos(): CharacterCombo[] {
  return PILOT_CHARACTERS.map(([race, gender, age, profession]) => ({
    type: 'character',
    id: `char-${race}-${gender}-${age}-${profession}`,
    race,
    gender,
    age,
    profession,
  }))
}

export function pilotMonsterCombos(): MonsterCombo[] {
  return PILOT_MONSTERS.map(([monster, variant]) => ({
    type: 'monster',
    id: `monster-${monster}-${variant}`,
    monster,
    variant,
  }))
}
