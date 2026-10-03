import { useEffect, useRef, type CSSProperties } from 'react'
import type { Event } from '../../types'
import { CATEGORY_BY_KEY } from '../../categories'
import { TEXTS } from '../../texts'
import { formatDuration, formatSessionTime, isAllDay } from '../../utils/format'
import { formatVenue } from '../../utils/location'
import { CategoryTag } from './CategoryTag'

interface EventCardProps {
  event: Event
  isActive: boolean
  index: number // for the staggered fade-in
  onActivate: (id: string) => void
}

const STAGGER_MS = 30
const MAX_STAGGER_MS = 300

export function EventCard({ event, isActive, index, onActivate }: EventCardProps) {
  const ref = useRef<HTMLElement>(null)
  const session = event.sessions[0]
  const duration = formatDuration(session)
  const style = {
    '--cat': CATEGORY_BY_KEY[event.category].color,
    animationDelay: `${Math.min(index * STAGGER_MS, MAX_STAGGER_MS)}ms`,
  } as CSSProperties

  useEffect(() => {
    if (isActive) ref.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
  }, [isActive])

  return (
    <article
      ref={ref}
      onMouseEnter={() => onActivate(event.id)}
      onClick={() => onActivate(event.id)}
      style={style}
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
          <span className={`font-serif font-semibold tracking-tight ${isAllDay(session) ? 'text-body-md' : 'text-headline-sm'}`}>
            {formatSessionTime(session)}
          </span>
          {duration && <span className="mt-1 text-label-sm uppercase text-on-surface-variant">{duration}</span>}
        </div>

        <div className="min-w-0 flex-1 pr-1">
          <div className="mb-1 flex items-center gap-2">
            <CategoryTag category={event.category} />
            {event.is_free && (
              <span className="ml-auto rounded-full bg-surface-container-highest px-2 py-0.5 text-label-sm text-primary-strong">
                {TEXTS.free}
              </span>
            )}
          </div>
          <h3 className="line-clamp-1 font-serif text-headline-sm leading-snug transition-colors group-hover:text-secondary">
            {event.title}
          </h3>
          <p className="mt-0.5 line-clamp-1 text-body-sm text-on-surface-variant">{formatVenue(event.location)}</p>
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
