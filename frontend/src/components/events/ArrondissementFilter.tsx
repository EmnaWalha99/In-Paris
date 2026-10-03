import { TEXTS } from '../../texts'
import { Icon } from '../ui/Icon'

interface ArrondissementFilterProps {
  selected: number[]
  onRemove: (arrondissement: number) => void
  onClear: () => void
}

export function ArrondissementFilter({ selected, onRemove, onClear }: ArrondissementFilterProps) {
  if (!selected.length) {
    return <p className="mt-2 hidden text-body-sm text-tertiary lg:block">{TEXTS.arrondissementHint}</p>
  }

  return (
    <div className="mt-2 flex flex-wrap items-center gap-1.5">
      {selected.map((arrondissement) => (
        <button
          key={arrondissement}
          type="button"
          onClick={() => onRemove(arrondissement)}
          className="flex items-center gap-1 rounded-full bg-primary px-2.5 py-0.5 text-label-sm uppercase text-on-primary transition-opacity hover:opacity-80"
        >
          {TEXTS.arrondissement(arrondissement)}
          <Icon name="close" size={12} />
        </button>
      ))}
      <button type="button" onClick={onClear} className="text-label-sm uppercase text-secondary hover:underline">
        {TEXTS.clearArrondissements}
      </button>
    </div>
  )
}
