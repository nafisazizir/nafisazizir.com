"use client"

import { AnimatePresence, motion, useReducedMotion } from "framer-motion"
import { useEffect, useMemo, useRef, useState } from "react"

import { track } from "@/lib/analytics/events"
import { tap as tapSound } from "@/lib/audio"
import { useScrollSpy } from "@/lib/hooks/use-scroll-spy"
import { cn } from "@/lib/utils"

import type { TocVariantProps } from "../types"

type Item = TocVariantProps["items"][number]
type Group = { heading: Item; children: Item[] }
const halo =
  "rounded-sm border border-transparent outline-none focus-visible:border-gray-600 focus-visible:ring-3 focus-visible:ring-gray-600/50"

function NumberedList({
  groups,
  activeId,
  parent,
  reduced,
  onSelect,
}: {
  groups: Group[]
  activeId: string
  parent: number
  reduced: boolean
  onSelect: (item: Item) => void
}) {
  const list = useRef<HTMLDivElement>(null)
  const [edges, setEdges] = useState({ top: false, bottom: false })
  const digits = Math.max(2, String(groups.length).length)
  useEffect(() => {
    const element = list.current
    if (!element) return
    const update = () =>
      setEdges({
        top: element.scrollTop > 1,
        bottom:
          element.scrollTop + element.clientHeight < element.scrollHeight - 1,
      })
    const observer = new ResizeObserver(update)
    observer.observe(element)
    if (element.firstElementChild) observer.observe(element.firstElementChild)
    element.addEventListener("scroll", update, { passive: true })
    update()
    return () => {
      observer.disconnect()
      element.removeEventListener("scroll", update)
    }
  }, [])
  useEffect(() => {
    const element = list.current
    if (!element) return
    const reveal = () => {
      const row = element.querySelector('[aria-current="location"]')
      if (!row) return
      const bounds = element.getBoundingClientRect()
      const target = row.getBoundingClientRect()
      if (target.top < bounds.top + 16)
        element.scrollTo({
          top: element.scrollTop + target.top - bounds.top - 16,
          behavior: reduced ? "instant" : "smooth",
        })
      else if (target.bottom > bounds.bottom - 16)
        element.scrollTo({
          top: element.scrollTop + target.bottom - bounds.bottom + 16,
          behavior: reduced ? "instant" : "smooth",
        })
    }
    const frame = requestAnimationFrame(reveal)
    const timer = setTimeout(reveal, reduced ? 0 : 300)
    return () => {
      cancelAnimationFrame(frame)
      clearTimeout(timer)
    }
  }, [activeId, reduced])
  const rule = (active: boolean, short = false) => (
    <span
      aria-hidden="true"
      className={cn(
        "pointer-events-none absolute inset-x-0 bottom-0 h-px origin-left bg-gray-1000 transition-transform duration-450 ease-[cubic-bezier(0.16,1,0.3,1)] motion-reduce:transition-none",
        short && "end-auto w-8",
        active ? "scale-x-100" : "scale-x-0"
      )}
    />
  )
  return (
    <div
      ref={list}
      className="relative max-h-[calc(100dvh-18rem)] [scrollbar-width:none] overflow-y-auto overscroll-contain px-1 py-2 [&::-webkit-scrollbar]:hidden"
      style={{
        maskImage: `linear-gradient(to bottom, ${edges.top ? "transparent" : "black"}, black 12px, black calc(100% - 12px), ${edges.bottom ? "transparent" : "black"})`,
      }}
    >
      <div className="flex flex-col gap-1">
        {groups.map(({ heading, children }, i) => (
          <div key={heading.id}>
            <button
              type="button"
              aria-current={activeId === heading.id ? "location" : undefined}
              onClick={() => onSelect(heading)}
              className={cn(
                "relative grid w-full grid-cols-[28px_minmax(0,1fr)] gap-1 py-1.5 text-start transition-colors",
                halo,
                parent === i
                  ? "text-gray-1000"
                  : "text-gray-900 hover:text-gray-1000"
              )}
            >
              <span
                className={cn(
                  "text-label-12-mono",
                  i <= parent ? "text-gray-1000" : "text-gray-900"
                )}
              >
                {String(i + 1).padStart(digits, "0")}
              </span>
              <span className="line-clamp-2 text-label-13">
                {heading.label}
              </span>
              {rule(parent === i)}
            </button>
            <AnimatePresence initial={false}>
              {parent === i && children.length > 0 && (
                <motion.div
                  key="children"
                  initial={reduced ? false : { height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{
                    duration: reduced ? 0 : 0.26,
                    ease: [0.16, 1, 0.3, 1],
                  }}
                  className="overflow-hidden"
                >
                  <div className="ps-8 pt-1">
                    {children.map((child, j) => (
                      <button
                        key={child.id}
                        type="button"
                        aria-current={
                          activeId === child.id ? "location" : undefined
                        }
                        onClick={() => onSelect(child)}
                        className={cn(
                          "relative grid w-full grid-cols-[auto_minmax(0,1fr)] items-start gap-2 py-1.5 text-start transition-colors",
                          halo,
                          activeId === child.id
                            ? "text-gray-1000"
                            : "text-gray-900 hover:text-gray-1000"
                        )}
                      >
                        <span className="text-label-12-mono">
                          {String(i + 1).padStart(digits, "0")}.{j + 1}
                        </span>
                        <span className="line-clamp-2 text-label-12">
                          {child.label}
                        </span>
                        {rule(activeId === child.id, true)}
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>
    </div>
  )
}

export default function NumberedToc({ slug, items }: TocVariantProps) {
  const groups = useMemo(
    () =>
      items.reduce<Group[]>((result, item) => {
        if (item.depth === 2) result.push({ heading: item, children: [] })
        else result[result.length - 1]?.children.push(item)
        return result
      }, []),
    [items]
  )
  const { activeId, scrollToId } = useScrollSpy({
    ids: items.map((item) => item.id),
    topOffset: 96,
  })
  const parent = Math.max(
    0,
    groups.findIndex(
      (group) =>
        group.heading.id === activeId ||
        group.children.some((child) => child.id === activeId)
    )
  )
  const reduced = useReducedMotion() ?? false
  const [wide, setWide] = useState(false)
  const [passed, setPassed] = useState(false)
  const [open, setOpen] = useState(false)
  const mobile = useRef<HTMLDivElement>(null)
  const trigger = useRef<HTMLButtonElement>(null)
  const panel = useRef<HTMLDivElement>(null)
  const firstId = groups[0]?.heading.id
  useEffect(() => {
    const update = () => {
      setWide(window.innerWidth >= 1168)
      setPassed(
        !!firstId &&
          (document.getElementById(firstId)?.getBoundingClientRect().top ??
            Infinity) < 96
      )
    }
    update()
    window.addEventListener("scroll", update, { passive: true })
    window.addEventListener("resize", update)
    return () => {
      window.removeEventListener("scroll", update)
      window.removeEventListener("resize", update)
    }
  }, [firstId])
  useEffect(() => {
    if (!open) return
    const first =
      panel.current?.querySelector<HTMLButtonElement>(
        '[aria-current="location"]'
      ) ?? panel.current?.querySelector<HTMLButtonElement>("button")
    first?.focus({ preventScroll: true })
    const outside = (event: PointerEvent) => {
      if (!mobile.current?.contains(event.target as Node)) setOpen(false)
    }
    const escape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false)
        trigger.current?.focus()
      }
    }
    document.addEventListener("pointerdown", outside)
    document.addEventListener("keydown", escape)
    return () => {
      document.removeEventListener("pointerdown", outside)
      document.removeEventListener("keydown", escape)
    }
  }, [open])
  if (!groups.length) return null
  const digits = Math.max(2, String(groups.length).length)
  const current = String(parent + 1).padStart(digits, "0")
  const total = String(groups.length).padStart(digits, "0")
  const select = (item: Item) => {
    tapSound()
    scrollToId(item.id)
    track("toc link clicked", { slug, heading: item.label })
    setOpen(false)
    if (!wide) trigger.current?.focus({ preventScroll: true })
  }
  const header = (
    <div className="flex items-center justify-between border-b border-gray-alpha-400 px-1 pb-3 text-label-12-mono text-gray-900">
      <span>Contents</span>
      <span>
        <span className="text-gray-1000">{current}</span> / {total}
      </span>
    </div>
  )
  const list = (
    <NumberedList
      groups={groups}
      activeId={activeId}
      parent={parent}
      reduced={reduced}
      onSelect={select}
    />
  )
  const top = passed && (
    <button
      type="button"
      onClick={() => {
        tapSound()
        window.scrollTo({ top: 0, behavior: reduced ? "instant" : "smooth" })
        track("toc link clicked", { slug, heading: "Top" })
        setOpen(false)
      }}
      className={cn(
        "mt-2 px-1 py-1 text-label-12-mono text-gray-900 transition-colors hover:text-gray-1000",
        halo
      )}
    >
      ↑ Top
    </button>
  )
  if (wide)
    return (
      <aside
        aria-label="Contents"
        className="absolute end-0 top-0 h-full w-49 pt-11.5"
      >
        <nav className="sticky top-[max(8rem,calc(var(--nav-band)+2rem))] ps-3">
          {header}
          {list}
          {top}
        </nav>
      </aside>
    )
  if (!passed) return null
  return (
    <div
      ref={mobile}
      className="fixed start-4 z-40 w-[min(12rem,calc(100vw-11rem))]"
      style={{
        bottom: "calc(max(1rem, env(safe-area-inset-bottom)) + 3.5rem)",
      }}
    >
      {open && (
        <div
          ref={panel}
          id="numbered-contents"
          role="region"
          aria-label="Contents"
          className="absolute start-0 bottom-full mb-3 w-[min(20rem,calc(100vw-2rem))] material-menu p-3"
        >
          {header}
          {list}
          {top}
        </div>
      )}
      <button
        ref={trigger}
        type="button"
        aria-expanded={open}
        aria-controls="numbered-contents"
        onClick={() => {
          tapSound()
          setOpen(!open)
        }}
        className={cn(
          "flex w-full items-center gap-2 material-menu rounded-full px-3 py-2 text-gray-1000",
          halo
        )}
      >
        <span className="shrink-0 text-label-12-mono">
          {current}/{total}
        </span>
        <span className="truncate text-label-12">
          {groups[parent].heading.label}
        </span>
      </button>
    </div>
  )
}
