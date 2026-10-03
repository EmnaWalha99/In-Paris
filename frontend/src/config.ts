import type { LatLngTuple } from 'leaflet'

export const API_URL = import.meta.env.VITE_API_URL || '/api'

export const PAGE_SIZE = 30
export const DAYS_SHOWN = 7

export const DATA_SOURCE_URL = 'https://opendata.paris.fr/explore/dataset/que-faire-a-paris-/'

const ESRI_TILES = 'https://server.arcgisonline.com/ArcGIS/rest/services/Canvas'

export const MAP = {
  center: [48.8566, 2.3522] as LatLngTuple,
  zoom: 13,
  maxZoom: 16,
  fitPadding: 48,
  markerRadius: { default: 8, active: 12 },
  baseTilesUrl: `${ESRI_TILES}/World_Light_Gray_Base/MapServer/tile/{z}/{y}/{x}`,
  labelTilesUrl: `${ESRI_TILES}/World_Light_Gray_Reference/MapServer/tile/{z}/{y}/{x}`,
  attribution: 'Tiles &copy; Esri &mdash; Esri, HERE, Garmin, &copy; OpenStreetMap contributors',
}
