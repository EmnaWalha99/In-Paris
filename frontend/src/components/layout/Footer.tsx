import { DATA_SOURCE_URL } from '../../config'
import { TEXTS } from '../../texts'

const YEAR = new Date().getFullYear()

export function Footer() {
  return (
    <footer className="hidden h-10 w-full shrink-0 items-center justify-between bg-on-surface px-8 text-label-sm uppercase text-on-secondary/70 md:flex">
      <span>
        {TEXTS.appName} © {YEAR} ·{' '}
        <a className="hover:text-on-secondary" href={DATA_SOURCE_URL} target="_blank" rel="noreferrer">
          {TEXTS.dataSource}
        </a>
      </span>
      <span className="text-on-secondary">{TEXTS.location}</span>
    </footer>
  )
}
