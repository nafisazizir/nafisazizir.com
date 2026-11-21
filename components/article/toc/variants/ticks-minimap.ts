"use client"

import { useEffect, useRef, useState } from "react"

// Shared by the minimap family (ticks, scrubber, dots): where each section of
// the article sits on the page, and how far the reader is through it.

/** The page's width at which the 200px gutters beside the prose exist. */
export const WIDE = "(min-width: 1168px)"

/** Where a heading lands when scrolled to: clear of the nav's band. */
export const HEADING_OFFSET = 96

export function useMedia(query: string): boolean {
  const [match, setMatch] = useState(false)
  useEffect(() => {
    const mq = window.matchMedia(query)
    const on = () => setMatch(mq.matches)
    on()
    mq.addEventListener("change", on)
    return () => mq.removeEventListener("change", on)
  }, [query])
  return match
}

export interface Section {
  /** The heading's id, or null for the text before the first heading. */
  id: string | null
  /** Document offsets, in px from the top of the page. */
  start: number
  end: number
}

export interface Metrics {
  vh: number
  max: number
  bodyTop: number
  bodyEnd: number
}

export interface Reading {
  sections: Section[]
  /** The reading line's document offset. */
  line: number
  scrollY: number
  metrics: Metrics
  /** Document offsets of the `marks` ids (e.g. h3s), in their order. */
  marks: number[]
}

// The reading line sits 30% down the viewport, the same line the scroll spy
// uses. Once the page can't scroll any further the line can't reach the end
// of the prose, so over the last screen of scroll it speeds up to land on the
// body's end exactly when the page bottoms out.
export function lineAt(scrollY: number, m: Metrics): number {
  const base = scrollY + m.vh * 0.3
  const short = m.bodyEnd - (m.max + m.vh * 0.3)
  if (short <= 0) return base
  const reach = Math.min(m.max, m.vh)
  const t = reach > 0 ? clamp(1 - (m.max - scrollY) / reach, 0, 1) : 1
  return base + short * t
}

/** The scroll offset whose reading line falls on `offset`. */
export function scrollForLine(offset: number, m: Metrics): number {
  let lo = 0
  let hi = m.max
  for (let i = 0; i < 24; i++) {
    const mid = (lo + hi) / 2
    if (lineAt(mid, m) < offset) lo = mid
    else hi = mid
  }
  return (lo + hi) / 2
}

export function clamp(v: number, lo: number, hi: number) {
  return Math.min(hi, Math.max(lo, v))
}

/** 0 before the section, 1 once read past it. */
export function progressOf(s: Section, line: number) {
  return clamp((line - s.start) / Math.max(1, s.end - s.start), 0, 1)
}

export function activeIndex(sections: Section[], line: number) {
  let idx = 0
  for (let i = 0; i < sections.length; i++) {
    if (sections[i].start <= line) idx = i
  }
  return idx
}

function measure(
  ids: string[],
  intro: boolean,
  markIds: string[]
): Reading | null {
  const heads = ids
    .map((id) => document.getElementById(id))
    .filter((el): el is HTMLElement => el !== null)
  if (heads.length !== ids.length) return null
  const body =
    heads[0]?.closest<HTMLElement>(".typeset") ??
    document.querySelector<HTMLElement>(".typeset")
  if (!body) return null
  const scrollY = window.scrollY
  const vh = window.innerHeight
  const max = Math.max(1, document.documentElement.scrollHeight - vh)
  const rect = body.getBoundingClientRect()
  const bodyTop = rect.top + scrollY
  const bodyEnd = rect.bottom + scrollY
  const tops = heads.map((el) => el.getBoundingClientRect().top + scrollY)
  const sections: Section[] = []
  // A lead-in shorter than a couple of lines isn't worth a section.
  if (intro && (tops[0] ?? bodyEnd) - bodyTop > 80) {
    sections.push({ id: null, start: bodyTop, end: tops[0] ?? bodyEnd })
  }
  tops.forEach((top, i) => {
    sections.push({ id: ids[i], start: top, end: tops[i + 1] ?? bodyEnd })
  })
  const marks = markIds.map(
    (id) =>
      (document.getElementById(id)?.getBoundingClientRect().top ?? 0) + scrollY
  )
  const metrics = { vh, max, bodyTop, bodyEnd }
  return { sections, line: lineAt(scrollY, metrics), scrollY, metrics, marks }
}

/**
 * Re-measures every frame the page scrolls or resizes. Reading a couple of
 * dozen rects without writing in between doesn't force extra layout, and it
 * keeps up with images and embeds that load late and push sections down.
 */
export function useReading(
  ids: string[],
  { intro = false, marks = [] }: { intro?: boolean; marks?: string[] } = {}
) {
  const key = ids.join("|")
  const marksKey = marks.join("|")
  const [reading, setReading] = useState<Reading | null>(null)
  const raf = useRef<number | null>(null)

  useEffect(() => {
    const list = key ? key.split("|") : []
    const markList = marksKey ? marksKey.split("|") : []
    const update = () => {
      if (raf.current != null) return
      raf.current = requestAnimationFrame(() => {
        raf.current = null
        setReading(measure(list, intro, markList))
      })
    }
    update()
    window.addEventListener("scroll", update, { passive: true })
    window.addEventListener("resize", update)
    const ro = new ResizeObserver(update)
    ro.observe(document.documentElement)
    const late = window.setTimeout(update, 300)
    return () => {
      window.removeEventListener("scroll", update)
      window.removeEventListener("resize", update)
      ro.disconnect()
      window.clearTimeout(late)
      if (raf.current != null) cancelAnimationFrame(raf.current)
      raf.current = null
    }
  }, [key, marksKey, intro])

  return reading
}

/** Scrolls so a section's heading (or the top of the prose) is in view. */
export function scrollToSection(s: Section, m: Metrics, reduced: boolean) {
  const top = s.id === null ? m.bodyTop : s.start
  window.scrollTo({
    top: clamp(top - HEADING_OFFSET, 0, m.max),
    behavior: reduced ? "instant" : "smooth",
  })
}

export interface Span {
  offset: number
  size: number
}

/**
 * Lays sections end to end along `size` px, each as long as its share of the
 * text but never shorter than `min`, with `gap` between them.
 */
export function layoutSpans(
  lengths: number[],
  size: number,
  gap: number,
  min: number
): Span[] {
  const n = lengths.length
  const total = lengths.reduce((a, b) => a + b, 0) || 1
  const free = Math.max(0, size - gap * (n - 1) - min * n)
  let offset = 0
  return lengths.map((len) => {
    const span = { offset, size: min + (free * len) / total }
    offset += span.size + gap
    return span
  })
}

/** The section under `pos` along the spans, and how far into it. */
export function spanAt(spans: Span[], pos: number, gap: number) {
  let i = 0
  while (
    i < spans.length - 1 &&
    pos > spans[i].offset + spans[i].size + gap / 2
  )
    i++
  const s = spans[i]
  return { index: i, fraction: clamp((pos - s.offset) / s.size, 0, 1) }
}
