import { addDays, differenceInMinutes, format, isThisYear, parseISO } from 'date-fns'
import { fr } from 'date-fns/locale'
import type { Event, Session } from '../api'

export interface DayOption {
  value: string // YYYY-MM-DD
  label: string
}

const MAX_DURATION_MINUTES = 12 * 60

const capitalize = (text: string) => text.charAt(0).toUpperCase() + text.slice(1)
const formatFr = (date: Date, pattern: string) => capitalize(format(date, pattern, { locale: fr }).replaceAll('.', ''))

// The API writes Paris wall-clock times: dropping the offset keeps them as-is instead of converting time zones.
const parseWallClock = (iso: string) => parseISO(iso.slice(0, 19))

export function getUpcomingDays(count: number): DayOption[] {
  return Array.from({ length: count }, (_, i) => {
    const date = addDays(new Date(), i)
    return { value: format(date, 'yyyy-MM-dd'), label: i === 0 ? "Aujourd'hui" : formatFr(date, 'EEE d') }
  })
}

function formatDate(isoDate: string, pattern: string): string {
  const date = parseISO(isoDate)
  return formatFr(date, isThisYear(date) ? pattern : `${pattern} yyyy`)
}

export const formatLongDate = (isoDate: string) => formatDate(isoDate, 'EEEE d MMMM') // Samedi 3 octobre
export const formatShortDate = (isoDate: string) => formatDate(isoDate, 'EEE d MMM') // Dim 20 sept

export const formatTime = (iso: string) => format(parseWallClock(iso), 'HH:mm')

export const isAllDay = (session: Session) => formatTime(session.start) === '00:00'

export function formatDuration(session: Session): string | null {
  if (!session.end) return null
  const minutes = differenceInMinutes(parseWallClock(session.end), parseWallClock(session.start))
  if (minutes <= 0 || minutes >= MAX_DURATION_MINUTES) return null
  const hours = Math.floor(minutes / 60)
  const rest = minutes % 60
  if (!hours) return `${rest} min`
  return rest ? `${hours}h${String(rest).padStart(2, '0')}` : `${hours}h`
}

export function formatArrondissement(address: string | null): string | null {
  const match = address?.match(/\b75(\d{3})\b/)
  if (!match) return null
  const code = Number(match[1])
  const number = code > 100 ? code - 100 : code
  return `Paris ${number}${number === 1 ? 'er' : 'e'}`
}

export function formatVenue(event: Event): string {
  return [event.location.name, formatArrondissement(event.location.address)].filter(Boolean).join(' · ')
}

export function formatPrice(event: Event): string {
  if (event.is_free) return 'Gratuit'
  if (event.price_type === 'gratuit sous condition') return 'Gratuit sous condition'
  return event.price_type === 'payant' ? 'Payant' : 'Tarif non communiqué'
}

export function formatEventCount(total: number): string {
  return `${total} événement${total > 1 ? 's' : ''}`
}
