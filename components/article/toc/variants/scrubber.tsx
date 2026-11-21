"use client"

import { AnimatePresence, motion, useReducedMotion } from "framer-motion"
import {
  useEffect,
  useRef,
  useState,
  type MouseEvent,
  type PointerEvent,
} from "react"

import { track } from "@/lib/analytics/events"
import { tap as tapSound } from "@/lib/audio"
import { cn } from "@/lib/utils"

import type { TocVariantProps } from "../types"
import {
  WIDE,
  activeIndex,
  layoutSpans,
  progressOf,
  scrollForLine,
  scrollToSection,
  spanAt,
  useMedia,
  useReading,
  type Reading,
  type Span,
} from "./ticks-minimap"

const GAP = 3
const MIN = 6
const MOBILE_GAP = 2
const MOBILE_MIN = 3

/**
 * Scrubber: the article as a timeline. Each section is a segment as long as
 * its share of the text, filling as it's read, with a playhead at the reading
 * line and the section's name riding beside it. Point at a segment to see
 * what it is, click to jump to its heading, or grab the track and drag to
 * scrub through the post, a soft tick at every section boundary. Below
 * 1168px it becomes a floating bar at the bottom of the screen, scrubbed
 * sideways with a thumb.
 */
export default function ScrubberToc({ slug, items }: TocVariantProps) {
  const wide = useMedia(WIDE)
  const h2s = items.filter((it) => it.depth === 2)
  const h3s = items.filter((it) => it.depth === 3)
  const reading = useReading(
    h2s.map((it) => it.id),
    { intro: true, marks: h3s.map((it) => it.id) }
  )

  if (h2s.length === 0 || !reading) return null

  const labels = reading.sections.map((s) =>
    s.id === null
      ? "Introduction"
      : (h2s.find((it) => it.id === s.id)?.label ?? "")
  )
  const props = { slug, reading, labels }
  return wide ? <Vertical {...props} /> : <Horizontal {...props} />
}

interface ViewProps {
  slug: string
  reading: Reading
  labels: string[]
}

/**
 * Pointer handling shared by both tracks: hover names a segment, a press
 * that moves more than a few px becomes a drag that scrolls the page to the
 * matching point, and the click a drag ends on is swallowed.
 */
function useScrub(
  reading: Reading,
  spans: Span[],
  gap: number,
  axis: "x" | "y"
) {
  const [hover, setHover] = useState<number | null>(null)
  const [drag, setDrag] = useState<number | null>(null)
  const press = useRef<{ at: number; id: number; moved: boolean } | null>(null)
  const swallow = useRef(false)
  const last = useRef<number | null>(null)

  const posOf = (e: PointerEvent<HTMLElement>) => {
    const r = e.currentTarget.getBoundingClientRect()
    return axis === "y" ? e.clientY - r.top : e.clientX - r.left
  }

  const scrubTo = (pos: number) => {
    const { index, fraction } = spanAt(spans, pos, gap)
    const s = reading.sections[index]
    const offset = s.start + fraction * (s.end - s.start)
    window.scrollTo({
      top: scrollForLine(offset, reading.metrics),
      behavior: "instant",
    })
    if (last.current !== null && last.current !== index) tapSound()
    last.current = index
    setDrag(index)
  }

  return {
    hover,
    setHover,
    drag,
    handlers: {
      onPointerDown: (e: PointerEvent<HTMLElement>) => {
        if (e.button !== 0) return
        press.current = { at: posOf(e), id: e.pointerId, moved: false }
      },
      onPointerMove: (e: PointerEvent<HTMLElement>) => {
        const pos = posOf(e)
        const p = press.current
        if (p && (p.moved || Math.abs(pos - p.at) > 3)) {
          if (!p.moved) {
            p.moved = true
            last.current = null
            e.currentTarget.setPointerCapture(p.id)
          }
          scrubTo(pos)
        } else if (e.pointerType === "mouse") {
          setHover(spanAt(spans, pos, gap).index)
        }
      },
      onPointerUp: (e: PointerEvent<HTMLElement>) => {
        const p = press.current
        press.current = null
        if (!p?.moved) return
        e.currentTarget.releasePointerCapture(p.id)
        swallow.current = true
        window.setTimeout(() => (swallow.current = false), 0)
        setDrag(null)
      },
      onPointerCancel: () => {
        press.current = null
        setDrag(null)
      },
      onPointerLeave: () => setHover(null),
      onClickCapture: (e: MouseEvent) => {
        if (!swallow.current) return
        e.preventDefault()
        e.stopPropagation()
      },
    },
  }
}

function useJump(slug: string, reading: Reading, labels: string[]) {
  const reduced = useReducedMotion() ?? false
  return (i: number) => {
    tapSound()
    scrollToSection(reading.sections[i], reading.metrics, reduced)
    track("toc link clicked", { slug, heading: labels[i] })
  }
}

function Vertical({ slug, reading, labels }: ViewProps) {
  const reduced = useReducedMotion() ?? false
  const { sections, line, metrics, marks } = reading
  const size = Math.max(
    sections.length * (MIN + GAP),
    Math.min(416, metrics.vh - 340)
  )
  const spans = layoutSpans(
    sections.map((s) => s.end - s.start),
    size,
    GAP,
    MIN
  )
  const active = activeIndex(sections, line)
  const { hover, setHover, drag, handlers } = useScrub(reading, spans, GAP, "y")
  const jump = useJump(slug, reading, labels)

  const head =
    spans[active].offset +
    spans[active].size * progressOf(sections[active], line)
  const shown = drag ?? hover ?? active
  // The name rides the playhead through its own section, and jumps to the
  // top of any other segment pointed at.
  const labelY =
    shown === active
      ? Math.min(head, spans[active].offset + spans[active].size)
      : spans[shown].offset
  const pct = Math.round(
    progressOf(
      { id: null, start: metrics.bodyTop, end: metrics.bodyEnd },
      line
    ) * 100
  )

  return (
    <aside
      aria-label="Contents"
      className="absolute start-0 top-0 h-full w-49 pt-11.5"
    >
      <motion.nav
        initial={reduced ? false : { opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={reduced ? { duration: 0 } : { duration: 0.4, delay: 0.15 }}
        className="sticky top-32 flex flex-col"
      >
        <div className="flex h-7 items-center gap-2 pe-6">
          <span className="text-label-12 text-gray-900">Contents</span>
          <span className="ms-auto text-label-12-mono text-gray-900 tabular-nums">
            {pct}%
          </span>
        </div>
        <div
          {...handlers}
          style={{ height: size }}
          className={cn(
            "relative mt-2 touch-none select-none",
            drag !== null ? "cursor-grabbing" : "cursor-pointer"
          )}
        >
          {sections.map((s, i) => {
            const p = progressOf(s, line)
            return (
              <a
                key={s.id ?? "intro"}
                href={s.id ? `#${s.id}` : "#"}
                aria-current={i === active ? "true" : undefined}
                draggable={false}
                onClick={(e) => {
                  e.preventDefault()
                  jump(i)
                }}
                onFocus={() => setHover(i)}
                onBlur={() => setHover(null)}
                style={{ top: spans[i].offset, height: spans[i].size + GAP }}
                className="group absolute inset-x-0 focus-visible:outline-none"
              >
                <span className="sr-only">{labels[i]}</span>
                <span
                  aria-hidden
                  style={{ height: spans[i].size }}
                  className={cn(
                    "absolute start-0 top-0 w-1 overflow-hidden rounded-full transition-colors group-focus-visible:ring-3 group-focus-visible:ring-gray-600/50",
                    i === shown && i !== active
                      ? "bg-gray-alpha-500"
                      : "bg-gray-alpha-400"
                  )}
                >
                  <span
                    style={{ transform: `scaleY(${p})` }}
                    className={cn(
                      "absolute inset-0 origin-top rounded-full",
                      i === active ? "bg-gray-1000" : "bg-gray-700"
                    )}
                  />
                </span>
              </a>
            )
          })}
          {marks.map((m, j) => {
            const i = activeIndex(sections, m)
            const s = sections[i]
            const y =
              spans[i].offset +
              spans[i].size * ((m - s.start) / Math.max(1, s.end - s.start))
            return (
              <span
                key={j}
                aria-hidden
                style={{ top: y }}
                className={cn(
                  "pointer-events-none absolute start-2 h-px w-1.5",
                  m <= line ? "bg-gray-900" : "bg-gray-alpha-500"
                )}
              />
            )
          })}
          <span
            aria-hidden
            style={{ top: head - 1 }}
            className="pointer-events-none absolute -start-1 h-0.5 w-3 rounded-full bg-gray-1000"
          />
          <motion.div
            aria-hidden
            initial={false}
            animate={{ y: labelY - 9 }}
            transition={
              reduced
                ? { duration: 0 }
                : { type: "spring", stiffness: 700, damping: 50, mass: 0.6 }
            }
            className="pointer-events-none absolute start-5 end-2 top-0"
          >
            <AnimatePresence mode="popLayout" initial={false}>
              <motion.div
                key={shown}
                initial={reduced ? false : { opacity: 0, x: -4 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, transition: { duration: 0 } }}
                transition={{ duration: reduced ? 0 : 0.16 }}
                className="flex flex-col gap-0.5"
              >
                <span className="line-clamp-2 text-label-13 text-gray-1000">
                  {labels[shown]}
                </span>
                <span className="text-label-12-mono text-gray-900 tabular-nums">
                  {String(shown + 1).padStart(2, "0")}/
                  {String(sections.length).padStart(2, "0")}
                </span>
              </motion.div>
            </AnimatePresence>
          </motion.div>
        </div>
      </motion.nav>
    </aside>
  )
}

function Horizontal({ slug, reading, labels }: ViewProps) {
  const reduced = useReducedMotion() ?? false
  const { sections, line, metrics, scrollY } = reading
  const trackRef = useRef<HTMLDivElement>(null)
  const [width, setWidth] = useState(0)
  // Only over the prose: not on the header, not on the footer.
  const visible =
    line >= metrics.bodyTop && scrollY + metrics.vh * 0.4 < metrics.bodyEnd

  useEffect(() => {
    const el = trackRef.current
    if (!el) return
    const ro = new ResizeObserver(() => setWidth(el.clientWidth))
    ro.observe(el)
    return () => ro.disconnect()
  }, [visible])

  const spans = layoutSpans(
    sections.map((s) => s.end - s.start),
    width,
    MOBILE_GAP,
    MOBILE_MIN
  )
  const active = activeIndex(sections, line)
  const { drag, handlers } = useScrub(reading, spans, MOBILE_GAP, "x")
  const jump = useJump(slug, reading, labels)
  const shown = drag ?? active

  return (
    <AnimatePresence>
      {visible && (
        <motion.nav
          aria-label="Contents"
          initial={reduced ? { opacity: 0 } : { opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          exit={reduced ? { opacity: 0 } : { opacity: 0, y: 16 }}
          transition={
            reduced ? { duration: 0 } : { duration: 0.24, ease: "easeOut" }
          }
          className="fixed inset-x-4 bottom-4 z-40 mx-auto flex max-w-md flex-col gap-2 material-menu px-3.5 pt-2.5 pb-3"
        >
          <div className="flex items-center gap-3">
            <span className="text-label-12-mono text-gray-900 tabular-nums">
              {String(shown + 1).padStart(2, "0")}
            </span>
            <span className="min-w-0 flex-1 truncate text-label-13 text-gray-1000">
              {labels[shown]}
            </span>
            <span className="text-label-12-mono text-gray-900 tabular-nums">
              {String(sections.length).padStart(2, "0")}
            </span>
          </div>
          <div
            ref={trackRef}
            {...handlers}
            className="relative h-3 touch-none select-none"
          >
            {width > 0 &&
              sections.map((s, i) => (
                <a
                  key={s.id ?? "intro"}
                  href={s.id ? `#${s.id}` : "#"}
                  aria-label={labels[i]}
                  aria-current={i === active ? "true" : undefined}
                  draggable={false}
                  onClick={(e) => {
                    e.preventDefault()
                    jump(i)
                  }}
                  style={{
                    left: spans[i].offset,
                    width: spans[i].size + MOBILE_GAP,
                  }}
                  className="group absolute inset-y-0 flex items-center focus-visible:outline-none"
                >
                  <span
                    aria-hidden
                    style={{ width: spans[i].size }}
                    className="relative h-1 overflow-hidden rounded-full bg-gray-alpha-400 group-focus-visible:ring-3 group-focus-visible:ring-gray-600/50"
                  >
                    <span
                      style={{ transform: `scaleX(${progressOf(s, line)})` }}
                      className={cn(
                        "absolute inset-0 origin-left rounded-full",
                        i === active ? "bg-gray-1000" : "bg-gray-700"
                      )}
                    />
                  </span>
                </a>
              ))}
          </div>
        </motion.nav>
      )}
    </AnimatePresence>
  )
}
