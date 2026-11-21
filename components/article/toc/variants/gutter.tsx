"use client"

import { useEffect, useMemo, useRef, useState } from "react"

import { track } from "@/lib/analytics/events"
import { tap as tapSound } from "@/lib/audio"
import { useScrollSpy } from "@/lib/hooks/use-scroll-spy"
import { cn } from "@/lib/utils"

import type { TocVariantProps } from "../types"

type Mark = TocVariantProps["items"][number] & {
  section: number
  sub: number
  top: number
  end: number
  documentTop: number
}

const halo =
  "rounded-sm border border-transparent outline-none focus-visible:border-gray-600 focus-visible:ring-3 focus-visible:ring-gray-600/50"

export default function GutterToc({ slug, items }: TocVariantProps) {
  const root = useRef<HTMLElement>(null)
  const stickyTop = useRef(94)
  const [marks, setMarks] = useState<Mark[]>([])
  const [reading, setReading] = useState(0)
  const { activeId, scrollToId } = useScrollSpy({
    ids: items.map((item) => item.id),
    topOffset: 96,
  })
  const numbered = useMemo(
    () =>
      items.reduce<
        (TocVariantProps["items"][number] & { section: number; sub: number })[]
      >((result, item) => {
        const previous = result[result.length - 1]
        const section = (previous?.section ?? 0) + (item.depth === 2 ? 1 : 0)
        if (section)
          result.push({
            ...item,
            section,
            sub: item.depth === 2 ? 0 : (previous?.sub ?? 0) + 1,
          })
        return result
      }, []),
    [items]
  )

  useEffect(() => {
    const frame = root.current?.parentElement
    if (!frame || !root.current || !numbered.length) return
    let pending = 0
    let disposed = false
    const measure = () => {
      if (!root.current) return
      const bounds = frame.getBoundingClientRect()
      stickyTop.current =
        parseFloat(getComputedStyle(root.current).scrollMarginTop) || 94
      const measured = numbered.flatMap((item) => {
        const heading = document.getElementById(item.id)
        if (!heading) return []
        const headingBounds = heading.getBoundingClientRect()
        const line = parseFloat(getComputedStyle(heading).lineHeight) || 24
        const top =
          headingBounds.top - bounds.top + Math.max(0, (line - 20) / 2)
        return [
          {
            ...item,
            top,
            documentTop: top + bounds.top + window.scrollY,
            end: bounds.height,
          },
        ]
      })
      setMarks(
        measured.map((mark, i) => ({
          ...mark,
          end:
            mark.depth === 2
              ? (measured.slice(i + 1).find((next) => next.depth === 2)?.top ??
                bounds.height)
              : mark.top + 20,
        }))
      )
      setReading(window.scrollY + stickyTop.current)
    }
    const schedule = () => {
      if (!pending)
        pending = requestAnimationFrame(() => {
          pending = 0
          measure()
        })
    }
    const onScroll = () => setReading(window.scrollY + stickyTop.current)
    const observer = new ResizeObserver(schedule)
    observer.observe(frame)
    observer.observe(document.documentElement)
    numbered.forEach(({ id }) => {
      const heading = document.getElementById(id)
      if (heading) observer.observe(heading)
    })
    measure()
    document.fonts.ready.then(() => {
      if (!disposed) schedule()
    })
    window.addEventListener("resize", schedule)
    window.addEventListener("scroll", onScroll, { passive: true })
    frame.addEventListener("load", schedule, true)
    return () => {
      disposed = true
      cancelAnimationFrame(pending)
      observer.disconnect()
      window.removeEventListener("resize", schedule)
      window.removeEventListener("scroll", onScroll)
      frame.removeEventListener("load", schedule, true)
    }
  }, [numbered])

  if (!numbered.length) return null
  const digits = Math.max(
    2,
    String(numbered[numbered.length - 1].section).length
  )
  const click = (mark: Mark) => {
    tapSound()
    scrollToId(mark.id)
    track("toc link clicked", { slug, heading: mark.label })
  }
  return (
    <aside
      ref={root}
      aria-label="Section markers"
      className="pointer-events-none absolute inset-y-0 start-0 hidden w-50 scroll-mt-[calc(var(--nav-band)+1.5rem)] min-[1168px]:block"
    >
      {marks.map((mark) => {
        const length = Math.max(0, mark.end - mark.top)
        const current =
          mark.depth === 2 &&
          reading >= mark.documentTop &&
          reading < mark.documentTop + length
        const progress = Math.max(
          0,
          Math.min(1, (reading - mark.documentTop) / Math.max(1, length))
        )
        const compact = length < 96
        if (mark.depth === 3)
          return (
            <button
              key={mark.id}
              type="button"
              aria-label={`Section ${mark.section}.${mark.sub}: ${mark.label}`}
              aria-current={activeId === mark.id ? "location" : undefined}
              onClick={() => click(mark)}
              className={cn(
                "pointer-events-auto absolute end-8 flex h-5 items-center gap-2 px-1 text-label-12-mono transition-colors hover:text-gray-1000",
                halo,
                activeId === mark.id ? "text-gray-1000" : "text-gray-900"
              )}
              style={{ top: mark.top }}
            >
              <span>
                {mark.section}.{mark.sub}
              </span>
              {activeId === mark.id && (
                <span aria-hidden="true" className="h-px w-4 bg-gray-1000" />
              )}
            </button>
          )
        return (
          <div
            key={mark.id}
            className="absolute inset-x-0 pe-8"
            style={{
              top: mark.top,
              height: length,
              minHeight: Math.min(20, length),
            }}
          >
            <button
              type="button"
              aria-label={`Section ${mark.section}: ${mark.label}`}
              aria-current={activeId === mark.id ? "location" : undefined}
              onClick={() => click(mark)}
              className={cn(
                "group pointer-events-auto ms-auto block w-42 px-1 text-end",
                halo,
                compact
                  ? "relative"
                  : "sticky top-[calc(var(--nav-band)+1.5rem)]"
              )}
              style={{
                maxHeight: Math.max(0, length),
                overflow: compact ? "clip" : undefined,
              }}
            >
              <span className="flex h-5 items-center justify-end gap-2">
                <span
                  className={cn(
                    "text-label-13-mono transition-colors group-hover:text-gray-1000 group-focus-visible:text-gray-1000",
                    current ? "text-gray-1000" : "text-gray-900"
                  )}
                >
                  § {String(mark.section).padStart(digits, "0")}
                </span>
                <span
                  aria-hidden="true"
                  className={cn(
                    "h-px w-4 shrink-0",
                    current ? "bg-gray-1000" : "bg-gray-alpha-400"
                  )}
                />
              </span>
              {!compact && (
                <span
                  className={cn(
                    "block translate-y-1 pt-2 opacity-0 transition-[opacity,translate] duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-y-0 group-hover:opacity-100 group-focus-visible:translate-y-0 group-focus-visible:opacity-100 motion-reduce:translate-none motion-reduce:transition-none",
                    current && "translate-y-0 opacity-100"
                  )}
                >
                  <span className="line-clamp-2 text-label-12 text-gray-900">
                    {mark.label}
                  </span>
                  <span
                    aria-hidden="true"
                    className={cn(
                      "relative mt-2 block h-px overflow-hidden bg-gray-alpha-400",
                      !current && "invisible"
                    )}
                  >
                    <span
                      className="absolute inset-0 origin-right bg-gray-1000"
                      style={{ transform: `scaleX(${progress})` }}
                    />
                  </span>
                </span>
              )}
            </button>
          </div>
        )
      })}
    </aside>
  )
}
