import { useEffect, useState } from 'react'
import { fetchEvents, type CategoryKey, type Event } from '../api'

const PAGE_SIZE = 30

export type EventsStatus = 'loading' | 'ready' | 'error'

interface LoadedPage {
  key: string // `${date}|${category}` the items belong to
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
    fetchEvents({ date, category: category ?? undefined, limit: PAGE_SIZE })
      .then((data) => !cancelled && setPage({ key: `${date}|${category}`, items: data.items, total: data.total }))
      .catch(() => !cancelled && setFailedRequest(`${date}|${category}|${reloadCount}`))
    return () => {
      cancelled = true
    }
  }, [date, category, reloadCount])

  const isCurrent = page?.key === key
  const items = isCurrent ? page.items : []
  const total = isCurrent ? page.total : 0
  const status: EventsStatus = isCurrent ? 'ready' : failedRequest === request ? 'error' : 'loading'

  const loadMore = async () => {
    if (!isCurrent) return
    setLoadingMore(true)
    try {
      const data = await fetchEvents({ date, category: category ?? undefined, limit: PAGE_SIZE, offset: items.length })
      setPage((previous) =>
        previous?.key === key ? { ...previous, items: [...previous.items, ...data.items] } : previous,
      )
    } catch {
      // Keep the current list; the user can click "load more" again.
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
