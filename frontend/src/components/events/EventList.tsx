import type { Event } from '../../types'
import type { EventsStatus } from '../../hooks/useEvents'
import { TEXTS } from '../../texts'
import { formatLongDate } from '../../utils/format'
import { Icon } from '../ui/Icon'
import { StatusMessage } from '../ui/StatusMessage'
import { EventCard } from './EventCard'
import { EventListSkeleton } from './EventListSkeleton'

interface EventListProps {
  date: string
  events: Event[]
  total: number
  status: EventsStatus
  hasMore: boolean
  loadingMore: boolean
  activeId: string | null
  onActivate: (id: string) => void
  onLoadMore: () => void
  onRetry: () => void
  onBackToToday?: () => void
}

export function EventList({ date, events, total, status, activeId, onActivate, ...actions }: EventListProps) {
  const isEmpty = status === 'ready' && events.length === 0

  return (
    <div className="flex h-full flex-col overflow-hidden bg-surface-container-lowest">
      <div className="shrink-0 bg-surface-container-low px-6 py-4">
        <h2 className="text-label-md uppercase tracking-widest text-primary">
          {status === 'ready' && `${TEXTS.eventCount(total)} · `}
          {formatLongDate(date)}
        </h2>
        <p className="mt-0.5 text-body-sm text-on-surface-variant">{TEXTS.sortedByTime}</p>
      </div>

      {status === 'loading' && <EventListSkeleton />}

      {status === 'error' && (
        <StatusMessage {...TEXTS.error} action={{ label: TEXTS.error.action, onClick: actions.onRetry }} />
      )}

      {isEmpty && (
        <StatusMessage
          {...TEXTS.empty}
          action={actions.onBackToToday && { label: TEXTS.empty.action, onClick: actions.onBackToToday }}
        />
      )}

      {status === 'ready' && !isEmpty && (
        <div className="flex-1 space-y-2.5 overflow-y-auto scroll-smooth px-4 py-3">
          {events.map((event, index) => (
            <EventCard
              key={event.id}
              event={event}
              index={index}
              isActive={event.id === activeId}
              onActivate={onActivate}
            />
          ))}
          {actions.hasMore && (
            <LoadMoreButton remaining={total - events.length} loading={actions.loadingMore} onClick={actions.onLoadMore} />
          )}
        </div>
      )}
    </div>
  )
}

function LoadMoreButton({ remaining, loading, onClick }: { remaining: number; loading: boolean; onClick: () => void }) {
  return (
    <div className="pb-8 pt-4">
      <button
        type="button"
        onClick={onClick}
        disabled={loading}
        className="flex w-full items-center justify-center gap-2 rounded-lg bg-surface-container-high px-4 py-3 text-label-md uppercase text-primary transition-colors hover:bg-surface-container-highest disabled:opacity-60"
      >
        {loading ? TEXTS.loadingMore : TEXTS.loadMore(remaining)}
        <Icon name="arrow_downward" />
      </button>
    </div>
  )
}
