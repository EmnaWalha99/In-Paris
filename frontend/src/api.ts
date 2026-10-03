import { API_URL } from './config'

export type CategoryKey = 'concert' | 'theatre' | 'danse' | 'expo' | 'sport' | 'enfants' | 'atelier' | 'autre'

export interface Session {
  start: string // ISO datetime
  end: string | null
}

export interface Location {
  name: string | null
  address: string | null
  lat: number | null
  lon: number | null
}

export interface Event {
  id: string
  title: string
  description: string | null
  category: CategoryKey
  tags: string[]
  sessions: Session[]
  location: Location
  price_type: string | null
  price_detail: string | null
  is_free: boolean
  image_url: string | null
  url: string | null
  ticket_url: string | null
}

export interface EventList {
  total: number
  items: Event[]
}

export interface EventFilters {
  date: string // YYYY-MM-DD
  category: CategoryKey | null
  limit: number
  offset?: number
}

export async function fetchEvents({ date, category, limit, offset = 0 }: EventFilters): Promise<EventList> {
  const params = new URLSearchParams({ date, limit: String(limit), offset: String(offset) })
  if (category) params.set('category', category)

  const response = await fetch(`${API_URL}/events?${params}`)
  if (!response.ok) throw new Error(`API error ${response.status}`)
  return response.json()
}
