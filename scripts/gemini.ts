// Gemini 2.5 Flash Image (Nano Banana) 呼び出しラッパー。
// - 絵柄固定のためスタイルアンカー画像があれば参照として同梱する。
// - config(aspectRatio等)が拒否された場合は段階的に簡素な指定へフォールバック。
// - 429/5xx は指数バックオフでリトライ。
import { GoogleGenAI } from '@google/genai'
import { readFile } from 'node:fs/promises'
import { existsSync } from 'node:fs'
import { MODEL, STYLE_ANCHOR_CANDIDATES } from './config'

let client: GoogleGenAI | null = null
function getClient(): GoogleGenAI {
  const apiKey = process.env.GEMINI_API_KEY
  if (!apiKey) {
    throw new Error('GEMINI_API_KEY が未設定です。.env に設定してください（取得: https://aistudio.google.com/apikey）。')
  }
  if (!client) client = new GoogleGenAI({ apiKey })
  return client
}

let anchorCache: { mimeType: string; data: string } | null | undefined
async function loadStyleAnchor() {
  if (anchorCache !== undefined) return anchorCache
  const found = STYLE_ANCHOR_CANDIDATES.find((p) => existsSync(p))
  if (!found) {
    anchorCache = null
    return null
  }
  const buf = await readFile(found)
  const mimeType = found.endsWith('.png')
    ? 'image/png'
    : found.endsWith('.webp')
      ? 'image/webp'
      : 'image/jpeg'
  anchorCache = { mimeType, data: buf.toString('base64') }
  return anchorCache
}

export function hasStyleAnchor(): boolean {
  return STYLE_ANCHOR_CANDIDATES.some((p) => existsSync(p))
}

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms))

// 互換性のため、config を段階的に簡素化して試す。
const CONFIGS: Array<Record<string, unknown> | undefined> = [
  { responseModalities: ['Image'], imageConfig: { aspectRatio: '1:1' } },
  { imageConfig: { aspectRatio: '1:1' } },
  undefined,
]

function statusOf(err: unknown): number | undefined {
  const e = err as { status?: number; code?: number }
  return typeof e?.status === 'number' ? e.status : typeof e?.code === 'number' ? e.code : undefined
}

function isBadRequest(err: unknown): boolean {
  const s = statusOf(err)
  if (s === 400) return true
  return /invalid|unknown field|unexpected|400/i.test(String((err as Error)?.message ?? ''))
}

function isRetriable(err: unknown): boolean {
  const s = statusOf(err)
  if (typeof s === 'number') return s === 429 || s >= 500
  return /429|rate|quota|temporar|unavailable|internal|deadline|timeout|ECONN|ETIMEDOUT|fetch failed/i.test(
    String((err as Error)?.message ?? ''),
  )
}

function extractImage(res: unknown): Buffer | null {
  const parts =
    (res as { candidates?: Array<{ content?: { parts?: Array<Record<string, any>> } }> })
      ?.candidates?.[0]?.content?.parts ?? []
  for (const part of parts) {
    const data = part?.inlineData?.data
    if (typeof data === 'string') return Buffer.from(data, 'base64')
  }
  return null
}

/** プロンプトから 1 枚生成し、PNG等の生バイト列(Buffer)を返す。 */
export async function generateImage(
  prompt: string,
  opts: { useAnchor?: boolean; maxRetries?: number } = {},
): Promise<Buffer> {
  const ai = getClient()
  const maxRetries = opts.maxRetries ?? 5
  const anchor = opts.useAnchor === false ? null : await loadStyleAnchor()

  const contents: Array<Record<string, unknown>> = [{ text: prompt }]
  if (anchor) contents.unshift({ inlineData: { mimeType: anchor.mimeType, data: anchor.data } })

  let configIdx = 0
  let lastErr: unknown
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    const config = CONFIGS[Math.min(configIdx, CONFIGS.length - 1)]
    try {
      const res = await ai.models.generateContent({
        model: MODEL,
        contents,
        ...(config ? { config } : {}),
      })
      const img = extractImage(res)
      if (img) return img
      const text = ((res as { candidates?: Array<{ content?: { parts?: Array<{ text?: string }> } }> })
        ?.candidates?.[0]?.content?.parts ?? [])
        .map((p) => p.text)
        .filter(Boolean)
        .join(' ')
      throw new Error(`画像が返りませんでした${text ? `（理由: ${text}）` : '（セーフティ等で拒否の可能性）'}`)
    } catch (err) {
      lastErr = err
      // config が原因なら、より簡素な config へ落として即リトライ
      if (isBadRequest(err) && configIdx < CONFIGS.length - 1) {
        configIdx++
        continue
      }
      if (attempt < maxRetries && isRetriable(err)) {
        const backoff = Math.min(30000, 1000 * 2 ** attempt) + Math.floor(Math.random() * 500)
        await sleep(backoff)
        continue
      }
      throw err
    }
  }
  throw lastErr
}
