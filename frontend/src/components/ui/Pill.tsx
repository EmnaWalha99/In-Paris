import type { ReactNode } from 'react'

interface PillProps {
  active: boolean
  onClick: () => void
  variant?: 'outline' | 'soft'
  children: ReactNode
}

const INACTIVE = {
  outline: 'border-outline-variant/60 text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface',
  soft: 'border-transparent bg-surface-container-high/60 text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface',
}

export function Pill({ active, onClick, variant = 'outline', children }: PillProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={`flex shrink-0 items-center gap-2 rounded-full border px-3.5 py-1.5 text-label-md uppercase transition-all duration-200 ${
        active ? 'border-primary bg-primary text-on-primary' : INACTIVE[variant]
      }`}
    >
      {children}
    </button>
  )
}
