interface StatusMessageProps {
  eyebrow: string
  title: string
  message: string
  action?: { label: string; onClick: () => void }
}

export function StatusMessage({ eyebrow, title, message, action }: StatusMessageProps) {
  return (
    <div className="flex flex-1 flex-col items-center justify-center p-8 text-center">
      <div className="mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-surface-container text-primary/70">
        <svg className="h-14 w-14" fill="none" stroke="currentColor" strokeWidth="1.75" viewBox="0 0 64 64">
          <path
            d="M6 54h52M12 54V38l10-8 10 8v16M32 54V28l12-10 12 10v26M20 22a6 6 0 106-6 6 6 0 01-6 6z"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path d="M44 14l2-4 2 4M46 6v4" strokeLinecap="round" />
        </svg>
      </div>
      <span className="mb-1 text-label-sm uppercase text-primary">{eyebrow}</span>
      <h3 className="mb-2 font-serif text-headline-md">{title}</h3>
      <p className="mb-6 max-w-xs text-body-md text-on-surface-variant">{message}</p>
      {action && (
        <button
          type="button"
          onClick={action.onClick}
          className="rounded-full bg-primary px-5 py-2.5 text-label-md uppercase text-on-primary shadow-sm transition-colors hover:bg-secondary"
        >
          {action.label}
        </button>
      )}
    </div>
  )
}
