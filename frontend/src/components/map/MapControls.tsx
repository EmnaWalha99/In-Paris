import { TEXTS } from '../../texts'
import { Icon } from '../ui/Icon'

interface MapControlsProps {
  onZoomIn: () => void
  onZoomOut: () => void
  onRecenter: () => void
}

const BUTTON = 'flex h-8 w-8 items-center justify-center rounded-lg transition-colors hover:bg-surface-container-high'
const DIVIDER = 'h-px w-full bg-outline-variant/30'

export function MapControls({ onZoomIn, onZoomOut, onRecenter }: MapControlsProps) {
  return (
    <div className="absolute bottom-6 right-6 z-map-overlay flex flex-col gap-1.5 rounded-xl border border-outline-variant/20 bg-surface/90 p-1 shadow-md backdrop-blur-md">
      <button type="button" className={BUTTON} onClick={onZoomIn} title={TEXTS.map.zoomIn}>
        <Icon name="add" size={20} />
      </button>
      <div className={DIVIDER} />
      <button type="button" className={BUTTON} onClick={onZoomOut} title={TEXTS.map.zoomOut}>
        <Icon name="remove" size={20} />
      </button>
      <div className={DIVIDER} />
      <button type="button" className={`${BUTTON} text-secondary`} onClick={onRecenter} title={TEXTS.map.recenter}>
        <Icon name="my_location" />
      </button>
    </div>
  )
}
