import { useEffect, useState } from 'react'
import { TEXTS } from '../../texts'
import { Icon } from './Icon'

interface CopyButtonProps {
  value: string
  label: string
}

const FEEDBACK_MS = 1500

export function CopyButton({ value, label }: CopyButtonProps) {
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    if (!copied) return
    const timer = setTimeout(() => setCopied(false), FEEDBACK_MS)
    return () => clearTimeout(timer)
  }, [copied])

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(value)
      setCopied(true)
    } catch {
      // Clipboard can be blocked (insecure context, permissions): nothing to do.
    }
  }

  return (
    <button
      type="button"
      onClick={copy}
      title={value}
      className="flex items-center gap-1.5 rounded-full bg-surface-container-high/60 px-2.5 py-1 text-label-sm uppercase text-on-surface-variant transition-colors hover:bg-surface-container-high hover:text-on-surface"
    >
      <Icon name={copied ? 'check' : 'content_copy'} size={14} className={copied ? 'text-primary-strong' : ''} />
      {copied ? TEXTS.map.copied : label}
    </button>
  )
}
