import type { LatLngTuple } from 'leaflet'
import type { Event, Location } from '../types'

export type LocatedEvent = Event & { location: Location & { lat: number; lon: number } }

export const isLocated = (event: Event): event is LocatedEvent => event.location.lat !== null && event.location.lon !== null

export const toLatLng = (event: LocatedEvent): LatLngTuple => [event.location.lat, event.location.lon]

function formatArrondissement(address: string | null): string | null {
  const match = address?.match(/\b75(\d{3})\b/) // 75005 -> 5e, 75116 -> 16e
  if (!match) return null
  const code = Number(match[1])
  const number = code > 100 ? code - 100 : code
  return `Paris ${number}${number === 1 ? 'er' : 'e'}`
}

export const formatVenue = ({ name, address }: Location) => [name, formatArrondissement(address)].filter(Boolean).join(' · ')

export const formatFullAddress = ({ name, address }: Location) => [name, address].filter(Boolean).join(', ')

export const formatCoordinates = ({ lat, lon }: Location) => (lat !== null && lon !== null ? `${lat}, ${lon}` : null)
