import { useMemo, useState } from 'react'
import { useManifest } from './hooks/useManifest'
import {
  emptySelection,
  matchesCharacter,
  matchesMonster,
  type Mode,
  type Selection,
} from './lib/manifest-utils'
import type { Item } from './types'
import FilterPanel from './components/FilterPanel'
import SearchBar from './components/SearchBar'
import CharacterGrid from './components/CharacterGrid'
import DetailModal from './components/DetailModal'

const LIBRARY_URL = `${import.meta.env.BASE_URL}data/library.json`
const REPO_URL = 'https://github.com/yamadar/trpg-chara-image-organizer'

export default function App() {
  const { library, loading, error } = useManifest()
  const [mode, setMode] = useState<Mode>('characters')
  const [query, setQuery] = useState('')
  const [selection, setSelection] = useState<Selection>(emptySelection)
  const [selected, setSelected] = useState<Item | null>(null)

  const results = useMemo<Item[]>(() => {
    if (!library) return []
    return mode === 'characters'
      ? library.characters.filter((c) => matchesCharacter(c, selection, query))
      : library.monsters.filter((m) => matchesMonster(m, selection, query))
  }, [library, mode, selection, query])

  const toggle = (category: keyof Selection, key: string) => {
    setSelection((prev) => {
      const set = new Set(prev[category])
      if (set.has(key)) set.delete(key)
      else set.add(key)
      return { ...prev, [category]: set }
    })
  }
  const clearAll = () => setSelection(emptySelection())

  const TabButton = ({ value, label, count }: { value: Mode; label: string; count?: number }) => (
    <button
      type="button"
      onClick={() => setMode(value)}
      className={
        'rounded-lg px-4 py-2 text-sm font-semibold transition ' +
        (mode === value
          ? 'bg-indigo-500 text-white'
          : 'bg-slate-800 text-slate-300 hover:bg-slate-700')
      }
    >
      {label}
      {count != null && <span className="ml-2 text-xs opacity-80">{count}</span>}
    </button>
  )

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100">
      <header className="border-b border-slate-800 bg-slate-900/80 px-4 py-4 backdrop-blur sm:px-6">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-wrap items-baseline justify-between gap-2">
            <h1 className="text-xl font-bold sm:text-2xl">TRPG キャラクター画像ライブラリ</h1>
            <nav className="flex gap-4 text-sm">
              <a className="text-indigo-400 hover:text-indigo-300" href={LIBRARY_URL} target="_blank" rel="noopener noreferrer">
                library.json
              </a>
              <a className="text-indigo-400 hover:text-indigo-300" href={REPO_URL} target="_blank" rel="noopener noreferrer">
                GitHub
              </a>
            </nav>
          </div>
          <p className="mt-1 text-sm text-slate-400">
            種族・性別・年齢・職業で網羅した汎用キャラ＋モンスター画像（512px / 原寸の2サイズ）。画像URLとJSONは他サイトからも利用できます。
          </p>
        </div>
      </header>

      <main className="mx-auto flex max-w-7xl flex-col gap-6 px-4 py-6 sm:px-6 md:flex-row">
        <aside className="md:sticky md:top-6 md:h-fit md:w-64 md:shrink-0 space-y-4">
          <div className="flex gap-2">
            <TabButton value="characters" label="キャラクター" count={library?.counts.characters} />
            <TabButton value="monsters" label="モンスター" count={library?.counts.monsters} />
          </div>
          {library && (
            <FilterPanel
              mode={mode}
              tags={library.tags}
              selection={selection}
              onToggle={toggle}
              onClearAll={clearAll}
            />
          )}
        </aside>

        <section className="min-w-0 flex-1">
          <div className="mb-4 space-y-3">
            <SearchBar value={query} onChange={setQuery} />
            {library && (
              <p className="text-sm text-slate-400">
                {results.length} 件表示
                <span className="ml-2 text-slate-600">(生成日: {library.generated_at.slice(0, 10)})</span>
              </p>
            )}
          </div>

          {loading && <div className="py-20 text-center text-slate-500">読み込み中…</div>}

          {error && (
            <div className="rounded-lg border border-amber-700/50 bg-amber-900/20 p-4 text-sm text-amber-200">
              <p className="font-semibold">画像データを読み込めませんでした。</p>
              <p className="mt-1 text-amber-300/80">{error}</p>
              <p className="mt-2 text-amber-300/60">
                まだ画像を生成していない場合は <code className="rounded bg-black/30 px-1">npm run gen:all</code> を実行してください。
              </p>
            </div>
          )}

          {library && <CharacterGrid items={results} onSelect={setSelected} />}
        </section>
      </main>

      {selected && library && (
        <DetailModal item={selected} baseUrl={library.base_url} onClose={() => setSelected(null)} />
      )}
    </div>
  )
}
