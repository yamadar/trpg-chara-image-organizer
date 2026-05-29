// 【開発専用】既存の 512 webp に最終処理(彩度/コントラスト)を再適用し -pop 版を出力する。
// 既存画像から作るので API コストは発生しない（調整結果の確認用）。
//   tsx scripts/dev/reprocess.ts [name ...]   （省略時は既定の2枚）
import path from 'node:path'
import { finishImage } from '../image'
import { ROOT } from '../config'

const DIR = path.join(ROOT, 'public', 'style-tests')
const args = process.argv.slice(2)
const targets = args.length ? args : ['oilgrim__dragon', 'oilgrim__dragonborn2']

;(async () => {
  for (const name of targets) {
    const out = path.join(DIR, `${name}-pop.webp`)
    await finishImage(path.join(DIR, `${name}.webp`)).toFile(out)
    console.log(`wrote ${name}-pop.webp`)
  }
  console.log('done')
})().catch((e) => {
  console.error(e)
  process.exitCode = 1
})
