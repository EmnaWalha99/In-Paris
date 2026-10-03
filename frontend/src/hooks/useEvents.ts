import { useEffect, useState } from 'react'
import type { CategoryKey, Event } from '../types'
import { fetchEvents } from '../api'
import { PAGE_SIZE } from '../config'

export type EventsStatus = 'loading' | 'ready' | 'error'

interface LoadedPage {
  key: string // the date/category the items belong to
  items: Event[]
  total: number
}

export function useEvents(date: string, category: CategoryKey | null) {
  const [page, setPage] = useState<LoadedPage | null>(null)
  const [failedRequest, setFailedRequest] = useState<string | null>(null)
  const [reloadCount, setReloadCount] = useState(0)
  const [loadingMore, setLoadingMore] = useState(false)

  const key = `${date}|${category}`
  const request = `${key}|${reloadCount}`

  useEffect(() => {
    let cancelled = false
    fetchEvents({ date, category, limit: PAGE_SIZE })
      .then(({ items, total }) => !cancelled && setPage({ key, items, total }))
      .catch(() => !cancelled && setFailedRequest(request))
    return () => {
      cancelled = true
    }
  }, [date, category, key, request])

  const isCurrent = page?.key === key
  const items = isCurrent ? page.items : []
  const total = isCurrent ? page.total : 0
  const status: EventsStatus = isCurrent ? 'ready' : failedRequest === request ? 'error' : 'loading'

  const loadMore = async () => {
    setLoadingMore(true)
    try {
      const next = await fetchEvents({ date, category, limit: PAGE_SIZE, offset: items.length })
      setPage((previous) => (previous?.key === key ? { ...previous, items: [...previous.items, ...next.items] } : previous))
    } catch {
      // Keep the current list: the user can click "load more" again.
    } finally {
      setLoadingMore(false)
    }
  }

  return {
    items,
    total,
    status,
    loadedFor: page?.key ?? '',
    loadingMore,
    hasMore: items.length < total,
    loadMore,
    retry: () => setReloadCount((count) => count + 1),
  }
}
