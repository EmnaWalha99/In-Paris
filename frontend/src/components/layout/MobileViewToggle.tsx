import { TEXTS } from '../../texts'
import { Icon } from '../ui/Icon'

export type MobileView = 'list' | 'map'

interface MobileViewToggleProps {
  view: MobileView
  onChange: (view: MobileView) => void
}

export function MobileViewToggle({ view, onChange }: MobileViewToggleProps) {
  const showsList = view === 'list'
  return (
    <button
      type="button"
      onClick={() => onChange(showsList ? 'map' : 'list')}
      className="absolute bottom-5 left-1/2 z-above-map flex -translate-x-1/2 items-center gap-2 rounded-full bg-secondary px-5 py-2.5 text-label-md uppercase text-on-secondary shadow-lg lg:hidden"
    >
      <Icon name={showsList ? 'map' : 'list'} />
      {showsList ? TEXTS.map.showMap : TEXTS.map.showList}
    </button>
  )
}
