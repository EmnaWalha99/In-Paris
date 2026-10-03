import { describe, expect, it } from 'vitest'
import type { Event, Location } from '../types'
import { formatCoordinates, formatFullAddress, formatVenue, isLocated, toLatLng } from './location'

const location = (overrides: Partial<Location> = {}): Location => ({
  name: 'Le Son de la Terre',
  address: '2 Port de Montebello, 75005 Paris 05',
  arrondissement: 5,
  lat: 48.851503,
  lon: 2.351091,
  ...overrides,
})

describe('formatVenue', () => {
  it('joins the venue name and the arrondissement', () => {
    expect(formatVenue(location())).toBe('Le Son de la Terre · Paris 5e')
  })

  it('uses "er" for the 1st arrondissement', () => {
    expect(formatVenue(location({ arrondissement: 1 }))).toBe('Le Son de la Terre · Paris 1er')
  })

  it('skips missing parts', () => {
    expect(formatVenue(location({ arrondissement: null }))).toBe('Le Son de la Terre')
    expect(formatVenue(location({ name: null }))).toBe('Paris 5e')
  })
})

describe('copy helpers', () => {
  it('formats the full address with the venue name', () => {
    expect(formatFullAddress(location())).toBe('Le Son de la Terre, 2 Port de Montebello, 75005 Paris 05')
  })

  it('formats coordinates, or null when the position is unknown', () => {
    expect(formatCoordinates(location())).toBe('48.851503, 2.351091')
    expect(formatCoordinates(location({ lat: null }))).toBeNull()
  })
})

describe('isLocated', () => {
  const event = (loc: Location) => ({ location: loc }) as Event

  it('keeps only events with coordinates, ready for the map', () => {
    const located = event(location())
    expect(isLocated(located)).toBe(true)
    expect(isLocated(event(location({ lon: null })))).toBe(false)
    if (isLocated(located)) expect(toLatLng(located)).toEqual([48.851503, 2.351091])
  })
})
