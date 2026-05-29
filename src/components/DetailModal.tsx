import { useEffect } from 'react'
import type { Item } from '../types'
import { imageSrc, originalSrc } from '../lib/manifest-utils'
import CopyButton from './CopyButton'

interface Props {
  item: Item
  baseUrl: string
  onClose: () => void
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-4 border-b border-slate-800 py-1.5 text-sm">
      <span className="text-slate-400">{label}</span>
      <span className="text-right font-medium text-slate-100">{value}</span>
    </div>
  )
}

export default function DetailModal({ item, baseUrl, onClose }: Props) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  const rows: Array<[string, string]> =
    item.type === 'character'
      ? [
          ['種族', item.raceLabel],
          ['性別', item.genderLabel],
          ['年齢', item.ageLabel],
          ['職業', item.professionLabel],
        ]
      : [
          ['種別', item.monsterLabel],
          ['バリアント', `#${item.variant}`],
        ]

  const url512 = baseUrl + item.file
  const urlOriginal = item.original ? baseUrl + item.original : null
  const localOriginal = originalSrc(item)

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4"
      role="dialog"
      aria-modal="true"
      onClick={onClose}
    >
      <div
        className="flex max-h-[90vh] w-full max-w-3xl flex-col overflow-hidden rounded-xl border border-slate-700 bg-slate-900 md:flex-row"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="bg-slate-950 md:w-1/2">
          <img
            src={imageSrc(item)}
            alt={item.id}
            width={512}
            height={512}
            className="mx-auto aspect-square w-full max-w-md object-contain"
          />
        </div>
        <div className="flex min-w-0 flex-1 flex-col gap-3 overflow-y-auto p-5">
          <div className="flex items-start justify-between gap-2">
            <h2 className="text-lg font-bold text-slate-100">
              {item.type === 'character' ? item.professionLabel : item.monsterLabel}
            </h2>
            <button
              type="button"
              onClick={onClose}
              className="rounded-md p-1 text-slate-400 hover:bg-slate-800 hover:text-slate-200"
              aria-label="閉じる"
            >
              ✕
            </button>
          </div>

          <div className="font-mono text-xs text-slate-500">{item.id}</div>

          <div>
            {rows.map(([label, value]) => (
              <Row key={label} label={label} value={value} />
            ))}
            {item.has_original && <Row label="サイズ" value="原寸 / 512px の2種" />}
          </div>

          <div className="mt-1 flex flex-wrap gap-2">
            <CopyButton text={url512} label="512 URLをコピー" />
            {urlOriginal && <CopyButton text={urlOriginal} label="原寸URLをコピー" />}
            <a
              href={localOriginal ?? imageSrc(item)}
              download={`${item.id}.webp`}
              className="rounded-md bg-slate-700 px-3 py-1.5 text-sm font-medium text-slate-100 transition hover:bg-slate-600"
            >
              {localOriginal ? '原寸ダウンロード' : 'ダウンロード'}
            </a>
            <CopyButton text={JSON.stringify(item, null, 2)} label="JSONをコピー" />
          </div>

          <details className="mt-2">
            <summary className="cursor-pointer text-sm text-slate-400">JSON を表示</summary>
            <pre className="mt-2 overflow-x-auto rounded-md bg-slate-950 p-3 text-xs text-slate-300">
              {JSON.stringify(item, null, 2)}
            </pre>
          </details>
        </div>
      </div>
    </div>
  )
}
