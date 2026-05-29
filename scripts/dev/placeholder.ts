// 【開発専用】APIを使わずにプレースホルダ画像を生成してSPAを検証するためのスクリプト。
// 本番の実画像は generate.ts が --force で上書きします。これで作った画像はコミットしないこと。
//   tsx scripts/dev/placeholder.ts
import { mkdir } from 'node:fs/promises'
import path from 'node:path'
import sharp from 'sharp'
import { characterCombos, monsterCombos } from '../combos'
import { absSizeTypeDir, absFile, IMAGE_SIZE, type EntityType } from '../config'
import type { Combo } from '../types'

function hash(s: string): number {
  let h = 2166136261
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i)
    h = Math.imul(h, 16777619)
  }
  return h >>> 0
}

function svgFor(combo: Combo): string {
  const h = hash(combo.id)
  const hue = h % 360
  const bg = `hsl(${hue} 45% 28%)`
  const accent = `hsl(${(hue + 40) % 360} 55% 45%)`
  const heading = combo.type === 'character' ? 'CHARACTER' : 'MONSTER'
  const parts = combo.id.replace(/^char-|^monster-/, '').split('-')
  const lines = parts
    .map(
      (p, i) =>
        `<text x="256" y="${300 + i * 30}" font-family="sans-serif" font-size="22" fill="#e2e8f0" text-anchor="middle">${p}</text>`,
    )
    .join('')
  return `<svg xmlns="http://www.w3.org/2000/svg" width="512" height="512">
  <rect width="512" height="512" fill="${bg}"/>
  <circle cx="256" cy="190" r="90" fill="${accent}" opacity="0.6"/>
  <text x="256" y="120" font-family="sans-serif" font-size="24" font-weight="bold" fill="#f8fafc" text-anchor="middle">${heading}</text>
  ${lines}
</svg>`
}

async function main() {
  for (const t of ['characters', 'monsters'] as EntityType[]) {
    await mkdir(absSizeTypeDir('512', t), { recursive: true })
  }
  const combos: Combo[] = [...characterCombos(), ...monsterCombos()]
  let n = 0
  for (const c of combos) {
    const out = absFile('512', c.type === 'character' ? 'characters' : 'monsters', c.id)
    await sharp(Buffer.from(svgFor(c))).resize(IMAGE_SIZE, IMAGE_SIZE).webp({ quality: 80 }).toFile(out)
    n++
  }
  console.log(`プレースホルダ ${n} 枚を生成しました（開発用）。`)
}

main().catch((e) => {
  console.error(e)
  process.exitCode = 1
})
