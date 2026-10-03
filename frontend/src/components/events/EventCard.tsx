import { useEffect, useRef, type CSSProperties } from 'react'
import type { Event } from '../../api'
import { CATEGORY_BY_KEY } from '../../categories'
import { formatDuration, formatTime, formatVenue, isAllDay } from '../../utils/format'

interface EventCardProps {
  event: Event
  isActive: boolean
  index: number
  onActivate: (id: string) => void
}

const MAX_STAGGER_MS = 300

export function EventCard({ event, isActive, index, onActivate }: EventCardProps) {
  const ref = useRef<HTMLElement>(null)
  const category = CATEGORY_BY_KEY[event.category]
  const session = event.sessions[0]
  const allDay = !session || isAllDay(session)

  useEffect(() => {
    if (isActive) ref.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
  }, [isActive])

  return (
    <article
      ref={ref}
      onMouseEnter={() => onActivate(event.id)}
      onClick={() => onActivate(event.id)}
      style={{ '--cat': category.color, animationDelay: `${Math.min(index * 30, MAX_STAGGER_MS)}ms` } as CSSProperties}
      className={`group relative animate-fade-in-up cursor-pointer rounded-xl p-4 transition-all duration-200 hover:bg-surface-container-high/60 ${
        isActive ? 'bg-surface-container-high' : 'bg-surface'
      }`}
    >
      <div
        className={`absolute inset-y-3 left-0 w-1 rounded-r-full transition-all group-hover:bg-(--cat) ${
          isActive ? 'bg-(--cat)' : 'bg-transparent'
        }`}
      />
      <div className="flex items-start gap-4">
        <div className="flex w-16 shrink-0 flex-col items-start">
          <span className={`font-serif font-semibold tracking-tight ${allDay ? 'text-body-md' : 'text-headline-sm'}`}>
            {allDay ? 'Journée' : formatTime(session.start)}
          </span>
          {session && !allDay && formatDuration(session) && (
            <span className="mt-1 text-label-sm uppercase text-on-surface-variant">{formatDuration(session)}</span>
          )}
        </div>

        <div className="min-w-0 flex-1 pr-1">
          <div className="mb-1 flex items-center gap-2">
            <span className="inline-block h-2 w-2 rounded-full bg-(--cat)" />
            <span className="text-label-sm uppercase text-(--cat)">{category.label}</span>
            {event.is_free && (
              <span className="ml-auto rounded-full bg-surface-container-highest px-2 py-0.5 text-label-sm text-primary">
                Gratuit
              </span>
            )}
          </div>
          <h3 className="line-clamp-1 font-serif text-headline-sm leading-snug transition-colors group-hover:text-primary">
            {event.title}
          </h3>
          <p className="mt-0.5 line-clamp-1 text-body-sm text-on-surface-variant">{formatVenue(event)}</p>
          {event.description && <p className="mt-2 line-clamp-2 text-body-sm text-tertiary">{event.description}</p>}
        </div>

        <div className="hidden h-20 w-20 shrink-0 overflow-hidden rounded-lg bg-surface-container-high shadow-sm sm:block">
          {event.image_url && (
            <img
              src={event.image_url}
              alt=""
              loading="lazy"
              className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
          )}
        </div>
      </div>
    </article>
  )
}
