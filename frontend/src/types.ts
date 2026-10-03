// Mirrors backend/app/schemas/event.py
export type CategoryKey = 'concert' | 'theatre' | 'danse' | 'expo' | 'sport' | 'enfants' | 'atelier' | 'autre'

export interface Session {
  start: string // ISO datetime
  end: string | null
}

export interface Location {
  name: string | null
  address: string | null
  arrondissement: number | null // 1-20, null outside Paris
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
  arrondissements: number[]
  limit: number
  offset?: number
}