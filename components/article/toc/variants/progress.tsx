"use client"

import { IconCheck, IconChevronUp } from "@tabler/icons-react"
import { useReducedMotion } from "framer-motion"
import { useEffect, useId, useMemo, useRef, useState } from "react"

import { track } from "@/lib/analytics/events"
import { tap as tapSound } from "@/lib/audio"
import { useScrollSpy } from "@/lib/hooks/use-scroll-spy"
import { cn } from "@/lib/utils"

import type { TocVariantProps } from "../types"

const FOCUS =
  "border border-transparent focus-visible:border-gray-600 focus-visible:ring-3 focus-visible:ring-gray-600/50 focus-visible:outline-none"
const clamp = (value: number) => Math.max(0, Math.min(1, value))

function readingMinutes(range: Range) {
  const fragment = range.cloneContents()
  const words =
    fragment.textContent?.trim().split(/\s+/).filter(Boolean).length ?? 0
  const images = fragment.querySelectorAll(
    "img, video, figure:not(:has(img, video))"
  ).length
  return words / 230 + images * 0.2
}

interface ReadingState {
  total: number
  remaining: number[]
  duration: number[]
  finished: boolean[]
  started: boolean
}

export default function ProgressToc({ slug, items: all }: TocVariantProps) {
  const items = useMemo(() => all.filter((item) => item.depth === 2), [all])
  const reduced = useReducedMotion() ?? false
  const { active, scrollToId } = useScrollSpy({
    ids: items.map((item) => item.id),
    topOffset: 96,
  })
  const [reading, setReading] = useState<ReadingState | null>(null)
  const [open, setOpen] = useState(false)
  const desktopFills = useRef<(HTMLSpanElement | null)[]>([])
  const sheetFills = useRef<(HTMLSpanElement | null)[]>([])
  const mobileFill = useRef<HTMLSpanElement>(null)
  const desktopList = useRef<HTMLOListElement>(null)
  const mobile = useRef<HTMLDivElement>(null)
  const trigger = useRef<HTMLButtonElement>(null)
  const sheet = useRef<HTMLDivElement>(null)
  const sheetId = useId()

  useEffect(() => {
    const headings = items.map((item) => document.getElementById(item.id))
    const body = headings[0]?.closest<HTMLElement>(".typeset")
    if (!body || headings.some((heading) => !heading)) return
    let sections: { start: number; end: number; minutes: number }[] = []
    let intro = { start: 0, end: 0, minutes: 0 }
    let frame = 0
    let needsMeasure = true
    let previous = ""

    const measure = () => {
      const bodyTop = body.getBoundingClientRect().top + window.scrollY
      const bodyEnd = body.getBoundingClientRect().bottom + window.scrollY
      sections = headings.map((heading, index) => {
        const element = heading!
        const next = headings[index + 1]
        const range = document.createRange()
        range.setStartBefore(element)
        if (next) range.setEndBefore(next)
        else range.setEnd(body, body.childNodes.length)
        return {
          start: element.getBoundingClientRect().top + window.scrollY,
          end: next
            ? next.getBoundingClientRect().top + window.scrollY
            : bodyEnd,
          minutes: Math.max(1, readingMinutes(range)),
        }
      })
      const range = document.createRange()
      range.setStart(body, 0)
      range.setEndBefore(headings[0]!)
      intro = {
        start: bodyTop,
        end: sections[0].start,
        minutes: readingMinutes(range),
      }
    }
    const update = () => {
      frame = 0
      if (needsMeasure) {
        measure()
        needsMeasure = false
      }
      const line = window.scrollY + Math.max(104, window.innerHeight * 0.3)
      const atEnd =
        window.scrollY + window.innerHeight >=
        document.documentElement.scrollHeight - 1
      const fractions = sections.map(({ start, end }) =>
        atEnd ? 1 : clamp((line - start) / Math.max(1, end - start))
      )
      fractions.forEach((fraction, index) => {
        for (const fill of [
          desktopFills.current[index],
          sheetFills.current[index],
        ]) {
          if (fill) fill.style.transform = `scaleX(${fraction})`
        }
      })
      if (mobileFill.current)
        mobileFill.current.style.transform = `scaleX(${fractions[active] ?? 0})`
      const remaining = sections.map((section, index) =>
        Math.ceil(section.minutes * (1 - fractions[index]))
      )
      const introLeft = atEnd
        ? 0
        : intro.minutes *
          (1 -
            clamp((line - intro.start) / Math.max(1, intro.end - intro.start)))
      const next: ReadingState = {
        total: Math.ceil(
          introLeft +
            sections.reduce(
              (sum, section, index) =>
                sum + section.minutes * (1 - fractions[index]),
              0
            )
        ),
        remaining,
        duration: sections.map((section) => Math.ceil(section.minutes)),
        finished: fractions.map((fraction) => fraction >= 1),
        started: line >= sections[0].start,
      }
      const key = JSON.stringify(next)
      if (key !== previous) {
        previous = key
        setReading(next)
      }
    }
    const request = () => {
      if (!frame) frame = requestAnimationFrame(update)
    }
    const resize = () => {
      needsMeasure = true
      request()
    }
    const observer = new ResizeObserver(resize)
    observer.observe(body)
    headings.forEach((heading) => observer.observe(heading!))
    window.addEventListener("scroll", request, { passive: true })
    window.addEventListener("resize", resize)
    request()
    return () => {
      observer.disconnect()
      window.removeEventListener("scroll", request)
      window.removeEventListener("resize", resize)
      cancelAnimationFrame(frame)
    }
  }, [items, active, open, reading?.started])

  useEffect(() => {
    const list = desktopList.current
    const row = list?.querySelector<HTMLElement>('[aria-current="location"]')
    if (!list || !row) return
    const top = row.offsetTop - list.offsetTop
    if (top < list.scrollTop) list.scrollTop = top
    else if (top + row.offsetHeight > list.scrollTop + list.clientHeight)
      list.scrollTop = top + row.offsetHeight - list.clientHeight
  }, [active, reading?.duration.length])

  useEffect(() => {
    if (!open) return
    sheet.current
      ?.querySelector<HTMLElement>('[aria-current="location"]')
      ?.focus()
    const outside = (e: PointerEvent) => {
      if (!mobile.current?.contains(e.target as Node)) setOpen(false)
    }
    const escape = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return
      setOpen(false)
      trigger.current?.focus({ preventScroll: true })
    }
    document.addEventListener("pointerdown", outside)
    document.addEventListener("keydown", escape)
    return () => {
      document.removeEventListener("pointerdown", outside)
      document.removeEventListener("keydown", escape)
    }
  }, [open])

  if (!items.length) return null

  const totalLabel = reading
    ? reading.total === 0
      ? "Done"
      : `${reading.total} min left`
    : "…"
  const currentMinutes = reading?.remaining[active] ?? 1
  const rows = (inSheet: boolean) =>
    items.map((item, index) => {
      const selected = index === active
      const finished = reading?.finished[index] ?? false
      return (
        <li key={item.id}>
          <a
            href={`#${item.id}`}
            aria-current={selected ? "location" : undefined}
            onClick={(e) => {
              if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return
              e.preventDefault()
              tapSound()
              scrollToId(item.id)
              track("toc link clicked", { slug, heading: item.label })
              setOpen(false)
              if (inSheet) trigger.current?.focus({ preventScroll: true })
            }}
            className={cn(
              FOCUS,
              "block rounded-md py-2 ps-2 pe-2 no-underline transition-colors hover:bg-gray-alpha-100",
              selected ? "text-gray-1000" : "text-gray-900"
            )}
          >
            <span className="flex items-start justify-between gap-2">
              <span className="line-clamp-2 text-label-13">{item.label}</span>
              <span className="shrink-0 text-label-12-mono text-gray-900 tabular-nums">
                {finished ? (
                  <>
                    <IconCheck aria-hidden="true" className="size-3.5" />
                    <span className="sr-only">Read</span>
                  </>
                ) : selected ? (
                  `${reading?.remaining[index] ?? 1}m left`
                ) : (
                  `${reading?.duration[index] ?? 1}m`
                )}
              </span>
            </span>
            <span
              aria-hidden="true"
              className="mt-2 block h-0.5 overflow-hidden rounded-full bg-gray-alpha-200"
            >
              <span
                ref={(element) => {
                  ;(inSheet ? sheetFills : desktopFills).current[index] =
                    element
                }}
                className={cn(
                  "block size-full origin-left rounded-full",
                  selected ? "bg-gray-1000" : "bg-gray-700"
                )}
                style={{
                  transform: finished ? "scaleX(1)" : "scaleX(0)",
                  transition: reduced ? "none" : "transform 100ms linear",
                }}
              />
            </span>
          </a>
        </li>
      )
    })

  return (
    <>
      <aside className="absolute end-0 top-0 hidden h-full w-49 pt-11.5 min-[1168px]:block">
        <nav aria-label="Contents" className="sticky top-32 ps-2">
          <div className="mb-3 flex items-center justify-between gap-2 ps-2 pe-2">
            <span className="text-label-13 text-gray-900">Contents</span>
            <span className="text-label-12-mono text-gray-900 tabular-nums">
              {totalLabel}
            </span>
          </div>
          <ol
            ref={desktopList}
            className="max-h-[calc(100dvh-14rem)] list-none space-y-0.5 overflow-y-auto overscroll-contain p-1"
          >
            {rows(false)}
          </ol>
        </nav>
      </aside>
      {reading?.started && (
        <div
          ref={mobile}
          className="fixed start-4 bottom-16 z-40 w-80 max-w-[calc(100vw-2rem)] min-[1168px]:hidden"
        >
          {open && (
            <div
              ref={sheet}
              id={sheetId}
              role="dialog"
              aria-label="Reading progress"
              className="mb-2 material-menu p-1"
            >
              <div className="flex items-center justify-between py-3 ps-3 pe-3">
                <span className="text-label-13 text-gray-900">Contents</span>
                <span className="text-label-13-mono text-gray-900 tabular-nums">
                  {totalLabel}
                </span>
              </div>
              <nav aria-label="Contents">
                <ol className="max-h-[55dvh] list-none overflow-y-auto overscroll-contain p-1">
                  {rows(true)}
                </ol>
              </nav>
            </div>
          )}
          <button
            ref={trigger}
            type="button"
            aria-expanded={open}
            aria-controls={sheetId}
            aria-haspopup="dialog"
            onClick={() => {
              tapSound()
              setOpen((value) => !value)
            }}
            className={cn(
              FOCUS,
              "relative flex h-10 w-full items-center gap-3 overflow-hidden material-menu rounded-full ps-4 pe-4 text-label-13 text-gray-1000 transition-colors hover:bg-gray-200"
            )}
          >
            <span className="truncate">{items[active].label}</span>
            <span className="ms-auto shrink-0 text-label-12-mono text-gray-900 tabular-nums">
              {currentMinutes === 0 ? "Done" : `${currentMinutes}m left`}
            </span>
            <IconChevronUp
              aria-hidden="true"
              className="size-3.5 shrink-0 text-gray-900"
            />
            <span
              aria-hidden="true"
              className="absolute inset-x-4 bottom-0 h-0.5 bg-gray-alpha-200"
            >
              <span
                ref={mobileFill}
                className="block size-full origin-left bg-gray-1000"
                style={{
                  transform: "scaleX(0)",
                  transition: reduced ? "none" : "transform 100ms linear",
                }}
              />
            </span>
          </button>
        </div>
      )}
    </>
  )
}
