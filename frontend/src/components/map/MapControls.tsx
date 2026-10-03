import { Icon } from '../ui/Icon'

interface MapControlsProps {
  onZoomIn: () => void
  onZoomOut: () => void
  onRecenter: () => void
}

const BUTTON = 'flex h-8 w-8 items-center justify-center rounded-lg transition-colors hover:bg-surface-container-high'

export function MapControls({ onZoomIn, onZoomOut, onRecenter }: MapControlsProps) {
  return (
    <div className="absolute bottom-6 right-6 z-[1000] flex flex-col gap-1.5 rounded-xl border border-outline-variant/20 bg-surface/90 p-1 shadow-md backdrop-blur-md">
      <button type="button" className={BUTTON} onClick={onZoomIn} title="Agrandir">
        <Icon name="add" className="text-[20px]" />
      </button>
      <div className="h-px w-full bg-outline-variant/30" />
      <button type="button" className={BUTTON} onClick={onZoomOut} title="Réduire">
        <Icon name="remove" className="text-[20px]" />
      </button>
      <div className="h-px w-full bg-outline-variant/30" />
      <button type="button" className={`${BUTTON} text-primary`} onClick={onRecenter} title="Recentrer Paris">
        <Icon name="my_location" className="text-[18px]" />
      </button>
    </div>
  )
}
