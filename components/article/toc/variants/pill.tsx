"use client"

import { IconChevronUp } from "@tabler/icons-react"
import { AnimatePresence, motion, useReducedMotion } from "framer-motion"
import { useEffect, useId, useRef, useState } from "react"

import { track } from "@/lib/analytics/events"
import { tap as tapSound } from "@/lib/audio"
import { useScrollSpy } from "@/lib/hooks/use-scroll-spy"
import { cn } from "@/lib/utils"

import type { TocVariantProps } from "../types"

export default function PillToc({ slug, items }: TocVariantProps) {
  const reduced = useReducedMotion() ?? false
  const { active, scrollToId } = useScrollSpy({
    ids: items.map((item) => item.id),
    topOffset: 96,
  })
  const [position, setPosition] = useState({
    visible: false,
    started: false,
    progress: 0,
  })
  const [open, setOpen] = useState(false)
  const root = useRef<HTMLDivElement>(null)
  const trigger = useRef<HTMLButtonElement>(null)
  const rows = useRef<(HTMLAnchorElement | null)[]>([])
  const panelId = useId()
  const idsKey = items.map((item) => item.id).join("|")
  const current = position.started ? active : -1
  const duration = reduced ? 0 : 0.18

  function close() {
    setOpen(false)
    trigger.current?.focus({ preventScroll: true })
  }

  useEffect(() => {
    let frame = 0
    const update = () => {
      cancelAnimationFrame(frame)
      frame = requestAnimationFrame(() => {
        const first = document.getElementById(idsKey.split("|")[0])
        const article = first?.closest("article")
        if (!first || !article) return
        const bounds = article.getBoundingClientRect()
        const start = bounds.top + window.scrollY
        const distance = Math.max(1, bounds.height - window.innerHeight)
        const started =
          first.getBoundingClientRect().top <=
          Math.max(104, window.innerHeight * 0.3)
        const visible = window.scrollY > window.innerHeight * 0.4 || started
        setPosition({
          visible,
          started,
          progress: Math.max(
            0,
            Math.min(1, (window.scrollY - start) / distance)
          ),
        })
        if (!visible) setOpen(false)
      })
    }
    update()
    window.addEventListener("scroll", update, { passive: true })
    window.addEventListener("resize", update)
    const observer = new ResizeObserver(update)
    observer.observe(document.documentElement)
    return () => {
      cancelAnimationFrame(frame)
      observer.disconnect()
      window.removeEventListener("scroll", update)
      window.removeEventListener("resize", update)
    }
  }, [idsKey])

  useEffect(() => {
    if (!open) return
    const frame = requestAnimationFrame(() => {
      const row = rows.current[Math.max(0, current)]
      row?.focus({ preventScroll: true })
      row?.scrollIntoView({ block: "nearest", behavior: "instant" })
    })
    const outside = (event: PointerEvent) => {
      if (event.target instanceof Node && !root.current?.contains(event.target))
        close()
    }
    document.addEventListener("pointerdown", outside)
    return () => {
      cancelAnimationFrame(frame)
      document.removeEventListener("pointerdown", outside)
    }
    // Focus the selected row only when the panel opens, not as reading advances.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open])

  if (!items.length) return null

  return (
    <AnimatePresence>
      {position.visible && (
        <motion.div
          ref={root}
          initial={{ opacity: 0, y: reduced ? 0 : 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: reduced ? 0 : 12 }}
          transition={{ duration }}
          className="not-typeset fixed start-1/2 bottom-[calc(4rem+env(safe-area-inset-bottom))] z-50 w-[calc(100%-2rem)] max-w-80 -translate-x-1/2 min-[720px]:bottom-[calc(1.5rem+env(safe-area-inset-bottom))]"
          onKeyDown={(event) => {
            if (event.key === "Escape" && open) {
              event.preventDefault()
              close()
            }
          }}
          onBlur={(event) => {
            if (open && !event.currentTarget.contains(event.relatedTarget))
              setOpen(false)
          }}
        >
          <AnimatePresence>
            {open && (
              <motion.nav
                key="contents"
                id={panelId}
                aria-label="Article contents"
                initial={{ opacity: 0, y: reduced ? 0 : 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: reduced ? 0 : 8 }}
                transition={{ duration }}
                className="absolute start-1/2 bottom-full mb-2 w-[min(360px,calc(100vw-2rem))] -translate-x-1/2 overflow-hidden material-menu p-1.5"
              >
                <div className="max-h-[min(60dvh,480px)] overflow-y-auto overscroll-contain p-1">
                  <div className="px-3 pt-1.5 pb-2.5 text-label-12-mono text-gray-900">
                    CONTENTS
                  </div>
                  {items.map((item, index) => (
                    <a
                      key={item.id}
                      ref={(node) => {
                        rows.current[index] = node
                      }}
                      href={`#${item.id}`}
                      aria-current={index === current ? "location" : undefined}
                      onKeyDown={(event) => {
                        let next: number
                        if (event.key === "ArrowDown")
                          next = (index + 1) % items.length
                        else if (event.key === "ArrowUp")
                          next = (index - 1 + items.length) % items.length
                        else if (event.key === "Home") next = 0
                        else if (event.key === "End") next = items.length - 1
                        else if (event.key === " ") {
                          event.preventDefault()
                          event.currentTarget.click()
                          return
                        } else return
                        event.preventDefault()
                        rows.current[next]?.focus()
                      }}
                      onClick={(event) => {
                        event.preventDefault()
                        tapSound()
                        track("toc link clicked", { slug, heading: item.label })
                        scrollToId(item.id)
                        close()
                      }}
                      className={cn(
                        "flex min-h-10 items-center gap-2 rounded-sm ps-3 pe-3 no-underline transition-colors outline-none hover:bg-gray-alpha-200 hover:text-gray-1000 focus-visible:border-gray-600 focus-visible:ring-3 focus-visible:ring-gray-600/50",
                        item.depth === 3
                          ? "ps-7 text-label-13"
                          : "text-label-14",
                        index === current
                          ? "bg-gray-alpha-100 text-gray-1000"
                          : "text-gray-900"
                      )}
                    >
                      <span
                        className="min-w-0 flex-1 truncate"
                        title={item.label}
                      >
                        {item.label}
                      </span>
                      {index === current && (
                        <span
                          aria-hidden
                          className="size-1 shrink-0 rounded-full bg-gray-1000"
                        />
                      )}
                    </a>
                  ))}
                </div>
              </motion.nav>
            )}
          </AnimatePresence>
          <button
            ref={trigger}
            type="button"
            aria-label={`Contents: ${items[current]?.label ?? "Introduction"}, ${current + 1} of ${items.length}`}
            aria-expanded={open}
            aria-controls={panelId}
            onClick={() => setOpen(!open)}
            onKeyDown={(event) => {
              if (event.key === "ArrowUp" || event.key === "ArrowDown") {
                event.preventDefault()
                setOpen(true)
              }
            }}
            className="flex h-10 w-full items-center gap-2.5 material-menu rounded-full ps-3 pe-3.5 transition-colors outline-none hover:border-gray-alpha-500 focus-visible:border-gray-600 focus-visible:ring-3 focus-visible:ring-gray-600/50"
          >
            <svg
              aria-hidden
              viewBox="0 0 20 20"
              className="size-5 shrink-0 -rotate-90 fill-none"
              strokeWidth="2"
            >
              <circle cx="10" cy="10" r="7" className="stroke-gray-alpha-400" />
              <circle
                cx="10"
                cy="10"
                r="7"
                pathLength="1"
                strokeDasharray="1"
                strokeDashoffset={1 - position.progress}
                strokeLinecap="round"
                className="stroke-gray-1000"
              />
            </svg>
            <span className="relative min-w-0 flex-1 overflow-hidden text-start text-label-14 text-gray-1000">
              <AnimatePresence mode="popLayout" initial={false}>
                <motion.span
                  key={items[current]?.id ?? "intro"}
                  initial={{ opacity: 0, y: reduced ? 0 : 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: reduced ? 0 : -6 }}
                  transition={{ duration }}
                  className="block truncate"
                >
                  {items[current]?.label ?? "Contents"}
                </motion.span>
              </AnimatePresence>
            </span>
            <span className="shrink-0 text-label-13-mono text-gray-900">
              {current + 1}/{items.length}
            </span>
            <IconChevronUp
              aria-hidden
              size={16}
              className={cn("shrink-0 text-gray-900", open && "rotate-180")}
            />
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
