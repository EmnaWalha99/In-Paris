import type { ReactNode } from 'react'
import { TEXTS } from '../../texts'

export function Header({ children }: { children: ReactNode }) {
  return (
    <header className="z-30 flex w-full shrink-0 flex-col gap-3 bg-secondary px-5 text-on-secondary py-3 sm:h-20 sm:flex-row sm:items-center sm:justify-between sm:px-8">
      <div className="flex flex-col">
        <span className="font-serif text-headline-md italic leading-tight tracking-tight">{TEXTS.appName}</span>
        <span className="mt-0.5 text-label-sm uppercase text-on-secondary/70">{TEXTS.tagline}</span>
      </div>
      {children}
    </header>
  )
}
