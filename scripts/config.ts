// 生成パイプライン共通の定数・パス。
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const here = path.dirname(fileURLToPath(import.meta.url))
export const ROOT = path.resolve(here, '..')
export const PUBLIC_DIR = path.join(ROOT, 'public')
export const IMAGES_DIR = path.join(PUBLIC_DIR, 'images')
export const CHAR_DIR = path.join(IMAGES_DIR, 'characters')
export const MONSTER_DIR = path.join(IMAGES_DIR, 'monsters')
/** デバッグ用の生(1024)画像置き場。.gitignore 済み。 */
export const RAW_DIR = path.join(ROOT, '.cache', 'raw')

/** スタイルアンカー画像（パイロットで選定後に配置すると全生成の参照に使われる）。 */
export const STYLE_ANCHOR_CANDIDATES = [
  path.join(ROOT, 'data', 'style-anchor.png'),
  path.join(ROOT, 'data', 'style-anchor.webp'),
  path.join(ROOT, 'data', 'style-anchor.jpg'),
]

export const MODEL = 'gemini-2.5-flash-image'
export const IMAGE_SIZE = 512
export const COST_PER_IMAGE = 0.039 // USD（概算。1枚=1290トークン×$30/1M）
export const BASE_URL = 'https://yamadar.github.io/trpg-chara-image-organizer/images/'
export const MANIFEST_VERSION = '1.0.0'
export const FILE_EXT = 'webp'

export function charFile(id: string): string {
  return `characters/${id}.${FILE_EXT}`
}
export function monsterFile(id: string): string {
  return `monsters/${id}.${FILE_EXT}`
}
