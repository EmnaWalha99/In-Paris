const API_URL = import.meta.env.VITE_API_URL || '/api'

export type CategoryKey = 'concert' | 'theatre' | 'danse' | 'expo' | 'sport' | 'enfants' | 'atelier' | 'autre'

export interface Session {
  start: string // ISO datetime
  end: string | null
}

export interface Event {
  id: string
  title: string
  description: string | null
  category: CategoryKey
  tags: string[]
  sessions: Session[]
  location: { name: string | null; address: string | null; lat: number | null; lon: number | null }
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
  date?: string // YYYY-MM-DD, defaults to today on the backend
  category?: CategoryKey
  limit?: number
  offset?: number
}

async function get<T>(path: string): Promise<T> {
  const response = await fetch(`${API_URL}${path}`)
  if (!response.ok) throw new Error(`API error ${response.status} on ${path}`)
  return response.json()
}

export function fetchEvents(filters: EventFilters = {}): Promise<EventList> {
  const params = new URLSearchParams()
  for (const [key, value] of Object.entries(filters)) {
    if (value !== undefined && value !== '') params.set(key, String(value))
  }
  return get(`/events?${params}`)
}

export function fetchEvent(id: string): Promise<Event> {
  return get(`/events/${encodeURIComponent(id)}`)
}
