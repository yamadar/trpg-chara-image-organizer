import { useEffect, useState } from 'react'
import type { Library } from '../types'

const base = import.meta.env.BASE_URL

interface State {
  library: Library | null
  loading: boolean
  error: string | null
}

export function useManifest(): State {
  const [state, setState] = useState<State>({ library: null, loading: true, error: null })

  useEffect(() => {
    let alive = true
    fetch(`${base}data/library.json`)
      .then((r) => {
        if (!r.ok) throw new Error(`data/library.json の取得に失敗しました (HTTP ${r.status})`)
        return r.json() as Promise<Library>
      })
      .then((library) => {
        if (alive) setState({ library, loading: false, error: null })
      })
      .catch((e: unknown) => {
        if (alive)
          setState({ library: null, loading: false, error: e instanceof Error ? e.message : String(e) })
      })
    return () => {
      alive = false
    }
  }, [])

  return state
}
