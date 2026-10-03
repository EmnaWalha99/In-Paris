import type { ReactNode } from 'react'

export function Header({ children }: { children: ReactNode }) {
  return (
    <header className="z-30 flex w-full shrink-0 flex-col gap-3 border-b border-outline-variant/60 px-5 py-3 sm:h-20 sm:flex-row sm:items-center sm:justify-between sm:px-8">
      <div className="flex flex-col">
        <span className="font-serif text-headline-md italic leading-tight tracking-tight">In Paris</span>
        <span className="mt-0.5 text-label-sm uppercase text-on-surface-variant">Ce soir à Paris</span>
      </div>
      {children}
    </header>
  )
}
