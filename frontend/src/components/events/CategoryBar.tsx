import type { CategoryKey } from '../../api'
import type { Category } from '../../categories'
import { Pill } from '../ui/Pill'

interface CategoryBarProps {
  categories: Category[]
  selected: CategoryKey | null
  onSelect: (category: CategoryKey | null) => void
}

function Dot({ color }: { color: string }) {
  return <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: color }} />
}

export function CategoryBar({ categories, selected, onSelect }: CategoryBarProps) {
  return (
    <div className="relative z-20 w-full shrink-0 bg-surface-container-low/70 backdrop-blur-sm">
      <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-8 bg-gradient-to-r from-surface to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-8 bg-gradient-to-l from-surface to-transparent" />
      <nav className="no-scrollbar flex items-center gap-2 overflow-x-auto px-5 py-3 sm:px-8" aria-label="Catégories">
        <Pill variant="soft" active={selected === null} onClick={() => onSelect(null)}>
          <Dot color={selected === null ? 'var(--color-surface)' : 'var(--color-primary)'} />
          Tous
        </Pill>
        {categories.map((category) => (
          <Pill
            key={category.key}
            variant="soft"
            active={selected === category.key}
            onClick={() => onSelect(category.key)}
          >
            <Dot color={selected === category.key ? 'var(--color-surface)' : category.color} />
            {category.label}
          </Pill>
        ))}
      </nav>
    </div>
  )
}
