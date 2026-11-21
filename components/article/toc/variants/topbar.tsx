"use client"

import { IconChevronDown } from "@tabler/icons-react"
import { AnimatePresence, motion, useReducedMotion } from "framer-motion"
import { useEffect, useId, useRef, useState } from "react"

import { track } from "@/lib/analytics/events"
import { tap as tapSound } from "@/lib/audio"
import { useScrollSpy } from "@/lib/hooks/use-scroll-spy"
import { cn } from "@/lib/utils"

import type { TocVariantProps } from "../types"

const numberLabel = (number: number) => String(number).padStart(2, "0")

export default function TopbarToc({ slug, items }: TocVariantProps) {
  const reduced = useReducedMotion() ?? false
  const duration = reduced ? 0 : 0.18
  const { active, scrollToId } = useScrollSpy({
    ids: items.map((item) => item.id),
    topOffset: 128,
  })
  const [reading, setReading] = useState({
    visible: false,
    started: false,
    progress: 0,
  })
  const [navOpen, setNavOpen] = useState(false)
  const [open, setOpen] = useState(false)
  const root = useRef<HTMLDivElement>(null)
  const trigger = useRef<HTMLButtonElement>(null)
  const rows = useRef<(HTMLAnchorElement | null)[]>([])
  const panelId = useId()
  const idsKey = items.map((item) => item.id).join("|")
  const current = reading.started ? active : -1
  const heading = items[current]
  const parentIndex = items
    .slice(0, current + 1)
    .findLastIndex((item) => item.depth === 2)
  const parent = parentIndex >= 0 ? items[parentIndex] : undefined
  const sectionNumber = items
    .slice(0, current + 1)
    .filter((item) => item.depth === 2).length
  let rowNumber = 0

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
        const header = article?.querySelector("header")
        if (!first || !article || !header) return
        const visible = header.getBoundingClientRect().bottom <= 0
        const bounds = article.getBoundingClientRect()
        setReading({
          visible,
          started:
            first.getBoundingClientRect().top <=
            Math.max(136, window.innerHeight * 0.3),
          progress: Math.max(
            0,
            Math.min(
              1,
              -bounds.top / Math.max(1, bounds.height - window.innerHeight)
            )
          ),
        })
        if (!visible) setOpen(false)
      })
    }
    update()
    window.addEventListener("scroll", update, { passive: true })
    window.addEventListener("resize", update)
    const resize = new ResizeObserver(update)
    resize.observe(document.documentElement)
    return () => {
      cancelAnimationFrame(frame)
      resize.disconnect()
      window.removeEventListener("scroll", update)
      window.removeEventListener("resize", update)
    }
  }, [idsKey])

  useEffect(() => {
    const nav = document.querySelector("[data-nav-trigger]")?.closest("nav")
    if (!nav) return
    let timer: ReturnType<typeof setTimeout> | undefined
    const syncNav = () => {
      clearTimeout(timer)
      const expanded = !!nav.querySelector(
        '[data-nav-trigger][aria-expanded="true"]'
      )
      if (expanded) {
        setNavOpen(true)
        setOpen(false)
      } else {
        timer = setTimeout(() => setNavOpen(false), 750)
      }
    }
    const observer = new MutationObserver(syncNav)
    observer.observe(nav, {
      subtree: true,
      childList: true,
      attributes: true,
      attributeFilter: ["aria-expanded"],
    })
    syncNav()
    return () => {
      clearTimeout(timer)
      observer.disconnect()
    }
  }, [])

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open])

  if (!items.length) return null

  return (
    <AnimatePresence>
      {reading.visible && !navOpen && (
        <motion.div
          ref={root}
          initial={{ opacity: 0, y: reduced ? 0 : -8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: reduced ? 0 : -8 }}
          transition={{ duration }}
          className="not-typeset fixed start-1/2 top-(--nav-band) z-40 w-[calc(100%-2.5rem)] max-w-180 -translate-x-1/2 md:w-[calc(100%-3rem)]"
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
          <button
            ref={trigger}
            type="button"
            aria-label={`Contents: ${heading?.label ?? "Introduction"}, ${current + 1} of ${items.length}`}
            aria-expanded={open}
            aria-controls={panelId}
            onClick={() => setOpen(!open)}
            onKeyDown={(event) => {
              if (event.key === "ArrowDown" || event.key === "ArrowUp") {
                event.preventDefault()
                setOpen(true)
              }
            }}
            className="relative flex h-10 w-full items-center gap-3 material-menu rounded-xl ps-3.5 pe-3.5 transition-colors outline-none hover:border-gray-alpha-500 focus-visible:border-gray-600 focus-visible:ring-3 focus-visible:ring-gray-600/50"
          >
            <span className="shrink-0 text-label-13-mono text-gray-900">
              {numberLabel(sectionNumber)}
            </span>
            <span className="relative min-w-0 flex-1 overflow-hidden text-start text-label-14 text-gray-1000">
              <AnimatePresence initial={false} mode="popLayout">
                <motion.span
                  key={heading?.id ?? "intro"}
                  initial={{ opacity: 0, y: reduced ? 0 : 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: reduced ? 0 : -6 }}
                  transition={{ duration }}
                  className="block truncate"
                >
                  {heading?.depth === 3 && parent && (
                    <span className="text-gray-900">{parent.label} / </span>
                  )}
                  {heading?.label ?? "Contents"}
                </motion.span>
              </AnimatePresence>
            </span>
            <span className="shrink-0 text-label-13-mono text-gray-900">
              {current + 1}/{items.length}
            </span>
            <motion.span
              animate={{ rotate: open ? 180 : 0 }}
              transition={{ duration }}
              className="flex shrink-0 text-gray-900"
            >
              <IconChevronDown aria-hidden size={16} />
            </motion.span>
            <span
              aria-hidden
              className="pointer-events-none absolute inset-x-3.5 bottom-0 h-px overflow-hidden bg-gray-alpha-400"
            >
              <span
                style={{ transform: `scaleX(${reading.progress})` }}
                className="block h-full origin-left bg-gray-1000 rtl:origin-right"
              />
            </span>
          </button>
          <AnimatePresence>
            {open && (
              <motion.nav
                id={panelId}
                aria-label="Article contents"
                initial={{ opacity: 0, y: reduced ? 0 : -6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: reduced ? 0 : -6 }}
                transition={{ duration }}
                className="absolute inset-x-0 top-full mt-2 overflow-hidden material-menu rounded-xl p-1.5"
              >
                <div className="max-h-[min(60dvh,480px)] overflow-y-auto overscroll-contain p-1">
                  {items.map((item, index) => {
                    if (item.depth === 2) rowNumber++
                    return (
                      <a
                        key={item.id}
                        ref={(node) => {
                          rows.current[index] = node
                        }}
                        href={`#${item.id}`}
                        aria-current={
                          index === current ? "location" : undefined
                        }
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
                          track("toc link clicked", {
                            slug,
                            heading: item.label,
                          })
                          scrollToId(item.id)
                          close()
                        }}
                        className={cn(
                          "flex min-h-10 items-center gap-3 rounded-sm ps-3 pe-3 no-underline transition-colors outline-none hover:bg-gray-alpha-200 hover:text-gray-1000 focus-visible:border-gray-600 focus-visible:ring-3 focus-visible:ring-gray-600/50",
                          item.depth === 3 ? "text-label-13" : "text-label-14",
                          index === current
                            ? "bg-gray-alpha-100 text-gray-1000"
                            : "text-gray-900"
                        )}
                      >
                        <span
                          aria-hidden
                          className="w-5 shrink-0 text-label-13-mono text-gray-900"
                        >
                          {item.depth === 2 ? numberLabel(rowNumber) : ""}
                        </span>
                        <span
                          title={item.label}
                          className={cn(
                            "min-w-0 flex-1 truncate",
                            item.depth === 3 && "ps-3"
                          )}
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
                    )
                  })}
                </div>
              </motion.nav>
            )}
          </AnimatePresence>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
