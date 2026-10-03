import { latLngBounds, point, type Map as LeafletMap } from 'leaflet'
import { useEffect, useRef, useState } from 'react'
import { CircleMarker, MapContainer, TileLayer, Tooltip } from 'react-leaflet'
import type { Event } from '../../api'
import { CATEGORY_BY_KEY } from '../../categories'
import { formatTime, isAllDay } from '../../utils/format'
import { MapControls } from './MapControls'
import { MapPopupCard } from './MapPopupCard'

interface EventMapProps {
  events: Event[]
  activeId: string | null
  onActivate: (id: string) => void
  onClose: () => void
  // Changes when the day or category changes: the map then re-fits on the new events.
  fitKey: string
  visible: boolean
}

const PARIS_CENTER: [number, number] = [48.8566, 2.3522]
const DEFAULT_ZOOM = 13
const MARKER_RADIUS = { default: 8, active: 12 }
const TILES_URL = 'https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Base/MapServer/tile/{z}/{y}/{x}'
const LABELS_URL =
  'https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Reference/MapServer/tile/{z}/{y}/{x}'
const TILES_ATTRIBUTION = 'Tiles &copy; Esri &mdash; Esri, HERE, Garmin, &copy; OpenStreetMap contributors'
const TILES_MAX_ZOOM = 16
const FIT_PADDING = 48

type LocatedEvent = Event & { location: { lat: number; lon: number } }
const isLocated = (event: Event): event is LocatedEvent => event.location.lat !== null && event.location.lon !== null

export function EventMap({ events, activeId, onActivate, onClose, fitKey, visible }: EventMapProps) {
  const [map, setMap] = useState<LeafletMap | null>(null)
  const fittedKey = useRef<string | null>(null)
  const located = events.filter(isLocated)
  const activeEvent = events.find((event) => event.id === activeId)

  useEffect(() => {
    if (map && visible) map.invalidateSize()
  }, [map, visible])

  useEffect(() => {
    if (!map || !located.length || fittedKey.current === fitKey) return
    fittedKey.current = fitKey
    const bounds = latLngBounds(located.map((event) => [event.location.lat, event.location.lon]))
    // A few events in the suburbs would zoom out too far: keep Paris readable instead.
    if (map.getBoundsZoom(bounds, false, point(FIT_PADDING * 2, FIT_PADDING * 2)) < DEFAULT_ZOOM) map.setView(PARIS_CENTER, DEFAULT_ZOOM)
    else map.fitBounds(bounds, { padding: [FIT_PADDING, FIT_PADDING], maxZoom: TILES_MAX_ZOOM - 1 })
  }, [map, located, fitKey])

  return (
    <div className="relative h-full w-full overflow-hidden rounded-2xl bg-surface-container shadow-inner">
      <MapContainer ref={setMap} center={PARIS_CENTER} zoom={DEFAULT_ZOOM} zoomControl={false} className="h-full w-full">
        <TileLayer url={TILES_URL} attribution={TILES_ATTRIBUTION} maxZoom={TILES_MAX_ZOOM} />
        <TileLayer url={LABELS_URL} maxZoom={TILES_MAX_ZOOM} />
        {located.map((event) => {
          const isActive = event.id === activeId
          return (
            <CircleMarker
              key={event.id}
              center={[event.location.lat, event.location.lon]}
              radius={isActive ? MARKER_RADIUS.active : MARKER_RADIUS.default}
              pathOptions={{
                className: 'event-marker',
                color: '#f8f7f5',
                weight: 2.5,
                fillColor: CATEGORY_BY_KEY[event.category].color,
                fillOpacity: 1,
              }}
              eventHandlers={{ click: () => (isActive ? onClose() : onActivate(event.id)) }}
            >
              <Tooltip direction="top" offset={[0, -10]} className="event-tooltip">
                <span className="time">{isAllDay(event.sessions[0]) ? 'Journée' : formatTime(event.sessions[0].start)}</span>
                {event.title}
              </Tooltip>
            </CircleMarker>
          )
        })}
      </MapContainer>

      <div className="absolute left-5 top-5 z-[1000] flex items-center gap-2 rounded-full bg-surface/90 px-3.5 py-1.5 shadow-sm backdrop-blur-md">
        <span className="h-2 w-2 animate-pulse rounded-full bg-primary" />
        <span className="text-label-sm uppercase">Carte interactive · {located.length} lieux</span>
      </div>

      {activeEvent && <MapPopupCard event={activeEvent} onClose={onClose} />}

      <MapControls
        onZoomIn={() => map?.zoomIn()}
        onZoomOut={() => map?.zoomOut()}
        onRecenter={() => map?.setView(PARIS_CENTER, DEFAULT_ZOOM)}
      />
    </div>
  )
}
