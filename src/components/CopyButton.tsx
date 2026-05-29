import { useState } from 'react'

interface Props {
  text: string
  label: string
  className?: string
}

export default function CopyButton({ text, label, className }: Props) {
  const [copied, setCopied] = useState(false)
  return (
    <button
      type="button"
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(text)
          setCopied(true)
          setTimeout(() => setCopied(false), 1500)
        } catch {
          // クリップボード不可環境では何もしない
        }
      }}
      className={
        className ??
        'rounded-md bg-slate-700 px-3 py-1.5 text-sm font-medium text-slate-100 transition hover:bg-slate-600'
      }
    >
      {copied ? '✓ コピーしました' : label}
    </button>
  )
}
