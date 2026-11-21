"use client"

import { AnimatePresence, motion, useReducedMotion } from "framer-motion"
import { useEffect, useId, useRef, useState, type MouseEvent } from "react"

import { track } from "@/lib/analytics/events"
import { tap as tapSound } from "@/lib/audio"
import { useScrollSpy } from "@/lib/hooks/use-scroll-spy"
import { cn } from "@/lib/utils"

import type { TocVariantProps } from "../types"

const FOCUS =
  "rounded-sm border border-transparent focus-visible:border-gray-600 focus-visible:ring-3 focus-visible:ring-gray-600/50 focus-visible:outline-none"

export default function InlineToc({ slug, items }: TocVariantProps) {
  const reduced = useReducedMotion() ?? false
  const block = useRef<HTMLElement>(null)
  const listId = useId()
  const blockId = useId()
  const [away, setAway] = useState(false)
  const [expanded, setExpanded] = useState(false)
  const { activeId, scrollToId } = useScrollSpy({
    ids: items.map((item) => item.id),
    topOffset: 96,
  })
  const groups: { heading: (typeof items)[number]; children: typeof items }[] =
    []
  for (const item of items) {
    if (item.depth === 2 || groups.length === 0) {
      groups.push({ heading: item, children: [] })
    } else {
      groups[groups.length - 1].children.push(item)
    }
  }
  const current = Math.max(
    0,
    groups.findIndex(
      ({ heading, children }) =>
        heading.id === activeId || children.some((item) => item.id === activeId)
    )
  )

  useEffect(() => {
    const element = block.current
    if (!element) return
    const observer = new IntersectionObserver(
      ([entry]) => setAway(entry.boundingClientRect.bottom <= 96),
      { rootMargin: "-96px 0px 0px 0px", threshold: 0 }
    )
    observer.observe(element)
    return () => observer.disconnect()
  }, [])

  if (items.length < 2) return null

  const jump = (
    e: MouseEvent<HTMLAnchorElement>,
    id: string,
    label: string
  ) => {
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return
    e.preventDefault()
    tapSound()
    scrollToId(id)
    track("toc link clicked", { slug, heading: label })
  }
  const back = (e: MouseEvent<HTMLAnchorElement>) => {
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return
    e.preventDefault()
    tapSound()
    block.current?.focus({ preventScroll: true })
    if (block.current) {
      window.scrollTo({
        top: block.current.getBoundingClientRect().top + window.scrollY - 112,
        behavior: reduced ? "auto" : "smooth",
      })
    }
    track("toc link clicked", { slug, heading: "Contents" })
  }
  const row = (item: (typeof items)[number], number: string) => (
    <a
      href={`#${item.id}`}
      aria-current={item.id === activeId ? "location" : undefined}
      onClick={(e) => jump(e, item.id, item.label)}
      className={cn(
        FOCUS,
        "flex items-baseline gap-3 py-1 text-copy-14 text-gray-1000 no-underline transition-colors hover:bg-gray-alpha-100"
      )}
    >
      <span className="min-w-7 shrink-0 text-label-13-mono text-gray-900 tabular-nums">
        {number}
      </span>
      <span className="min-w-0 wrap-anywhere">{item.label}</span>
    </a>
  )

  return (
    <>
      <div className="mx-auto w-full max-w-180 pt-12">
        <nav
          ref={block}
          id={blockId}
          tabIndex={-1}
          aria-label="Contents"
          className="border-y border-gray-alpha-400 py-5 focus-visible:outline-2 focus-visible:outline-gray-600"
        >
          <div className="mb-3 text-label-13-mono text-gray-900">Contents</div>
          <ol
            id={listId}
            className={cn(
              "list-none space-y-1",
              groups.length > 5 && "gap-8 sm:columns-2"
            )}
          >
            {(expanded ? groups : groups.slice(0, 8)).map(
              ({ heading, children }, i) => (
                <li key={heading.id} className="break-inside-avoid">
                  {row(heading, `${i + 1}`)}
                  {children.length > 0 && (
                    <ol className="list-none ps-6">
                      {children.map((child, j) => (
                        <li key={child.id}>
                          {row(child, `${i + 1}.${j + 1}`)}
                        </li>
                      ))}
                    </ol>
                  )}
                </li>
              )
            )}
          </ol>
          {groups.length > 8 && (
            <button
              type="button"
              aria-expanded={expanded}
              aria-controls={listId}
              onClick={() => {
                tapSound()
                setExpanded((value) => !value)
              }}
              className={cn(
                FOCUS,
                "mt-4 h-8 ps-3 pe-3 text-button-12 text-gray-900 transition-colors hover:bg-gray-alpha-100 hover:text-gray-1000"
              )}
            >
              {expanded ? "Show fewer" : `Show all ${groups.length} sections`}
            </button>
          )}
        </nav>
      </div>

      <aside className="pointer-events-none absolute start-0 top-0 hidden h-full w-44 pt-11.5 min-[1168px]:block">
        <div className="sticky top-32">
          <AnimatePresence>
            {away && (
              <motion.nav
                key="mini"
                aria-label="Contents"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: reduced ? 0 : 0.2 }}
                className="pointer-events-auto"
              >
                <a
                  href={`#${blockId}`}
                  onClick={back}
                  className={cn(
                    FOCUS,
                    "mb-3 inline-block py-1 text-label-13-mono text-gray-900 transition-colors hover:text-gray-1000"
                  )}
                >
                  Contents ↑
                </a>
                <ol className="max-h-[calc(100dvh-16rem)] list-none overflow-y-auto overscroll-contain py-1">
                  {groups.map(({ heading }, i) => (
                    <li key={heading.id}>
                      <a
                        href={`#${heading.id}`}
                        title={heading.label}
                        aria-current={i === current ? "location" : undefined}
                        onClick={(e) => jump(e, heading.id, heading.label)}
                        className={cn(
                          FOCUS,
                          "flex h-7 items-center gap-1 text-label-13 no-underline transition-colors hover:bg-gray-alpha-100 hover:text-gray-1000",
                          i === current ? "text-gray-1000" : "text-gray-900"
                        )}
                      >
                        <span
                          aria-hidden="true"
                          className={cn(
                            "h-3 w-0.5 shrink-0 rounded-full",
                            i === current && "bg-gray-1000"
                          )}
                        />
                        <span className="min-w-4 shrink-0 text-label-13-mono tabular-nums">
                          {i + 1}
                        </span>
                        <span className="truncate">{heading.label}</span>
                      </a>
                    </li>
                  ))}
                </ol>
              </motion.nav>
            )}
          </AnimatePresence>
        </div>
      </aside>

      <AnimatePresence>
        {away && (
          <motion.nav
            key="chip"
            aria-label="Contents"
            initial={{ opacity: 0, y: reduced ? 0 : 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: reduced ? 0 : 6 }}
            transition={{ duration: reduced ? 0 : 0.2 }}
            className="fixed start-4 bottom-16 z-40 max-w-[calc(100vw-2rem)] min-[1168px]:hidden"
          >
            <a
              href={`#${blockId}`}
              onClick={back}
              aria-label={`Back to contents, section ${current + 1}: ${groups[current].heading.label}`}
              className={cn(
                FOCUS,
                "flex h-9 max-w-72 items-center gap-2 material-menu rounded-full ps-3 pe-3 text-label-13 text-gray-1000 no-underline transition-colors hover:bg-gray-200"
              )}
            >
              <span className="shrink-0 text-label-13-mono text-gray-900 tabular-nums">
                §{current + 1} ·
              </span>
              <span className="truncate">{groups[current].heading.label}</span>
              <span aria-hidden="true" className="shrink-0 text-gray-900">
                ↑
              </span>
            </a>
          </motion.nav>
        )}
      </AnimatePresence>
    </>
  )
}
