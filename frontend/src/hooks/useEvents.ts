import { infiniteQueryOptions, useInfiniteQuery, useQueryClient } from '@tanstack/react-query'
import { useEffect, useMemo } from 'react'
import { fetchEvents } from '../api'
import { PAGE_SIZE } from '../config'
import type { CategoryKey } from '../types'
import { getNextDay } from '../utils/format'

export type EventsStatus = 'loading' | 'ready' | 'error'

// One cache entry per day + category; each "load more" adds a page of PAGE_SIZE events.
const eventsQuery = (date: string, category: CategoryKey | null) =>
  infiniteQueryOptions({
    queryKey: ['events', date, category],
    queryFn: ({ pageParam, signal }) => fetchEvents({ date, category, limit: PAGE_SIZE, offset: pageParam }, signal),
    initialPageParam: 0,
    getNextPageParam: (lastPage, pages) => {
      const loaded = pages.reduce((count, page) => count + page.items.length, 0)
      return loaded < lastPage.total ? loaded : undefined
    },
  })

export function useEvents(date: string, category: CategoryKey | null) {
  const queryClient = useQueryClient()
  const query = useInfiniteQuery(eventsQuery(date, category))

  // Load the next day in the background so clicking it is instant.
  useEffect(() => {
    queryClient.prefetchInfiniteQuery(eventsQuery(getNextDay(date), category))
  }, [queryClient, date, category])

  const items = useMemo(() => query.data?.pages.flatMap((page) => page.items) ?? [], [query.data])
  // A failed "load more" keeps the events already loaded on screen.
  const status: EventsStatus = query.data ? 'ready' : query.isError ? 'error' : 'loading'

  return {
    items,
    total: query.data?.pages[0].total ?? 0,
    status,
    loadedFor: query.data ? `${date}|${category}` : '',
    loadingMore: query.isFetchingNextPage,
    hasMore: query.hasNextPage,
    loadMore: () => query.fetchNextPage(),
    retry: () => query.refetch(),
  }
}
