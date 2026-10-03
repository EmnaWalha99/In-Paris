import type { Event } from '../../api'
import { CATEGORY_BY_KEY } from '../../categories'
import { formatPrice, formatTime, formatVenue, isAllDay } from '../../utils/format'
import { CopyButton } from '../ui/CopyButton'
import { Icon } from '../ui/Icon'

interface MapPopupCardProps {
  event: Event
  onClose: () => void
}

export function MapPopupCard({ event, onClose }: MapPopupCardProps) {
  const category = CATEGORY_BY_KEY[event.category]
  const session = event.sessions[0]
  const { name, address, lat, lon } = event.location

  return (
    <div
      // Clicking the card closes it, except on its buttons and links.
      onClick={(e) => !(e.target as HTMLElement).closest('button, a') && onClose()}
      className="absolute bottom-6 left-6 right-20 z-[1000] max-w-80 animate-fade-in-up cursor-pointer rounded-xl border border-outline-variant/30 bg-surface/95 p-4 shadow-xl backdrop-blur-md sm:right-auto sm:w-80"
    >
      <button
        type="button"
        onClick={onClose}
        aria-label="Fermer"
        className="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full border border-outline-variant/40 bg-surface text-on-surface-variant shadow-sm transition-colors hover:text-on-surface"
      >
        <Icon name="close" className="text-[14px]" />
      </button>
      <div className="mb-2 flex items-center justify-between">
        <span className="flex items-center gap-1.5 text-label-sm uppercase" style={{ color: category.color }}>
          <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: category.color }} />
          {category.label}
        </span>
        <span className="font-serif text-headline-sm font-semibold">
          {!session || isAllDay(session) ? 'Journée' : formatTime(session.start)}
        </span>
      </div>
      <h4 className="mb-1 line-clamp-1 font-serif text-headline-sm leading-snug">{event.title}</h4>
      <p className="flex items-center gap-1 text-body-sm text-on-surface-variant">
        <Icon name="location_on" className="text-[16px] text-primary" />
        <span className="line-clamp-1">{formatVenue(event)}</span>
      </p>
      {address && <p className="ml-5 line-clamp-2 text-body-sm text-tertiary">{address}</p>}
      <div className="mb-3 mt-2.5 flex flex-wrap gap-1.5">
        {address && <CopyButton label="Copier l'adresse" value={[name, address].filter(Boolean).join(', ')} />}
        {lat !== null && lon !== null && <CopyButton label="Copier GPS" value={`${lat}, ${lon}`} />}
      </div>
      <div className="flex items-center justify-between border-t border-outline-variant/30 pt-2">
        <span className="text-label-sm text-tertiary">{formatPrice(event)}</span>
        {event.url && (
          <a
            href={event.url}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1 text-label-sm uppercase text-primary hover:underline"
          >
            Détails
            <Icon name="arrow_forward" className="text-[14px]" />
          </a>
        )}
      </div>
    </div>
  )
}
