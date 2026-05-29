interface Props {
  value: string
  onChange: (value: string) => void
}

export default function SearchBar({ value, onChange }: Props) {
  return (
    <div className="relative">
      <input
        type="search"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="キーワード検索（例: エルフ、戦士、ドラゴン）"
        className="w-full rounded-lg border border-slate-700 bg-slate-800 px-4 py-2 text-slate-100 placeholder-slate-500 outline-none focus:border-indigo-500"
        aria-label="キーワード検索"
      />
    </div>
  )
}
