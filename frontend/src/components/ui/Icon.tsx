interface IconProps {
  name: string // Material Symbols name, e.g. "location_on"
  size?: number
  className?: string
}

const DEFAULT_SIZE = 18

export function Icon({ name, size = DEFAULT_SIZE, className = '' }: IconProps) {
  return (
    <span className={`material-symbols-outlined ${className}`} style={{ fontSize: size }} aria-hidden="true">
      {name}
    </span>
  )
}
