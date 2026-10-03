import type { LatLngTuple } from 'leaflet'
import { TEXTS } from '../texts'
import type { Event, Location } from '../types'

export type LocatedEvent = Event & { location: Location & { lat: number; lon: number } }

export const isLocated = (event: Event): event is LocatedEvent => event.location.lat !== null && event.location.lon !== null

export const toLatLng = (event: LocatedEvent): LatLngTuple => [event.location.lat, event.location.lon]

export const formatVenue = ({ name, arrondissement }: Location) =>
  [name, arrondissement && TEXTS.arrondissement(arrondissement)].filter(Boolean).join(' · ')

export const formatFullAddress = ({ name, address }: Location) => [name, address].filter(Boolean).join(', ')

export const formatCoordinates = ({ lat, lon }: Location) => (lat !== null && lon !== null ? `${lat}, ${lon}` : null)
