import { CircleMarker, Tooltip } from 'react-leaflet'
import { CATEGORY_BY_KEY } from '../../categories'
import { MAP } from '../../config'
import { formatSessionTime } from '../../utils/format'
import { toLatLng, type LocatedEvent } from '../../utils/location'

interface EventMarkerProps {
  event: LocatedEvent
  isActive: boolean
  onClick: () => void
}

const TOOLTIP_OFFSET: [number, number] = [0, -10]

export function EventMarker({ event, isActive, onClick }: EventMarkerProps) {
  return (
    <CircleMarker
      center={toLatLng(event)}
      radius={isActive ? MAP.markerRadius.active : MAP.markerRadius.default}
      pathOptions={{ className: 'event-marker', fillColor: CATEGORY_BY_KEY[event.category].color, fillOpacity: 1 }}
      eventHandlers={{ click: onClick }}
    >
      <Tooltip direction="top" offset={TOOLTIP_OFFSET} className="event-tooltip">
        <span className="time">{formatSessionTime(event.sessions[0])}</span>
        {event.title}
      </Tooltip>
    </CircleMarker>
  )
}
