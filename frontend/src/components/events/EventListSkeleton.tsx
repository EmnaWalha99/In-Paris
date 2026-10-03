const ROWS = 4

export function EventListSkeleton() {
  return (
    <div className="flex-1 space-y-4 overflow-hidden px-4 py-4" aria-busy="true">
      {Array.from({ length: ROWS }, (_, i) => (
        <div key={i} className="flex animate-pulse gap-4 rounded-xl bg-surface p-4">
          <div className="h-10 w-16 rounded bg-surface-container-high" />
          <div className="flex-1 space-y-2">
            <div className="h-3 w-20 rounded bg-surface-container-high" />
            <div className="h-5 w-4/5 rounded bg-surface-container-highest" />
            <div className="h-3 w-1/2 rounded bg-surface-container" />
            <div className="h-3 w-full rounded bg-surface-container-low" />
          </div>
          <div className="hidden h-20 w-20 shrink-0 rounded-lg bg-surface-container-high sm:block" />
        </div>
      ))}
    </div>
  )
}
