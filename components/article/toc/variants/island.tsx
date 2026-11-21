"use client"

import { IconX } from "@tabler/icons-react"
import { AnimatePresence, motion, useReducedMotion } from "framer-motion"
import { useEffect, useId, useRef, useState } from "react"

import { track } from "@/lib/analytics/events"
import { tap as tapSound } from "@/lib/audio"
import { useScrollSpy } from "@/lib/hooks/use-scroll-spy"
import { cn } from "@/lib/utils"

import type { TocVariantProps } from "../types"

export default function IslandToc({ slug, items }: TocVariantProps) {
  const reduced = useReducedMotion() ?? false
  const { active, scrollToId } = useScrollSpy({
    ids: items.map((item) => item.id),
    topOffset: 96,
  })
  const [reading, setReading] = useState({
    visible: false,
    started: false,
    progress: 0,
  })
  const [navOpen, setNavOpen] = useState(false)
  const [mode, setMode] = useState<"hover" | "pinned" | null>(null)
  const [pulse, setPulse] = useState(false)
  const root = useRef<HTMLDivElement>(null)
  const trigger = useRef<HTMLButtonElement>(null)
  const rows = useRef<(HTMLAnchorElement | null)[]>([])
  const intent = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)
  const grace = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)
  const suppressFocus = useRef(false)
  const previous = useRef(active)
  const panelId = useId()
  const idsKey = items.map((item) => item.id).join("|")
  const current = reading.started ? active : -1
  const open = mode !== null
  const duration = reduced ? 0 : 0.18
  const morph = reduced
    ? { duration: 0 }
    : { type: "spring" as const, stiffness: 420, damping: 38, mass: 0.8 }
  let sectionNumber = 0

  function close(returnFocus = true) {
    clearTimeout(intent.current)
    clearTimeout(grace.current)
    setMode(null)
    if (returnFocus) {
      suppressFocus.current = true
      trigger.current?.focus({ preventScroll: true })
      suppressFocus.current = false
    }
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
        const bounds = article.getBoundingClientRect()
        const visible = header.getBoundingClientRect().bottom <= 0
        setReading({
          visible,
          started:
            first.getBoundingClientRect().top <=
            Math.max(104, innerHeight * 0.3),
          progress: Math.max(
            0,
            Math.min(1, -bounds.top / Math.max(1, bounds.height - innerHeight))
          ),
        })
        if (!visible) setMode(null)
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
      clearTimeout(intent.current)
      clearTimeout(grace.current)
    }
  }, [idsKey])

  useEffect(() => {
    const nav = document.querySelector("[data-nav-trigger]")?.closest("nav")
    if (!nav) return
    let timer: ReturnType<typeof setTimeout> | undefined
    const sync = () => {
      clearTimeout(timer)
      if (nav.querySelector('[data-nav-trigger][aria-expanded="true"]')) {
        setNavOpen(true)
        setMode(null)
        clearTimeout(intent.current)
        clearTimeout(grace.current)
      } else timer = setTimeout(() => setNavOpen(false), 750)
    }
    const observer = new MutationObserver(sync)
    observer.observe(nav, {
      subtree: true,
      childList: true,
      attributes: true,
      attributeFilter: ["aria-expanded"],
    })
    sync()
    return () => {
      clearTimeout(timer)
      observer.disconnect()
    }
  }, [])

  useEffect(() => {
    if (previous.current === active) return
    previous.current = active
    if (reduced) return
    const frame = requestAnimationFrame(() => setPulse(true))
    const timer = setTimeout(() => setPulse(false), 600)
    return () => {
      cancelAnimationFrame(frame)
      clearTimeout(timer)
    }
  }, [active, reduced])

  useEffect(() => {
    if (!open) return
    const frame = requestAnimationFrame(() => {
      const row = rows.current[Math.max(0, current)]
      row?.scrollIntoView({ block: "nearest", behavior: "instant" })
      if (mode === "pinned") row?.focus({ preventScroll: true })
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
          layout={reduced ? false : true}
          initial={{ opacity: 0, scale: reduced ? 1 : 0.94 }}
          animate={{
            opacity: 1,
            scale: 1,
            borderRadius: open ? "var(--radius-2xl)" : 999,
          }}
          exit={{ opacity: 0, scale: reduced ? 1 : 0.94 }}
          transition={{ layout: morph, default: { duration } }}
          style={{ transformOrigin: "top right" }}
          className={cn(
            "not-typeset fixed end-(--nav-inset) top-(--nav-inset) z-50 overflow-hidden material-menu",
            open
              ? "w-[calc(100%-2rem)] rounded-2xl md:w-80"
              : "w-auto max-w-28 rounded-full md:max-w-60"
          )}
          onPointerEnter={(event) => {
            clearTimeout(grace.current)
            if (
              event.pointerType !== "mouse" ||
              !matchMedia("(hover: hover) and (pointer: fine)").matches ||
              open
            )
              return
            intent.current = setTimeout(() => setMode("hover"), 120)
          }}
          onPointerLeave={() => {
            clearTimeout(intent.current)
            if (mode === "hover")
              grace.current = setTimeout(() => close(false), 240)
          }}
          onFocus={(event) => {
            if (
              !suppressFocus.current &&
              event.target.matches(":focus-visible")
            )
              setMode("pinned")
          }}
          onBlur={(event) => {
            if (open && !event.currentTarget.contains(event.relatedTarget))
              close(false)
          }}
          onKeyDown={(event) => {
            if (event.key === "Escape" && open) {
              event.preventDefault()
              close()
            }
          }}
        >
          <motion.button
            layout={reduced ? false : "position"}
            ref={trigger}
            type="button"
            aria-expanded={open}
            aria-controls={panelId}
            aria-label={`Contents: ${items[current]?.label ?? "Introduction"}, ${current + 1} of ${items.length}`}
            animate={{ paddingInlineEnd: pulse && !open && !reduced ? 24 : 12 }}
            transition={morph}
            onClick={() =>
              open && mode === "pinned" ? close() : setMode("pinned")
            }
            onKeyDown={(event) => {
              if (event.key === "ArrowDown" || event.key === "ArrowUp") {
                event.preventDefault()
                setMode("pinned")
                rows.current[Math.max(0, current)]?.focus()
              }
            }}
            className={cn(
              "flex h-(--nav-pill) w-full items-center gap-2.5 rounded-full ps-3 pe-3 transition-colors outline-none hover:bg-gray-alpha-100 focus-visible:ring-3 focus-visible:ring-gray-600/50 focus-visible:ring-inset",
              open && "rounded-2xl"
            )}
          >
            <motion.span
              key={open ? "expanded" : "compact"}
              layout={reduced ? false : "position"}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration }}
              className="flex min-w-0 flex-1 items-center gap-2.5"
            >
              {open ? (
                <>
                  <span className="flex-1 text-start text-label-14 text-gray-1000">
                    Contents
                  </span>
                  <span className="text-label-13-mono text-gray-900">
                    {Math.round(reading.progress * 100)}%
                  </span>
                  <IconX aria-hidden size={14} className="text-gray-900" />
                </>
              ) : (
                <>
                  <motion.svg
                    layout={reduced ? false : "position"}
                    aria-hidden
                    viewBox="0 0 20 20"
                    className="size-4 shrink-0 -rotate-90 fill-none"
                    strokeWidth="2"
                  >
                    <circle
                      cx="10"
                      cy="10"
                      r="7"
                      className="stroke-gray-alpha-400"
                    />
                    <circle
                      cx="10"
                      cy="10"
                      r="7"
                      pathLength="1"
                      strokeDasharray="1"
                      strokeDashoffset={1 - reading.progress}
                      strokeLinecap="round"
                      className="stroke-gray-1000"
                    />
                  </motion.svg>
                  <span className="text-label-13-mono text-gray-900 md:hidden">
                    {current + 1}/{items.length}
                  </span>
                  <motion.span
                    layout={reduced ? false : "position"}
                    className="relative hidden min-w-0 overflow-hidden text-label-13 text-gray-1000 md:block"
                  >
                    <AnimatePresence initial={false} mode="popLayout">
                      <motion.span
                        key={items[current]?.id ?? "intro"}
                        initial={{ opacity: 0, y: reduced ? 0 : 5 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: reduced ? 0 : -5 }}
                        transition={{ duration }}
                        className="block max-w-45 truncate"
                      >
                        {items[current]?.label ?? "Contents"}
                      </motion.span>
                    </AnimatePresence>
                  </motion.span>
                </>
              )}
            </motion.span>
          </motion.button>
          <AnimatePresence initial={false}>
            {open && (
              <motion.nav
                layout={reduced ? false : "position"}
                id={panelId}
                aria-label="Article contents"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration }}
                className="p-1.5 pt-0"
              >
                <div className="max-h-[min(60dvh,480px)] overflow-y-auto overscroll-contain p-1">
                  {items.map((item, index) => {
                    if (item.depth === 2) sectionNumber++
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
                          "flex min-h-10 items-center gap-3 rounded-sm ps-2 pe-2 no-underline transition-colors outline-none hover:bg-gray-alpha-200 hover:text-gray-1000 focus-visible:border-gray-600 focus-visible:ring-3 focus-visible:ring-gray-600/50",
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
                          {item.depth === 2
                            ? String(sectionNumber).padStart(2, "0")
                            : ""}
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
