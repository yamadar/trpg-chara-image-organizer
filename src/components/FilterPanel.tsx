import type { Library, TaxEntry } from '../types'
import type { Mode, Selection } from '../lib/manifest-utils'

interface Props {
  mode: Mode
  tags: Library['tags']
  selection: Selection
  onToggle: (category: keyof Selection, key: string) => void
  onClearAll: () => void
}

function Chip({ active, label, onClick }: { active: boolean; label: string; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={
        'rounded-full border px-3 py-1 text-sm transition ' +
        (active
          ? 'border-indigo-400 bg-indigo-500/20 text-indigo-200'
          : 'border-slate-700 bg-slate-800 text-slate-300 hover:border-slate-500')
      }
    >
      {label}
    </button>
  )
}

function Group({
  title,
  category,
  entries,
  selected,
  onToggle,
}: {
  title: string
  category: keyof Selection
  entries: TaxEntry[]
  selected: Set<string>
  onToggle: Props['onToggle']
}) {
  if (entries.length === 0) return null
  return (
    <div>
      <h3 className="mb-1.5 text-xs font-semibold uppercase tracking-wide text-slate-500">{title}</h3>
      <div className="flex flex-wrap gap-1.5">
        {entries.map((e) => (
          <Chip
            key={e.key}
            active={selected.has(e.key)}
            label={e.labelJa}
            onClick={() => onToggle(category, e.key)}
          />
        ))}
      </div>
    </div>
  )
}

export default function FilterPanel({ mode, tags, selection, onToggle, onClearAll }: Props) {
  const cats: (keyof Selection)[] = ['race', 'gender', 'age', 'profession', 'monster']
  const anyActive = cats.some((k) => selection[k].size > 0)

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold text-slate-200">絞り込み</h2>
        {anyActive && (
          <button type="button" onClick={onClearAll} className="text-xs text-indigo-400 hover:text-indigo-300">
            すべて解除
          </button>
        )}
      </div>

      {mode === 'characters' ? (
        <>
          <Group title="種族" category="race" entries={tags.race} selected={selection.race} onToggle={onToggle} />
          <Group title="性別" category="gender" entries={tags.gender} selected={selection.gender} onToggle={onToggle} />
          <Group title="年齢" category="age" entries={tags.age} selected={selection.age} onToggle={onToggle} />
          <Group title="職業" category="profession" entries={tags.profession} selected={selection.profession} onToggle={onToggle} />
        </>
      ) : (
        <Group title="モンスター" category="monster" entries={tags.monster} selected={selection.monster} onToggle={onToggle} />
      )}
    </div>
  )
}
