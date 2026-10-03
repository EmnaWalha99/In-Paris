import type { Event } from '../../api'
import type { EventsStatus } from '../../hooks/useEvents'
import { formatEventCount, formatLongDate } from '../../utils/format'
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

export function EventList(props: EventListProps) {
  const { date, events, total, status, activeId, onActivate } = props

  return (
    <div className="flex h-full flex-col overflow-hidden bg-surface-container-lowest">
      <div className="shrink-0 bg-surface-container-low px-6 py-4">
        <h2 className="text-label-md uppercase tracking-widest text-primary">
          {status === 'ready' ? `${formatEventCount(total)} · ` : ''}
          {formatLongDate(date)}
        </h2>
        <p className="mt-0.5 text-body-sm text-on-surface-variant">Triés par horaire</p>
      </div>

      {status === 'loading' && <EventListSkeleton />}

      {status === 'error' && (
        <StatusMessage
          eyebrow="Connexion interrompue"
          title="Impossible de charger les événements"
          message="Le service est momentanément indisponible. Réessayez dans un instant."
          action={{ label: 'Réessayer', onClick: props.onRetry }}
        />
      )}

      {status === 'ready' && events.length === 0 && (
        <StatusMessage
          eyebrow="Gazette du silence"
          title="Aucun événement ce jour"
          message="La capitale s'accorde une respiration. Feuilletez les jours à venir ou changez de catégorie."
          action={props.onBackToToday && { label: "Revenir à aujourd'hui", onClick: props.onBackToToday }}
        />
      )}

      {status === 'ready' && events.length > 0 && (
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
          {props.hasMore && (
            <div className="flex flex-col items-center gap-2 pb-8 pt-4">
              <button
                type="button"
                onClick={props.onLoadMore}
                disabled={props.loadingMore}
                className="flex w-full items-center justify-center gap-2 rounded-lg bg-surface-container-high px-4 py-3 text-label-md uppercase text-primary transition-colors hover:bg-surface-container-highest disabled:opacity-60"
              >
                {props.loadingMore ? 'Chargement…' : `Explorer les ${total - events.length} autres sorties`}
                <Icon name="arrow_downward" className="text-[18px]" />
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
