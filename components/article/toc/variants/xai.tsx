"use client"

import { useReducedMotion } from "framer-motion"
import { useEffect, useMemo, useRef, useState } from "react"

import { track } from "@/lib/analytics/events"
import { tap as tapSound } from "@/lib/audio"
import { useScrollSpy } from "@/lib/hooks/use-scroll-spy"
import { cn } from "@/lib/utils"

import type { TocVariantProps } from "../types"

type Section = { id: string; label: string; start: number; end: number }

export default function XaiToc({ slug, items }: TocVariantProps) {
  const headings = useMemo(
    () => items.filter((item) => item.depth === 2),
    [items]
  )
  const ids = useMemo(() => headings.map((item) => item.id), [headings])
  const { scrollToId } = useScrollSpy({ ids, topOffset: 96 })
  const reduced = useReducedMotion() ?? false
  const root = useRef<HTMLElement>(null)
  const [sections, setSections] = useState<Section[]>([])
  const [viewport, setViewport] = useState({ width: 0, height: 0 })
  const [reading, setReading] = useState(0)
  const [scrolling, setScrolling] = useState(false)

  useEffect(() => {
    const article = root.current?.closest("article")
    const prose = article?.querySelector(".typeset")
    if (!article || !prose || headings.length === 0) return
    let frame = 0
    let idle: ReturnType<typeof setTimeout>
    const measure = () => {
      const top = (element: Element) =>
        element.getBoundingClientRect().top + window.scrollY
      const end = top(prose) + prose.getBoundingClientRect().height
      const found = headings.flatMap((heading) => {
        const element = document.getElementById(heading.id)
        return element ? [{ ...heading, start: top(element) }] : []
      })
      const starts = [
        {
          id: "",
          label: article.querySelector("h1")?.textContent || "Introduction",
          start: top(article),
        },
        ...found,
      ]
      setSections(
        starts.map((section, i) => ({
          ...section,
          end: starts[i + 1]?.start ?? end,
        }))
      )
      setViewport({ width: window.innerWidth, height: window.innerHeight })
      setReading(window.scrollY + 96)
    }
    const onScroll = () => {
      setScrolling(true)
      clearTimeout(idle)
      idle = setTimeout(() => setScrolling(false), 1000)
      if (!frame)
        frame = requestAnimationFrame(() => {
          setReading(window.scrollY + 96)
          frame = 0
        })
    }
    const observer = new ResizeObserver(measure)
    observer.observe(article)
    observer.observe(prose)
    headings.forEach(({ id }) => {
      const element = document.getElementById(id)
      if (element) observer.observe(element)
    })
    measure()
    window.addEventListener("scroll", onScroll, { passive: true })
    window.addEventListener("resize", measure)
    article.addEventListener("load", measure, true)
    return () => {
      observer.disconnect()
      cancelAnimationFrame(frame)
      clearTimeout(idle)
      window.removeEventListener("scroll", onScroll)
      window.removeEventListener("resize", measure)
      article.removeEventListener("load", measure, true)
    }
  }, [headings])

  const height = viewport.height * 0.72
  const total = sections.length
    ? sections[sections.length - 1].end - sections[0].start
    : 1
  const usable = Math.max(0, height - Math.max(0, sections.length - 1) * 3)
  const segments = sections.map((section, i) => {
    const size =
      (Math.max(0, section.end - section.start) / Math.max(1, total)) * usable
    const top =
      ((section.start - sections[0].start) / Math.max(1, total)) * usable +
      i * 3
    return { ...section, top, size }
  })
  const spacing = Math.min(18, (height - 18) / Math.max(1, sections.length - 1))
  const labels: number[] = []
  segments.forEach((section, i) => {
    labels.push(Math.max(9, section.top, i ? labels[i - 1] + spacing : 0))
  })
  for (let i = labels.length - 1; i >= 0; i--) {
    labels[i] = Math.min(
      labels[i],
      i === labels.length - 1 ? height - 9 : labels[i + 1] - spacing
    )
  }

  return (
    <aside
      ref={root}
      aria-label="Contents"
      className={cn(
        "group pointer-events-none fixed end-0 top-[14vh] z-40 h-[72vh] w-70",
        (viewport.width < 1168 || !headings.length) && "hidden"
      )}
      style={{ display: headings.length ? undefined : "none" }}
    >
      <div className="pointer-events-auto absolute inset-y-0 end-0 w-35" />
      <div
        className="bg-linear-to-e absolute inset-x-0 -inset-y-10 from-transparent to-background-100 opacity-0 transition-opacity duration-220 group-focus-within:opacity-100 group-hover:opacity-100 motion-reduce:transition-none"
        style={{
          maskImage:
            "linear-gradient(to bottom, transparent, black 15%, black 85%, transparent)",
        }}
      />
      <div
        className={cn(
          "absolute inset-0 opacity-0 transition-opacity duration-220 group-focus-within:opacity-100 group-hover:opacity-100 motion-reduce:transition-none",
          scrolling && "opacity-100"
        )}
      >
        <button
          type="button"
          aria-label="Jump to a position in the article"
          className="pointer-events-auto absolute inset-y-0 end-3 w-6 cursor-pointer rounded-full border border-transparent outline-none focus-visible:border-gray-600 focus-visible:ring-3 focus-visible:ring-gray-600/50"
          onClick={(event) => {
            const bounds = event.currentTarget.getBoundingClientRect()
            const y = Math.max(0, Math.min(height, event.clientY - bounds.top))
            const section =
              segments.find((segment) => y <= segment.top + segment.size) ??
              segments[segments.length - 1]
            if (!section) return
            const fraction = Math.max(
              0,
              Math.min(1, (y - section.top) / Math.max(1, section.size))
            )
            tapSound()
            window.scrollTo({
              top: Math.max(
                0,
                section.start + fraction * (section.end - section.start) - 96
              ),
              behavior: reduced ? "auto" : "smooth",
            })
            track("toc link clicked", { slug, heading: section.label })
          }}
        >
          {segments.map((section) => {
            const progress = Math.max(
              0,
              Math.min(
                1,
                (reading - section.start) /
                  Math.max(1, section.end - section.start)
              )
            )
            return (
              <span
                key={section.id}
                aria-hidden="true"
                className="absolute start-1/2 w-0.5 -translate-x-1/2 overflow-hidden rounded-full bg-gray-alpha-400 transition-[width] duration-220 group-focus-within:w-1 group-hover:w-1 motion-reduce:transition-none"
                style={{ top: section.top, height: section.size }}
              >
                <span
                  className="absolute inset-x-0 top-0 rounded-full bg-gray-1000"
                  style={{ height: `${progress * 100}%` }}
                />
              </span>
            )
          })}
        </button>
      </div>
      {segments.map((section, i) => (
        <button
          key={section.id}
          type="button"
          title={section.label}
          aria-current={
            reading >= section.start && reading < section.end
              ? "location"
              : undefined
          }
          className={cn(
            "pointer-events-none absolute end-12 w-55 translate-x-1 truncate rounded-sm border border-transparent px-1 text-end text-label-12 opacity-0 transition-[opacity,transform,translate] duration-[220ms,260ms,260ms] ease-[cubic-bezier(0.16,1,0.3,1)] outline-none group-focus-within:pointer-events-auto group-focus-within:translate-x-0 group-focus-within:opacity-100 group-hover:pointer-events-auto group-hover:translate-x-0 group-hover:opacity-100 hover:text-gray-1000 focus-visible:border-gray-600 focus-visible:ring-3 focus-visible:ring-gray-600/50 motion-reduce:translate-none motion-reduce:transition-none",
            reading >= section.start ? "text-gray-1000" : "text-gray-900"
          )}
          style={{
            top: labels[i] - 9,
          }}
          onClick={() => {
            tapSound()
            if (section.id) scrollToId(section.id)
            else
              window.scrollTo({
                top: Math.max(0, section.start - 96),
                behavior: reduced ? "auto" : "smooth",
              })
            track("toc link clicked", { slug, heading: section.label })
          }}
        >
          {section.label}
        </button>
      ))}
    </aside>
  )
}
