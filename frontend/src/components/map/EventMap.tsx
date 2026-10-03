import { latLngBounds, point, type Map as LeafletMap } from 'leaflet'
import { useEffect, useRef, useState, type ReactNode } from 'react'
import { MapContainer, TileLayer } from 'react-leaflet'
import type { Event } from '../../types'
import { MAP } from '../../config'
import { TEXTS } from '../../texts'
import { isLocated, toLatLng, type LocatedEvent } from '../../utils/location'
import { EventMarker } from './EventMarker'
import { MapControls } from './MapControls'
import { MapPopupCard } from './MapPopupCard'

interface EventMapProps {
  events: Event[]
  activeId: string | null
  onActivate: (id: string) => void
  onClose: () => void
  fitKey: string // changes with the day/category: the map then re-fits on the new events
  visible: boolean
  children?: ReactNode // extra map layers, e.g. the arrondissements
}

function fitToEvents(map: LeafletMap, events: LocatedEvent[]) {
  const bounds = latLngBounds(events.map(toLatLng))
  const padding = point(MAP.fitPadding, MAP.fitPadding)
  // A few events in the suburbs would zoom out too far: keep Paris readable instead.
  if (map.getBoundsZoom(bounds, false, padding.multiplyBy(2)) < MAP.zoom) map.setView(MAP.center, MAP.zoom)
  else map.fitBounds(bounds, { padding, maxZoom: MAP.maxZoom - 1 })
}

export function EventMap({ events, activeId, onActivate, onClose, fitKey, visible, children }: EventMapProps) {
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
    fitToEvents(map, located)
  }, [map, located, fitKey])

  return (
    <div className="relative h-full w-full overflow-hidden rounded-2xl bg-surface-container shadow-inner">
      <MapContainer ref={setMap} center={MAP.center} zoom={MAP.zoom} zoomControl={false} className="h-full w-full">
        <TileLayer url={MAP.baseTilesUrl} attribution={MAP.attribution} maxZoom={MAP.maxZoom} />
        <TileLayer url={MAP.labelTilesUrl} maxZoom={MAP.maxZoom} />
        {children}
        {located.map((event) => {
          const isActive = event.id === activeId
          return (
            <EventMarker
              key={event.id}
              event={event}
              isActive={isActive}
              onClick={() => (isActive ? onClose() : onActivate(event.id))}
            />
          )
        })}
      </MapContainer>

      <div className="absolute left-5 top-5 z-map-overlay flex items-center gap-2 rounded-full bg-surface/90 px-3.5 py-1.5 shadow-sm backdrop-blur-md">
        <span className="h-2 w-2 animate-pulse rounded-full bg-primary" />
        <span className="text-label-sm uppercase">{TEXTS.map.badge(located.length)}</span>
      </div>

      {activeEvent && <MapPopupCard event={activeEvent} onClose={onClose} />}

      <MapControls
        onZoomIn={() => map?.zoomIn()}
        onZoomOut={() => map?.zoomOut()}
        onRecenter={() => map?.setView(MAP.center, MAP.zoom)}
      />
    </div>
  )
}
