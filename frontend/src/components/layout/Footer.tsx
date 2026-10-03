const YEAR = new Date().getFullYear()

export function Footer() {
  return (
    <footer className="hidden h-10 w-full shrink-0 items-center justify-between border-t border-outline-variant/40 bg-surface-container-low px-8 text-label-sm uppercase text-on-surface-variant md:flex">
      <span>
        In Paris © {YEAR} · Données{' '}
        <a
          className="hover:text-on-surface"
          href="https://opendata.paris.fr/explore/dataset/que-faire-a-paris-/"
          target="_blank"
          rel="noreferrer"
        >
          Que faire à Paris
        </a>
      </span>
      <span className="text-on-surface">Paris, Île-de-France</span>
    </footer>
  )
}
