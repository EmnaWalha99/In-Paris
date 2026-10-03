import type { CategoryKey } from '../../types'
import { CATEGORY_BY_KEY } from '../../categories'

export function CategoryTag({ category }: { category: CategoryKey }) {
  const { label, color } = CATEGORY_BY_KEY[category]
  return (
    <span className="flex items-center gap-1.5 text-label-sm uppercase" style={{ color }}>
      <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: color }} />
      {label}
    </span>
  )
}
