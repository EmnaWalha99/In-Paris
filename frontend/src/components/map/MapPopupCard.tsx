import type { MouseEvent } from 'react'
import type { Event } from '../../types'
import { TEXTS } from '../../texts'
import { formatPrice, formatSessionTime } from '../../utils/format'
import { formatCoordinates, formatFullAddress, formatVenue } from '../../utils/location'
import { CategoryTag } from '../events/CategoryTag'
import { CopyButton } from '../ui/CopyButton'
import { Icon } from '../ui/Icon'

interface MapPopupCardProps {
  event: Event
  onClose: () => void
}

export function MapPopupCard({ event, onClose }: MapPopupCardProps) {
  const { address } = event.location
  const coordinates = formatCoordinates(event.location)

  // Clicking the card closes it, except on its buttons and links.
  const closeOnCardClick = (e: MouseEvent) => {
    if (!(e.target as HTMLElement).closest('button, a')) onClose()
  }

  return (
    <div
      onClick={closeOnCardClick}
      className="absolute bottom-6 left-6 right-20 z-map-overlay max-w-80 animate-fade-in-up cursor-pointer rounded-xl border border-outline-variant/30 bg-surface/95 p-4 shadow-xl backdrop-blur-md sm:right-auto sm:w-80"
    >
      <button
        type="button"
        onClick={onClose}
        aria-label={TEXTS.map.close}
        className="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full border border-outline-variant/40 bg-surface text-on-surface-variant shadow-sm transition-colors hover:text-on-surface"
      >
        <Icon name="close" size={14} />
      </button>

      <div className="mb-2 flex items-center justify-between">
        <CategoryTag category={event.category} />
        <span className="font-serif text-headline-sm font-semibold">{formatSessionTime(event.sessions[0])}</span>
      </div>
      <h4 className="mb-1 line-clamp-1 font-serif text-headline-sm leading-snug">{event.title}</h4>
      <p className="flex items-center gap-1 text-body-sm text-on-surface-variant">
        <Icon name="location_on" size={16} className="text-primary-strong" />
        <span className="line-clamp-1">{formatVenue(event.location)}</span>
      </p>
      {address && <p className="ml-5 line-clamp-2 text-body-sm text-tertiary">{address}</p>}

      <div className="mb-3 mt-2.5 flex flex-wrap gap-1.5">
        {address && <CopyButton label={TEXTS.map.copyAddress} value={formatFullAddress(event.location)} />}
        {coordinates && <CopyButton label={TEXTS.map.copyCoordinates} value={coordinates} />}
      </div>

      <div className="flex items-center justify-between border-t border-outline-variant/30 pt-2">
        <span className="text-label-sm text-tertiary">{formatPrice(event)}</span>
        {event.url && (
          <a
            href={event.url}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1 text-label-sm uppercase text-secondary hover:underline"
          >
            {TEXTS.map.details}
            <Icon name="arrow_forward" size={14} />
          </a>
        )}
      </div>
    </div>
  )
}
