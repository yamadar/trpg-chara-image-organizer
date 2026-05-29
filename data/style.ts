// 全画像で共通の絵柄・構図の定義。
// 絵柄: ダーク・グリッティ写実（グリムダーク）。
// 商標ブランド名は使わず一般語で表現する。
// ※ 将来、画風バリエーションを増やす場合はこの STYLE_PREAMBLE を差し替える運用。

export const STYLE_ID = 'oil-grimdark'

/** 全生成に共通して前置きする絵柄の説明。oil(クラシック油彩) と grimdark(ダーク写実) の中間。 */
export const STYLE_PREAMBLE =
  'A richly detailed oil painting in a classical realism style (old-master portraiture) with fine, visible ' +
  'brushwork, deep glazed colors and a subtle canvas texture, rendered with a gritty dark-fantasy mood: ' +
  'weathered grimy textures, scars and worn battered materials, a desaturated muted palette, ' +
  'harsh dramatic chiaroscuro lighting, fine intricate detail, and a somber, atmospheric tone.'

/** キャラクターの構図（バストアップ・中央・正方形）。 */
export const CHARACTER_FRAMING =
  'Composition: a centered bust / head-and-shoulders portrait of a single character, ' +
  'turned slightly to one side and looking toward the viewer, filling the square 1:1 frame.'

/** モンスターの構図（全身〜上半身・正方形）。 */
export const MONSTER_FRAMING =
  'Composition: a single creature centered in a square 1:1 frame, dynamic three-quarter view, ' +
  'in the manner of a dark fantasy bestiary illustration.'

/** 敵対的なモンスターの凶暴さ・悪者感を強調（ユーザー指定）。 */
export const MONSTER_MENACE =
  'Emphasize a fierce, menacing and villainous impression through an aggressive, threatening pose ' +
  'and a hostile, snarling expression.'

/** 背景は白で統一（ユーザー指定）。末尾で強く指定して確実に白背景にする。 */
export const BACKGROUND =
  'The background must be a plain, solid pure white background only — no scenery, no props, ' +
  'and no shadows cast on the backdrop.'

/** 望ましくない要素の抑制（自然言語の指示として記述）。 */
export const CONSTRAINTS =
  'Do not include any text, letters, numbers, captions, watermarks, logos, signatures, ' +
  'borders or frames. Show only one subject. Do not make it a photograph or a modern setting.'

/** モンスターは種別ごとに2枚。各バリアントの差分指示（いずれも威圧的）。 */
export const MONSTER_VARIANT_HINTS = [
  'A menacing standing pose, glaring with a hostile, intimidating expression.',
  'A ferocious, aggressive attacking pose, snarling and baring its teeth.',
] as const
