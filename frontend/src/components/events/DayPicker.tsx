import { useRef } from 'react'
import { formatShortDate, type DayOption } from '../../utils/format'
import { Icon } from '../ui/Icon'
import { Pill } from '../ui/Pill'

interface DayPickerProps {
  days: DayOption[]
  selected: string
  onSelect: (day: string) => void
}

export function DayPicker({ days, selected, onSelect }: DayPickerProps) {
  const dateInput = useRef<HTMLInputElement>(null)
  const isOtherDay = !days.some((day) => day.value === selected)

  return (
    <nav className="no-scrollbar -mx-5 flex items-center gap-1.5 overflow-x-auto px-5 py-1 sm:mx-0 sm:px-0" aria-label="Jour">
      {days.map((day) => (
        <Pill key={day.value} active={day.value === selected} onClick={() => onSelect(day.value)}>
          {day.label}
        </Pill>
      ))}
      <div className="relative shrink-0">
        <Pill active={isOtherDay} onClick={() => dateInput.current?.showPicker()}>
          <Icon name="calendar_month" className="text-[16px]" />
          {isOtherDay ? formatShortDate(selected) : <span className="sr-only">Choisir une date</span>}
        </Pill>
        {/* Invisible native date input: the pill opens its picker, anchored under the pill. */}
        <input
          ref={dateInput}
          type="date"
          value={selected}
          onChange={(e) => e.target.value && onSelect(e.target.value)}
          tabIndex={-1}
          aria-hidden="true"
          className="pointer-events-none absolute bottom-0 left-0 h-0 w-0 opacity-0"
        />
      </div>
    </nav>
  )
}
