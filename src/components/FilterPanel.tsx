import type { FilterOptions, FilterState } from '../lib/manifest-utils'
import type { TaxonomyEntry } from '../types'

export type FilterCategory = 'types' | 'races' | 'genders' | 'ages' | 'professions' | 'monsters'

const TYPE_ENTRIES: TaxonomyEntry[] = [
  { key: 'character', labelJa: 'キャラクター' },
  { key: 'monster', labelJa: 'モンスター' },
]

interface Props {
  options: FilterOptions
  filter: FilterState
  onToggle: (category: FilterCategory, key: string) => void
  onClearAll: () => void
}

function Chip({
  active,
  label,
  onClick,
}: {
  active: boolean
  label: string
  onClick: () => void
}) {
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
  category: FilterCategory
  entries: TaxonomyEntry[]
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

export default function FilterPanel({ options, filter, onToggle, onClearAll }: Props) {
  const anyActive =
    filter.types.size +
      filter.races.size +
      filter.genders.size +
      filter.ages.size +
      filter.professions.size +
      filter.monsters.size >
    0

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold text-slate-200">絞り込み</h2>
        {anyActive && (
          <button
            type="button"
            onClick={onClearAll}
            className="text-xs text-indigo-400 hover:text-indigo-300"
          >
            すべて解除
          </button>
        )}
      </div>
      <Group title="種別" category="types" entries={TYPE_ENTRIES} selected={filter.types} onToggle={onToggle} />
      <Group title="種族" category="races" entries={options.races} selected={filter.races} onToggle={onToggle} />
      <Group title="性別" category="genders" entries={options.genders} selected={filter.genders} onToggle={onToggle} />
      <Group title="年齢" category="ages" entries={options.ages} selected={filter.ages} onToggle={onToggle} />
      <Group title="職業" category="professions" entries={options.professions} selected={filter.professions} onToggle={onToggle} />
      <Group title="モンスター" category="monsters" entries={options.monsters} selected={filter.monsters} onToggle={onToggle} />
    </div>
  )
}
