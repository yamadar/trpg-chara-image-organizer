import { useMemo, useState } from 'react'
import { useManifest } from './hooks/useManifest'
import {
  deriveOptions,
  emptyFilter,
  matchesFilter,
  type FilterState,
} from './lib/manifest-utils'
import type { Item } from './types'
import FilterPanel, { type FilterCategory } from './components/FilterPanel'
import SearchBar from './components/SearchBar'
import CharacterGrid from './components/CharacterGrid'
import DetailModal from './components/DetailModal'

const MANIFEST_URL = `${import.meta.env.BASE_URL}images/manifest.json`
const REPO_URL = 'https://github.com/yamadar/trpg-chara-image-organizer'

export default function App() {
  const { manifest, loading, error } = useManifest()
  const [filter, setFilter] = useState<FilterState>(emptyFilter)
  const [selected, setSelected] = useState<Item | null>(null)

  const allItems = useMemo<Item[]>(
    () => (manifest ? [...manifest.characters, ...manifest.monsters] : []),
    [manifest],
  )
  const options = useMemo(() => (manifest ? deriveOptions(manifest) : null), [manifest])
  const results = useMemo(() => allItems.filter((i) => matchesFilter(i, filter)), [allItems, filter])

  const toggle = (category: FilterCategory, key: string) => {
    setFilter((prev) => {
      const set = new Set(prev[category])
      if (set.has(key)) set.delete(key)
      else set.add(key)
      return { ...prev, [category]: set }
    })
  }
  const setQuery = (query: string) => setFilter((p) => ({ ...p, query }))
  const clearAll = () => setFilter((p) => ({ ...emptyFilter(), query: p.query }))

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100">
      <header className="border-b border-slate-800 bg-slate-900/80 px-4 py-4 backdrop-blur sm:px-6">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-wrap items-baseline justify-between gap-2">
            <h1 className="text-xl font-bold sm:text-2xl">TRPG キャラクター画像ライブラリ</h1>
            <nav className="flex gap-4 text-sm">
              <a className="text-indigo-400 hover:text-indigo-300" href={MANIFEST_URL} target="_blank" rel="noopener noreferrer">
                manifest.json
              </a>
              <a className="text-indigo-400 hover:text-indigo-300" href={REPO_URL} target="_blank" rel="noopener noreferrer">
                GitHub
              </a>
            </nav>
          </div>
          <p className="mt-1 text-sm text-slate-400">
            種族・性別・年齢・職業で網羅した汎用キャラクター画像（512×512 / セミリアル・ファンタジー）。
            画像URLとJSONは他サイトからも利用できます。
          </p>
        </div>
      </header>

      <main className="mx-auto flex max-w-7xl flex-col gap-6 px-4 py-6 sm:px-6 md:flex-row">
        <aside className="md:sticky md:top-6 md:h-fit md:w-64 md:shrink-0">
          {options && (
            <FilterPanel options={options} filter={filter} onToggle={toggle} onClearAll={clearAll} />
          )}
        </aside>

        <section className="min-w-0 flex-1">
          <div className="mb-4 space-y-3">
            <SearchBar value={filter.query} onChange={setQuery} />
            {manifest && (
              <p className="text-sm text-slate-400">
                {results.length} 件表示 / 全 {allItems.length} 件
                <span className="ml-2 text-slate-600">
                  (生成日: {manifest.generatedAt.slice(0, 10)})
                </span>
              </p>
            )}
          </div>

          {loading && <div className="py-20 text-center text-slate-500">読み込み中…</div>}

          {error && (
            <div className="rounded-lg border border-amber-700/50 bg-amber-900/20 p-4 text-sm text-amber-200">
              <p className="font-semibold">画像データを読み込めませんでした。</p>
              <p className="mt-1 text-amber-300/80">{error}</p>
              <p className="mt-2 text-amber-300/60">
                まだ画像を生成していない場合は <code className="rounded bg-black/30 px-1">npm run gen:pilot</code> を実行してください。
              </p>
            </div>
          )}

          {manifest && <CharacterGrid items={results} onSelect={setSelected} />}
        </section>
      </main>

      {selected && <DetailModal item={selected} onClose={() => setSelected(null)} />}
    </div>
  )
}
