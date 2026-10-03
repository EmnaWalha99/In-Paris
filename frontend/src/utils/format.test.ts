import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import type { Event } from '../types'
import {
  formatDuration,
  formatLongDate,
  formatPrice,
  formatSessionTime,
  formatShortDate,
  getNextDay,
  getUpcomingDays,
  isAllDay,
} from './format'

const session = (start: string, end: string | null = null) => ({ start, end })

describe('dates', () => {
  beforeEach(() => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date('2026-10-03T10:00:00'))
  })
  afterEach(() => vi.useRealTimers())

  it('lists the upcoming days starting today', () => {
    expect(getUpcomingDays(3)).toEqual([
      { value: '2026-10-03', label: "Aujourd'hui" },
      { value: '2026-10-04', label: 'Dim 4' },
      { value: '2026-10-05', label: 'Lun 5' },
    ])
  })

  it('formats dates in French, adding the year only when it differs', () => {
    expect(formatLongDate('2026-10-03')).toBe('Samedi 3 octobre')
    expect(formatShortDate('2026-09-20')).toBe('Dim 20 sept')
    expect(formatLongDate('2025-06-01')).toBe('Dimanche 1 juin 2025')
  })

  it('gets the next day across a month boundary', () => {
    expect(getNextDay('2026-10-31')).toBe('2026-11-01')
  })
})

describe('session time', () => {
  it('keeps the Paris wall-clock time written by the API', () => {
    expect(formatSessionTime(session('2026-11-08T20:30:00+02:00'))).toBe('20:30')
  })

  it('shows "Journée" for all-day or missing sessions', () => {
    expect(isAllDay(session('2026-10-05T00:00:00+02:00'))).toBe(true)
    expect(formatSessionTime(session('2026-10-05T00:00:00+02:00'))).toBe('Journée')
    expect(formatSessionTime(undefined)).toBe('Journée')
  })
})

describe('formatDuration', () => {
  it.each([
    ['2026-10-05T21:30:00+02:00', '1h30'],
    ['2026-10-05T22:00:00+02:00', '2h'],
    ['2026-10-05T20:45:00+02:00', '45 min'],
  ])('formats a session ending at %s as %s', (end, expected) => {
    expect(formatDuration(session('2026-10-05T20:00:00+02:00', end))).toBe(expected)
  })

  it('returns null when the duration is unknown or not meaningful', () => {
    expect(formatDuration(session('2026-10-05T20:00:00+02:00'))).toBeNull()
    expect(formatDuration(session('2026-10-05T00:00:00+02:00', '2026-10-05T23:59:00+02:00'))).toBeNull()
    expect(formatDuration(session('2026-10-05T08:00:00+02:00', '2026-10-05T21:00:00+02:00'))).toBeNull()
  })
})

describe('formatPrice', () => {
  const event = (overrides: Partial<Event>) => ({ is_free: false, price_type: null, ...overrides }) as Event

  it.each([
    [{ is_free: true, price_type: 'gratuit' }, 'Gratuit'],
    [{ price_type: 'gratuit sous condition' }, 'Gratuit sous condition'],
    [{ price_type: 'payant' }, 'Payant'],
    [{}, 'Tarif non communiqué'],
  ])('formats %o as %s', (overrides, expected) => {
    expect(formatPrice(event(overrides))).toBe(expected)
  })
})
