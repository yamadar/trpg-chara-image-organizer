// 生成パイプライン共通の定数・パス。
// 画像はサイズ別(original/512) × 種別(characters/monsters)のディレクトリに保存する。
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const here = path.dirname(fileURLToPath(import.meta.url))
export const ROOT = path.resolve(here, '..')
export const PUBLIC_DIR = path.join(ROOT, 'public')
export const IMAGES_DIR = path.join(PUBLIC_DIR, 'images')
export const DATA_DIR = path.join(PUBLIC_DIR, 'data')

/** スタイルアンカー画像（任意。あれば全生成の参照に使う）。 */
export const STYLE_ANCHOR_CANDIDATES = [
  path.join(ROOT, 'data', 'style-anchor.png'),
  path.join(ROOT, 'data', 'style-anchor.webp'),
  path.join(ROOT, 'data', 'style-anchor.jpg'),
]

export const MODEL = 'gemini-2.5-flash-image'
export const IMAGE_SIZE = 512
export const ORIGINAL_SIZE = 1024
export const COST_PER_IMAGE = 0.039 // USD（概算。API呼び出しは1組合せ=1回。サイズ違いは同一生成から派生）
export const BASE_URL = 'https://yamadar.github.io/trpg-chara-image-organizer/'
export const MANIFEST_VERSION = '2.0.0'

export type SizeKey = 'original' | '512'
export type EntityType = 'characters' | 'monsters'

/** サイト相対パス（'images/512/characters/{id}.webp'）。manifest の file/original に使う。 */
export function relFile(size: SizeKey, type: EntityType, id: string): string {
  return `images/${size}/${type}/${id}.webp`
}
/** ローカル絶対パス。 */
export function absFile(size: SizeKey, type: EntityType, id: string): string {
  return path.join(PUBLIC_DIR, relFile(size, type, id))
}
/** サイズ×種別のディレクトリ（mkdir 用）。 */
export function absSizeTypeDir(size: SizeKey, type: EntityType): string {
  return path.join(IMAGES_DIR, size, type)
}
