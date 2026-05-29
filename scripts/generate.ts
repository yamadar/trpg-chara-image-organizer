// 画像生成パイプラインの CLI エントリ。
//
//   tsx scripts/generate.ts [options]
//     --dry-run         生成せず対象一覧・枚数・概算費用のみ表示
//     --pilot           パイロット（代表 約12枚）だけ生成
//     --all             キャラ＋モンスターの全パターン
//     --characters      キャラのみ
//     --monsters        モンスターのみ
//     --limit N         先頭 N 件だけ
//     --force           既存画像があっても再生成
//     --manifest-only   既存画像から data/library.json のみ再生成
//
// 各組合せにつき API を1回呼び、原寸(1024)と512の2サイズを別ディレクトリに保存する。
import 'dotenv/config'
import { mkdir } from 'node:fs/promises'
import { existsSync } from 'node:fs'
import pLimit from 'p-limit'
import {
  characterCombos,
  monsterCombos,
  pilotCharacterCombos,
  pilotMonsterCombos,
} from './combos'
import { buildPrompt } from './prompt'
import { generateImage, hasStyleAnchor } from './gemini'
import { finishImage } from './image'
import { writeManifest } from './manifest'
import {
  COST_PER_IMAGE,
  IMAGE_SIZE,
  ORIGINAL_SIZE,
  absFile,
  absSizeTypeDir,
  type EntityType,
} from './config'
import type { Combo } from './types'

interface Args {
  dryRun: boolean
  pilot: boolean
  all: boolean
  characters: boolean
  monsters: boolean
  force: boolean
  manifestOnly: boolean
  limit: number | null
}

function parseArgs(argv: string[]): Args {
  const has = (f: string) => argv.includes(f)
  const limitIdx = argv.indexOf('--limit')
  const limit = limitIdx >= 0 ? Number(argv[limitIdx + 1]) : null
  return {
    dryRun: has('--dry-run'),
    pilot: has('--pilot'),
    all: has('--all'),
    characters: has('--characters'),
    monsters: has('--monsters'),
    force: has('--force'),
    manifestOnly: has('--manifest-only'),
    limit: limit && Number.isFinite(limit) ? limit : null,
  }
}

function selectCombos(args: Args): Combo[] {
  let combos: Combo[]
  if (args.pilot) {
    combos = [...pilotCharacterCombos(), ...pilotMonsterCombos()]
  } else {
    const wantChar = args.characters || !args.monsters
    const wantMon = args.monsters || !args.characters
    combos = []
    if (wantChar) combos.push(...characterCombos())
    if (wantMon) combos.push(...monsterCombos())
  }
  if (args.limit) combos = combos.slice(0, args.limit)
  return combos
}

function typeOf(c: Combo): EntityType {
  return c.type === 'character' ? 'characters' : 'monsters'
}
/** スキップ判定の基準（512が存在すれば生成済みとみなす）。 */
function primaryPath(c: Combo): string {
  return absFile('512', typeOf(c), c.id)
}

async function main() {
  const args = parseArgs(process.argv.slice(2))
  const generatedAt = new Date().toISOString()

  if (args.manifestOnly) {
    const m = await writeManifest(generatedAt)
    console.log(`data/library.json を更新: characters=${m.counts.characters}, monsters=${m.counts.monsters}`)
    return
  }

  // 安全策: スコープ未指定での暗黙の全件生成を禁止（誤実行・課金事故の防止）。
  const hasScope = args.pilot || args.all || args.characters || args.monsters
  if (!hasScope) {
    console.error(
      'スコープが未指定です。誤った全件生成を防ぐため、--pilot / --all / --characters / --monsters のいずれかを明示してください。\n' +
        '  確認のみ : npm run gen:dry\n' +
        '  パイロット: npm run gen:pilot\n' +
        '  全件(課金): npm run gen:all',
    )
    process.exitCode = 1
    return
  }

  const combos = selectCombos(args)
  const pending = args.force ? combos : combos.filter((c) => !existsSync(primaryPath(c)))
  const skipped = combos.length - pending.length

  console.log(`対象: ${combos.length} 組合せ（生成予定 ${pending.length} / 既存スキップ ${skipped}）`)
  console.log(`概算費用: $${(pending.length * COST_PER_IMAGE).toFixed(2)}  ($${COST_PER_IMAGE}/組合せ・原寸と512を同時出力)`)
  console.log(`スタイルアンカー: ${hasStyleAnchor() ? 'あり（参照画像として同梱）' : 'なし（プロンプトのみで統一）'}`)

  if (args.dryRun) {
    console.log('\n--dry-run: 生成は行いません。生成予定の先頭:')
    pending.slice(0, 20).forEach((c, i) => console.log(`  ${i + 1}. ${c.id}`))
    if (pending.length > 20) console.log(`  ... 他 ${pending.length - 20} 件`)
    return
  }

  if (pending.length === 0) {
    console.log('生成対象がありません（すべて既存）。--force で再生成できます。')
    await writeManifest(generatedAt)
    return
  }

  if (!process.env.GEMINI_API_KEY) {
    console.error('\nエラー: GEMINI_API_KEY が未設定です。`cp .env.example .env` してキーを記入してください。')
    process.exitCode = 1
    return
  }

  // 出力ディレクトリ（サイズ × 種別）を用意
  for (const type of ['characters', 'monsters'] as EntityType[]) {
    await mkdir(absSizeTypeDir('original', type), { recursive: true })
    await mkdir(absSizeTypeDir('512', type), { recursive: true })
  }

  const limit = pLimit(4)
  let done = 0
  let failed = 0
  const failures: Array<{ id: string; err: string }> = []

  await Promise.all(
    pending.map((combo) =>
      limit(async () => {
        const prompt = buildPrompt(combo)
        const type = typeOf(combo)
        try {
          const raw = await generateImage(prompt)
          // 原寸(1024, 高品質)と 512 を別ディレクトリに保存
          await finishImage(raw, ORIGINAL_SIZE, 92).toFile(absFile('original', type, combo.id))
          await finishImage(raw, IMAGE_SIZE, 90).toFile(absFile('512', type, combo.id))
          done++
          console.log(`[${done + failed}/${pending.length}] ✓ ${combo.id}`)
        } catch (err) {
          failed++
          const msg = (err as Error)?.message ?? String(err)
          failures.push({ id: combo.id, err: msg })
          console.warn(`[${done + failed}/${pending.length}] ✗ ${combo.id}: ${msg}`)
        }
      }),
    ),
  )

  console.log(`\n完了: 成功 ${done} / 失敗 ${failed}`)
  if (failures.length) {
    console.log('失敗一覧（--force で再試行可）:')
    failures.forEach((f) => console.log(`  - ${f.id}: ${f.err}`))
  }

  const m = await writeManifest(generatedAt)
  console.log(`data/library.json: characters=${m.counts.characters}, monsters=${m.counts.monsters}, total=${m.total}`)
  console.log(`実費概算: $${(done * COST_PER_IMAGE).toFixed(2)}`)
}

main().catch((err) => {
  console.error(err)
  process.exitCode = 1
})
