import { useQuery } from '@tanstack/react-query'
import type { FeatureCollection, Polygon } from 'geojson'
import { GeoJSON, Pane } from 'react-leaflet'
import { ARRONDISSEMENTS_URL, MAP } from '../../config'
import { TEXTS } from '../../texts'

type ArrondissementShapes = FeatureCollection<Polygon, { arrondissement: number }>

interface ArrondissementLayerProps {
  selected: number[]
  onToggle: (arrondissement: number) => void
}

async function fetchShapes(): Promise<ArrondissementShapes> {
  const response = await fetch(ARRONDISSEMENTS_URL)
  if (!response.ok) throw new Error(`Could not load arrondissements (${response.status})`)
  return response.json()
}

export function ArrondissementLayer({ selected, onToggle }: ArrondissementLayerProps) {
  // The shapes never change: loaded once and kept for the whole session.
  const { data: shapes } = useQuery({ queryKey: ['arrondissements'], queryFn: fetchShapes, staleTime: Infinity })
  if (!shapes) return null

  return (
    <Pane name="arrondissements" style={{ zIndex: MAP.arrondissementsPaneZIndex }}>
      <GeoJSON
        // Leaflet doesn't restyle GeoJSON on prop changes: re-create the layer when the selection changes.
        key={selected.join(',')}
        data={shapes}
        style={(feature) => ({
          className: `arrondissement ${feature && selected.includes(feature.properties.arrondissement) ? 'is-selected' : ''}`,
        })}
        onEachFeature={(feature, layer) => {
          const { arrondissement } = feature.properties
          layer.bindTooltip(TEXTS.arrondissement(arrondissement), { sticky: true, className: 'event-tooltip' })
          layer.on('click', () => onToggle(arrondissement))
        }}
      />
    </Pane>
  )
}
