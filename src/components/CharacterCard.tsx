import type { Item } from '../types'
import { imageSrc, primaryLabel, subLabel } from '../lib/manifest-utils'

interface Props {
  item: Item
  onSelect: (item: Item) => void
}

export default function CharacterCard({ item, onSelect }: Props) {
  return (
    <button
      type="button"
      onClick={() => onSelect(item)}
      className="group overflow-hidden rounded-lg border border-slate-800 bg-slate-800/50 text-left transition hover:border-indigo-500 hover:shadow-lg hover:shadow-indigo-500/10"
    >
      <div className="aspect-square w-full overflow-hidden bg-slate-900">
        <img
          src={imageSrc(item)}
          alt={`${subLabel(item)} ${primaryLabel(item)}`}
          width={512}
          height={512}
          loading="lazy"
          className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
        />
      </div>
      <div className="px-2.5 py-2">
        <div className="truncate text-sm font-medium text-slate-100">{primaryLabel(item)}</div>
        <div className="truncate text-xs text-slate-400">{subLabel(item)}</div>
      </div>
    </button>
  )
}
