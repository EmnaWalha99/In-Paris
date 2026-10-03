import { API_URL } from './config'
import type { EventFilters, EventList } from './types'

export async function fetchEvents(
  { date, category, arrondissements, limit, offset = 0 }: EventFilters,
  signal?: AbortSignal,
): Promise<EventList> {
  const params = new URLSearchParams({ date, limit: String(limit), offset: String(offset) })
  if (category) params.set('category', category)
  for (const arrondissement of arrondissements) params.append('arrondissement', String(arrondissement))

  const response = await fetch(`${API_URL}/events?${params}`, { signal })
  if (!response.ok) throw new Error(`API error ${response.status}`)
  return response.json()
}
