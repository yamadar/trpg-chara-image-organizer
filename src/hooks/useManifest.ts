import { useEffect, useState } from 'react'
import type { Manifest } from '../types'

const base = import.meta.env.BASE_URL

interface State {
  manifest: Manifest | null
  loading: boolean
  error: string | null
}

export function useManifest(): State {
  const [state, setState] = useState<State>({ manifest: null, loading: true, error: null })

  useEffect(() => {
    let alive = true
    fetch(`${base}images/manifest.json`)
      .then((r) => {
        if (!r.ok) throw new Error(`manifest.json の取得に失敗しました (HTTP ${r.status})`)
        return r.json() as Promise<Manifest>
      })
      .then((manifest) => {
        if (alive) setState({ manifest, loading: false, error: null })
      })
      .catch((e: unknown) => {
        if (alive)
          setState({ manifest: null, loading: false, error: e instanceof Error ? e.message : String(e) })
      })
    return () => {
      alive = false
    }
  }, [])

  return state
}
