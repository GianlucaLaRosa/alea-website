'use client'

import { Button, useDocumentInfo, useForm } from '@payloadcms/ui'
import type { UIFieldClientComponent } from 'payload'
import { useCallback, useState } from 'react'

import type { BggImportWarning } from '@/utilities/bgg/types'

/** Stessa logica di Payload `slugField` (utilities/slugify). */
function slugifyTitle(title: string): string {
  return title.trim().replace(/ /g, '-').replace(/[^\w-]+/g, '').toLowerCase()
}

type FetchSuccess = {
  ok: true
  data: {
    bggId: number
    title: string
    shortDescription: string
    description: string
    minPlayers: number
    maxPlayers: number
    minPlayTime: number
    maxPlayTime: number
    bggUrl: string
    expansions: { name: string; bggId: number | null }[]
    tagIds: number[]
    cardImageId: number | null
    detailImageId: number | null
    heroImageId: number | null
  }
  warnings: BggImportWarning[]
  duplicate: boolean
}

type FetchError = {
  ok: false
  error: string
  expansionHint?: { baseGameName: string; baseGameBggId: number | null } | null
}

export const GameBggImport: UIFieldClientComponent = () => {
  const { id } = useDocumentInfo()
  const { dispatchFields, setModified } = useForm()
  const [url, setUrl] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<string | null>(null)
  const [warnings, setWarnings] = useState<BggImportWarning[]>([])
  const [error, setError] = useState<string | null>(null)
  const [expansionHint, setExpansionHint] = useState<FetchError['expansionHint']>(null)

  const applyImport = useCallback(
    (result: FetchSuccess) => {
      const { data } = result

      dispatchFields({ type: 'UPDATE', path: 'bggId', value: data.bggId })
      dispatchFields({ type: 'UPDATE', path: 'bggUrl', value: data.bggUrl })
      dispatchFields({ type: 'UPDATE', path: 'title', value: data.title })
      dispatchFields({ type: 'UPDATE', path: 'slug', value: slugifyTitle(data.title) })
      dispatchFields({ type: 'UPDATE', path: 'generateSlug', value: true })
      dispatchFields({ type: 'UPDATE', path: 'shortDescription', value: data.shortDescription })
      dispatchFields({ type: 'UPDATE', path: 'description', value: data.description })
      dispatchFields({ type: 'UPDATE', path: 'minPlayers', value: data.minPlayers })
      dispatchFields({ type: 'UPDATE', path: 'maxPlayers', value: data.maxPlayers })
      dispatchFields({ type: 'UPDATE', path: 'minPlayTime', value: data.minPlayTime })
      dispatchFields({ type: 'UPDATE', path: 'maxPlayTime', value: data.maxPlayTime })
      dispatchFields({ type: 'UPDATE', path: 'expansions', value: data.expansions.map((exp) => ({
        name: exp.name,
        bggId: exp.bggId,
        owned: false,
      })) })
      dispatchFields({ type: 'UPDATE', path: 'tags', value: data.tagIds })
      if (data.cardImageId) {
        dispatchFields({ type: 'UPDATE', path: 'cardImage', value: data.cardImageId })
      }
      if (data.detailImageId) {
        dispatchFields({ type: 'UPDATE', path: 'detailImage', value: data.detailImageId })
      }
      if (data.heroImageId) {
        dispatchFields({ type: 'UPDATE', path: 'heroImage', value: data.heroImageId })
      }
      dispatchFields({ type: 'UPDATE', path: 'importWarnings', value: result.warnings })

      setModified(true)
      setWarnings(result.warnings)
    },
    [dispatchFields, setModified],
  )

  const handleImport = async () => {
    setLoading(true)
    setError(null)
    setMessage(null)
    setExpansionHint(null)
    setWarnings([])

    try {
      const res = await fetch('/api/games/fetch-bgg', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url, excludeId: id ?? undefined }),
      })

      const json = (await res.json()) as FetchSuccess | FetchError

      if (!json.ok) {
        setError(json.error)
        setExpansionHint(json.expansionHint ?? null)
        return
      }

      applyImport(json)

      if (json.duplicate) {
        setMessage(
          'Attenzione: esiste già un gioco con questo ID BGG. Controlla i dati prima di salvare.',
        )
      } else {
        setMessage(
          'Dati, tag e immagini importati. Puoi modificare tutto prima di salvare il gioco.',
        )
      }
    } catch {
      setError('Errore di rete durante l’import da BoardGameGeek.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="field-type bgg-import mb-6 rounded-md border border-[var(--theme-elevation-150)] bg-[var(--theme-elevation-50)] p-4">
      <h3 className="mb-2 text-base font-semibold">Importa da BoardGameGeek</h3>
      <p className="mb-3 text-sm text-[var(--theme-elevation-800)]">
        Incolla l’URL della scheda BGG (es.{' '}
        <code className="text-xs">boardgamegeek.com/boardgame/143519/quantum</code>) oppure compila
        il form manualmente sotto.
      </p>
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end">
        <label className="flex flex-1 flex-col gap-1 text-sm">
          <span className="font-medium">URL BGG</span>
          <input
            className="rounded-md border border-[var(--theme-elevation-150)] bg-[var(--theme-elevation-0)] px-3 py-2"
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://boardgamegeek.com/boardgame/…"
            type="url"
            value={url}
          />
        </label>
        <Button buttonStyle="primary" disabled={loading || !url.trim()} onClick={handleImport}>
          {loading ? 'Importazione…' : 'Importa dati'}
        </Button>
      </div>

      {message ? (
        <p className="mt-3 text-sm text-[var(--theme-success-500)]" role="status">
          {message}
        </p>
      ) : null}

      {error ? (
        <div className="mt-3 text-sm text-[var(--theme-error-500)]" role="alert">
          <p>{error}</p>
          {expansionHint ? (
            <p className="mt-1">
              Gioco base: <strong>{expansionHint.baseGameName}</strong>
              {expansionHint.baseGameBggId
                ? ` (ID BGG ${expansionHint.baseGameBggId})`
                : null}
            </p>
          ) : null}
        </div>
      ) : null}

      {warnings.length > 0 ? (
        <div className="mt-3">
          <p className="text-sm font-medium">Avvisi import:</p>
          <ul className="mt-1 list-inside list-disc text-sm text-[var(--theme-warning-500)]">
            {warnings.map((w) => (
              <li key={`${w.field}-${w.message}`}>{w.message}</li>
            ))}
          </ul>
        </div>
      ) : null}
    </div>
  )
}
