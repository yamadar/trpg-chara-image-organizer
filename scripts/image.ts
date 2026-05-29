// 生成画像の最終処理: 512×512へ縮小し、小サイズ表示での視認性向上のため
// 彩度とコントラストを少し上げて webp 出力する。強さはここで一括調整。
import sharp from 'sharp'
import { IMAGE_SIZE } from './config'

/** 彩度の倍率（1.0=変更なし）。 */
export const SATURATION = 1.15
/** コントラストの倍率（1.0=変更なし。中間値128を軸に強調）。 */
export const CONTRAST = 1.15
/** webp 品質。 */
export const WEBP_QUALITY = 90

/**
 * 生バイト列 or ファイルパスを受け取り、最終 webp 用の sharp パイプラインを返す。
 * 呼び出し側で `.toFile(out)` する。
 */
export function finishImage(input: Buffer | string) {
  return sharp(input)
    .resize(IMAGE_SIZE, IMAGE_SIZE, { fit: 'cover', position: 'centre' })
    .modulate({ saturation: SATURATION })
    .linear(CONTRAST, 128 * (1 - CONTRAST))
    .webp({ quality: WEBP_QUALITY })
}
