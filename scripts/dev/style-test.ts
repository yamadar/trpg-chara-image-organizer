// 【開発専用】画風を固定する前の比較実験。
// 5つの画風プロンプト × 同一の4被写体（人間/エルフ/ドワーフ/ゴブリン）= 20枚を生成。
// 出力は .cache/style-tests/（gitignore済み）。本番パイプラインとは独立。
//   tsx scripts/dev/style-test.ts
import 'dotenv/config'
import { mkdir } from 'node:fs/promises'
import { existsSync } from 'node:fs'
import path from 'node:path'
import sharp from 'sharp'
import pLimit from 'p-limit'
import { generateImage } from '../gemini'
import { ROOT, IMAGE_SIZE } from '../config'

const OUT = path.join(ROOT, '.cache', 'style-tests')

interface Style {
  id: string
  labelJa: string
  prompt: string
}
interface Subject {
  id: string
  prompt: string
}

// リアル寄り・高精細を軸に、媒体・雰囲気で差をつけた5案。
const STYLES: Style[] = [
  {
    id: '1-photoreal',
    labelJa: '① フォトリアル（写真・映画調）',
    prompt:
      'Photorealistic fantasy character, hyper-detailed and cinematic, captured like a high-end film still on a full-frame DSLR with an 85mm lens. Realistic skin with fine pores, lifelike material textures on metal, leather and cloth, physically accurate volumetric lighting, shallow depth of field, ultra sharp 8k detail.',
  },
  {
    id: '2-concept',
    labelJa: '② 高精細デジタル概念画（ArtStation系）',
    prompt:
      'Highly detailed digital painting in the style of premium fantasy concept art trending on ArtStation. Realistic anatomy and proportions, intricate rendering of armor, fabric and skin, dramatic rim lighting and subtle ambient occlusion, rich layered textures, painterly yet near-photorealistic finish.',
  },
  {
    id: '3-oil',
    labelJa: '③ クラシック油彩（写実）',
    prompt:
      'Richly detailed oil painting in a classical realism style reminiscent of old master portraiture. Lifelike chiaroscuro lighting, fine visible brushwork, deep glazed colors, accurate realistic features, subtle canvas texture, gallery-quality realism.',
  },
  {
    id: '4-3d',
    labelJa: '④ 3D CGIレンダー（Unreal/Octane系）',
    prompt:
      'Ultra-detailed 3D render, cinematic CGI in the style of Unreal Engine 5 and Octane. Physically based rendering (PBR) materials, subsurface scattering on skin, ray-traced global illumination, crisp micro-detail on every surface, AAA game cinematic quality.',
  },
  {
    id: '5-grimdark',
    labelJa: '⑤ ダーク・グリッティ写実',
    prompt:
      'Gritty hyper-detailed dark fantasy realism. Weathered and grimy realistic textures, scars, dirt and worn battered materials, desaturated muted palette, harsh moody directional lighting, fine intricate detail, atmospheric and somber tone.',
  },
]

// 画風だけを比較できるよう被写体は固定。
const SUBJECTS: Subject[] = [
  {
    id: 'human',
    prompt:
      'Subject: a human male warrior with short dark hair and light stubble, wearing battered steel plate armor.',
  },
  {
    id: 'elf',
    prompt:
      'Subject: a female elf with long flowing hair and elegant pointed ears, wearing ornate leather-and-green ranger garb.',
  },
  {
    id: 'dwarf',
    prompt:
      'Subject: a male dwarf with a long intricately braided beard and a rugged weathered face, wearing heavy iron armor.',
  },
  {
    id: 'goblin',
    prompt:
      'Subject: a goblin with green warty skin, large pointed ears, a crooked nose and sharp jagged teeth, wearing crude scavenged leather-and-metal gear.',
  },
]

const FRAMING =
  'Composition: a centered upper-body / head-and-shoulders portrait of a single character, turned slightly to one side and looking toward the viewer, filling a square 1:1 frame, with a simple softly textured neutral background.'
const CONSTRAINTS =
  'Do not include any text, letters, watermark, logo, border or frame. Show only one character.'

function buildPrompt(style: Style, subject: Subject): string {
  return [style.prompt, subject.prompt, FRAMING, CONSTRAINTS].join(' ')
}

async function main() {
  if (!process.env.GEMINI_API_KEY) {
    console.error('GEMINI_API_KEY 未設定。.env に設定してください。')
    process.exitCode = 1
    return
  }
  await mkdir(OUT, { recursive: true })
  const tasks: Array<{ style: Style; subject: Subject }> = []
  for (const style of STYLES) for (const subject of SUBJECTS) tasks.push({ style, subject })

  console.log(
    `画風 ${STYLES.length} × 被写体 ${SUBJECTS.length} = ${tasks.length} 枚を生成します（約$${(tasks.length * 0.039).toFixed(2)}）`,
  )
  const limit = pLimit(4)
  let done = 0
  let failed = 0
  await Promise.all(
    tasks.map(({ style, subject }) =>
      limit(async () => {
        const out = path.join(OUT, `${style.id}__${subject.id}.webp`)
        if (existsSync(out)) {
          done++
          console.log(`[${done + failed}/${tasks.length}] = skip (既存) ${style.id} / ${subject.id}`)
          return
        }
        try {
          const raw = await generateImage(buildPrompt(style, subject), { useAnchor: false })
          await sharp(raw)
            .resize(IMAGE_SIZE, IMAGE_SIZE, { fit: 'cover', position: 'centre' })
            .webp({ quality: 90 })
            .toFile(out)
          done++
          console.log(`[${done + failed}/${tasks.length}] ✓ ${style.id} / ${subject.id}`)
        } catch (e) {
          failed++
          console.warn(`[${done + failed}/${tasks.length}] ✗ ${style.id}/${subject.id}: ${(e as Error).message}`)
        }
      }),
    ),
  )
  console.log(`\n完了: 成功 ${done} / 失敗 ${failed}`)
  console.log(`出力先: ${OUT}`)
}

main().catch((e) => {
  console.error(e)
  process.exitCode = 1
})
