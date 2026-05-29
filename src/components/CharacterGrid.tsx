import type { Item } from '../types'
import CharacterCard from './CharacterCard'

interface Props {
  items: Item[]
  onSelect: (item: Item) => void
}

export default function CharacterGrid({ items, onSelect }: Props) {
  if (items.length === 0) {
    return (
      <div className="flex h-64 items-center justify-center text-slate-500">
        条件に一致する画像がありません。
      </div>
    )
  }
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
      {items.map((item) => (
        <CharacterCard key={item.id} item={item} onSelect={onSelect} />
      ))}
    </div>
  )
}
