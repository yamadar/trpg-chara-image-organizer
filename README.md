# TRPG キャラクター画像ライブラリ

TRPGで汎用利用できるキャラクター／モンスター画像を生成AI（Google Gemini 2.5 Flash Image / Nano Banana）で作成し、**属性メタデータ付きのJSON**として配信するプロジェクトです。画像は **512×512px**、絵柄は **セミリアル・ファンタジー** で統一しています。

- 閲覧用の静的SPA（ギャラリー / フィルタ）
- 他サイトからも `manifest.json` を fetch し、画像URLを直接利用可能（GitHub Pages の CORS 対応）

公開URL（予定）: https://yamadar.github.io/trpg-chara-image-organizer/
配信JSON（予定）: https://yamadar.github.io/trpg-chara-image-organizer/images/manifest.json

---

## セットアップ

```bash
npm install
cp .env.example .env   # GEMINI_API_KEY を記入
```

`GEMINI_API_KEY` は [Google AI Studio](https://aistudio.google.com/apikey) で取得します。

## 画像の生成

```bash
npm run gen:dry     # 生成せず、対象枚数と概算費用だけ表示（APIキー不要）
npm run gen:pilot   # パイロット（約12枚）を生成して絵柄を確認
npm run gen:all     # 全パターンを本生成（課金が発生します）
```

主なオプション（`tsx scripts/generate.ts` に渡す）:

| フラグ | 説明 |
| --- | --- |
| `--dry-run` | API を呼ばず対象一覧・枚数・概算費用のみ表示 |
| `--pilot` | 代表パターン（約12枚）だけ生成 |
| `--all` | キャラ＋モンスターの全パターンを生成 |
| `--characters` / `--monsters` | 対象を絞る |
| `--limit N` | 先頭 N 件だけ生成 |
| `--force` | 既存画像があっても再生成 |
| `--manifest-only` | 既存画像から manifest.json / taxonomy.json のみ再生成 |

生成物:
- `public/images/characters/*.webp`, `public/images/monsters/*.webp`
- `public/images/manifest.json`（配信する主成果物）
- `public/images/taxonomy.json`（フィルタUI構築用の属性辞書）

分類（種族・性別・年齢・職業・モンスター）や枚数は `data/taxonomy.ts` で編集できます。

## SPA（ギャラリー）

```bash
npm run dev       # 開発サーバ
npm run build     # 本番ビルド（dist/）
npm run preview   # ビルド結果をローカル確認
```

## デプロイ（GitHub Pages）

`main` ブランチへ push すると `.github/workflows/deploy.yml` が `dist/` を GitHub Pages へ公開します。

初回のみ、リポジトリの **Settings → Pages → Build and deployment → Source** を **「GitHub Actions」** に設定してください。

## 他サイトからの利用例

```js
const res = await fetch('https://yamadar.github.io/trpg-chara-image-organizer/images/manifest.json')
const data = await res.json()
const human = data.characters.find(c => c.race === 'human' && c.profession === 'fighter')
img.src = human.url // 512x512 webp の直リンク
```

## ライセンス / 注意
- 生成画像には Gemini の SynthID（不可視透かし）が含まれます。
- 商標的な固有モンスター名は使用せず、汎用的なファンタジー名のみを用いています。
