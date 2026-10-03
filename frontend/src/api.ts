import { API_URL } from './config'
import type { EventFilters, EventList } from './types'

export async function fetchEvents({ date, category, limit, offset = 0 }: EventFilters): Promise<EventList> {
  const params = new URLSearchParams({ date, limit: String(limit), offset: String(offset) })
  if (category) params.set('category', category)

  const response = await fetch(`${API_URL}/events?${params}`)
  if (!response.ok) throw new Error(`API error ${response.status}`)
  return response.json()
}
