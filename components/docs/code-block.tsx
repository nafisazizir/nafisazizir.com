"use client"

import * as React from "react"
import { IconCheck, IconCopy } from "@tabler/icons-react"

import { Button } from "@/components/ui/button"

// The chrome around a <pre>: an optional title bar and a copy button. The
// pre itself is typeset by the prose layer; this only positions. Pass the
// raw source as `value` when the rendered text is not what should be
// copied (line numbers, diff markers).
function CodeBlock({
  title,
  value,
  lineNumbers = false,
  className,
  children,
  ...props
}: React.ComponentProps<"figure"> & {
  title?: string
  value?: string
  lineNumbers?: boolean
}) {
  const figureRef = React.useRef<HTMLElement>(null)
  const timeoutRef = React.useRef<ReturnType<typeof setTimeout> | null>(null)
  const [copied, setCopied] = React.useState(false)

  React.useEffect(
    () => () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current)
    },
    []
  )

  async function copy() {
    const text = value ?? figureRef.current?.querySelector("pre")?.textContent
    if (!text) return

    try {
      await navigator.clipboard.writeText(text)
    } catch {
      return
    }

    if (timeoutRef.current) clearTimeout(timeoutRef.current)
    setCopied(true)
    timeoutRef.current = setTimeout(() => setCopied(false), 1200)
  }

  return (
    <figure
      ref={figureRef}
      data-slot="code-block"
      data-titled={title ? "true" : undefined}
      data-line-numbers={lineNumbers ? "true" : undefined}
      className={className}
      {...props}
    >
      {title ? (
        <figcaption data-slot="code-block-title">{title}</figcaption>
      ) : null}
      {children}
      <Button
        type="button"
        variant="ghost"
        size="icon-sm"
        aria-label={copied ? "Copied" : "Copy code"}
        data-copy-button
        onClick={() => void copy()}
      >
        {copied ? (
          <IconCheck data-icon="inline-start" />
        ) : (
          <IconCopy data-icon="inline-start" />
        )}
        <span className="sr-only" aria-live="polite">
          {copied ? "Copied" : ""}
        </span>
      </Button>
    </figure>
  )
}

export { CodeBlock }
