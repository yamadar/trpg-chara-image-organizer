// 全画像で共通の絵柄・構図の定義。
// 絵柄: セミリアル・ファンタジー（西洋ハイファンタジーの絵画調 / TRPGルールブック風）。
// 商標ブランド名は使わず一般語で表現する。

export const STYLE_ID = 'semi-real-fantasy'

/** 全生成に共通して前置きする絵柄の説明。 */
export const STYLE_PREAMBLE =
  'Semi-realistic high-fantasy illustration in the style of a classic Western tabletop RPG rulebook. ' +
  'Painterly digital art with rich, detailed rendering, dramatic soft cinematic lighting, ' +
  'a muted earthy color palette, and a subtly textured neutral background.'

/** キャラクターの構図（バストアップ・中央・正方形）。 */
export const CHARACTER_FRAMING =
  'Composition: a centered bust / head-and-shoulders portrait of a single character, ' +
  'turned slightly to one side and looking toward the viewer, filling the square 1:1 frame.'

/** モンスターの構図（全身〜上半身・正方形）。 */
export const MONSTER_FRAMING =
  'Composition: a single creature centered in a square 1:1 frame, dynamic three-quarter view, ' +
  'in the manner of a fantasy bestiary illustration.'

/** 望ましくない要素の抑制（自然言語の指示として記述）。 */
export const CONSTRAINTS =
  'Do not include any text, letters, numbers, captions, watermarks, logos, signatures, ' +
  'borders or frames. Show only one subject. Do not make it a photograph or a modern setting.'

/** モンスターは種別ごとに2枚。各バリアントの差分指示。 */
export const MONSTER_VARIANT_HINTS = [
  'Calm, neutral standing pose with a watchful expression.',
  'Aggressive action pose, snarling and ready to attack.',
] as const
