// 【開発専用】本番プロンプト(buildPrompt)を使って指定の被写体を少数だけ生成し、
// public/style-tests/ に追加する（画風・指示の確認用）。
// 既存ファイルは上書きしない（--force で上書き）。
//   tsx scripts/dev/style-sample.ts [--force]
import 'dotenv/config'
import { mkdir } from 'node:fs/promises'
import { existsSync } from 'node:fs'
import path from 'node:path'
import sharp from 'sharp'
import { buildPrompt } from '../prompt'
import { generateImage } from '../gemini'
import { ROOT, IMAGE_SIZE } from '../config'
import type { Combo } from '../types'

const OUT = path.join(ROOT, 'public', 'style-tests')
const force = process.argv.includes('--force')

// 出力名 → 本番Combo。buildPrompt がグリムダーク＋白背景＋（モンスターは凶暴化）を反映する。
const targets: Array<{ name: string; combo: Combo }> = [
  {
    name: 'oilgrim__dragon',
    combo: { type: 'monster', id: 'monster-dragon-1', monster: 'dragon', variant: 1 },
  },
  {
    name: 'oilgrim__dragonborn',
    combo: { type: 'character', id: 'char-dragonborn-male-young-fighter', race: 'dragonborn', gender: 'male', age: 'young', profession: 'fighter' },
  },
]

async function main() {
  if (!process.env.GEMINI_API_KEY) {
    console.error('GEMINI_API_KEY 未設定。.env に設定してください。')
    process.exitCode = 1
    return
  }
  await mkdir(OUT, { recursive: true })
  for (const t of targets) {
    const out = path.join(OUT, `${t.name}.webp`)
    if (existsSync(out) && !force) {
      console.log(`skip (既存): ${t.name}.webp  （上書きするなら --force）`)
      continue
    }
    const prompt = buildPrompt(t.combo)
    console.log(`生成: ${t.name}`)
    console.log(`  prompt: ${prompt}`)
    const raw = await generateImage(prompt, { useAnchor: false })
    await sharp(raw)
      .resize(IMAGE_SIZE, IMAGE_SIZE, { fit: 'cover', position: 'centre' })
      .webp({ quality: 90 })
      .toFile(out)
    console.log(`  ✓ ${out}\n`)
  }
  console.log('完了')
}

main().catch((e) => {
  console.error(e)
  process.exitCode = 1
})
