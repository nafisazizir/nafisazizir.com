"use client"

import { motion, useReducedMotion } from "framer-motion"
import { useState } from "react"

import { track } from "@/lib/analytics/events"
import { tap as tapSound } from "@/lib/audio"
import { cn } from "@/lib/utils"

import type { TocVariantProps } from "../types"
import {
  WIDE,
  activeIndex,
  progressOf,
  scrollToSection,
  useMedia,
  useReading,
} from "./ticks-minimap"

const PITCH = 28

/**
 * Dots: a dot per heading on a hairline, after Linear's changelog. The line
 * fills down from the first dot as the post is read, reaching each dot as its
 * section starts; dots behind are filled, the current one is ringed and only
 * its name shows. Pointing at the column (or tabbing into it) brings every
 * name out, so it reads as a full list when it's needed and as a quiet
 * progress line when it isn't. Hidden below 1168px, where there's no gutter
 * to hold it.
 */
export default function DotsToc({ slug, items }: TocVariantProps) {
  const wide = useMedia(WIDE)
  const reduced = useReducedMotion() ?? false
  const reading = useReading(items.map((it) => it.id))
  const [hover, setHover] = useState<number | null>(null)
  const [expanded, setExpanded] = useState(false)

  if (!wide || items.length === 0 || !reading) return null

  const { sections, line, metrics } = reading
  const reached = line >= sections[0].start
  const active = reached ? activeIndex(sections, line) : -1
  const fill = reached
    ? Math.min(
        (active + progressOf(sections[active], line)) * PITCH,
        (items.length - 1) * PITCH
      )
    : 0
  const named = Math.max(active, 0)

  return (
    <aside
      aria-label="Contents"
      className="absolute end-0 top-0 h-full w-49 pt-11.5"
    >
      <motion.nav
        initial={reduced ? false : { opacity: 0, y: 4 }}
        animate={{ opacity: 1, y: 0 }}
        transition={reduced ? { duration: 0 } : { duration: 0.4, delay: 0.15 }}
        onPointerEnter={(e) => e.pointerType === "mouse" && setExpanded(true)}
        onPointerLeave={(e) => e.pointerType === "mouse" && setExpanded(false)}
        onFocus={() => setExpanded(true)}
        onBlur={(e) => {
          if (!e.currentTarget.contains(e.relatedTarget as Node | null)) {
            setExpanded(false)
          }
        }}
        className="sticky top-32 flex flex-col"
      >
        {items.length > 1 && (
          <>
            <span
              aria-hidden
              style={{ top: PITCH / 2, height: (items.length - 1) * PITCH }}
              className="absolute start-3 w-px -translate-x-1/2 bg-gray-alpha-400"
            />
            <span
              aria-hidden
              style={{ top: PITCH / 2, height: fill }}
              className="absolute start-3 w-px -translate-x-1/2 bg-gray-1000"
            />
          </>
        )}
        {items.map((it, i) => {
          const isActive = i === active
          const lit = expanded || i === named || i === hover
          return (
            <a
              key={it.id}
              href={`#${it.id}`}
              title={it.label}
              aria-current={isActive ? "true" : undefined}
              onClick={(e) => {
                e.preventDefault()
                tapSound()
                scrollToSection(sections[i], metrics, reduced)
                track("toc link clicked", { slug, heading: it.label })
              }}
              onPointerEnter={() => setHover(i)}
              onPointerLeave={() => setHover(null)}
              onFocus={() => setHover(i)}
              onBlur={() => setHover(null)}
              style={{ height: PITCH }}
              className="group relative flex items-center no-underline focus-visible:outline-none"
            >
              <span className="flex w-6 shrink-0 justify-center">
                <span
                  aria-hidden
                  className={cn(
                    "relative rounded-full border transition-[background-color,border-color,box-shadow,scale] duration-300 ease-out group-focus-visible:ring-3 group-focus-visible:ring-gray-600/50 motion-reduce:transition-none",
                    it.depth === 3 ? "size-1.5" : "size-2",
                    isActive
                      ? "scale-125 border-gray-1000 bg-gray-1000 ring-4 ring-gray-alpha-300"
                      : i < active
                        ? "border-gray-1000 bg-gray-1000"
                        : "border-gray-alpha-500 bg-background-100 group-hover:border-gray-alpha-600"
                  )}
                />
              </span>
              <span
                className={cn(
                  "absolute end-0 top-1.5 text-label-13 transition-[opacity,translate,color] duration-200 ease-out motion-reduce:transition-none",
                  it.depth === 3 ? "start-10" : "start-8",
                  expanded ? "truncate" : "line-clamp-2",
                  lit
                    ? "translate-x-0 opacity-100"
                    : "-translate-x-1 opacity-0",
                  isActive || i === hover || (!reached && i === named)
                    ? "text-gray-1000"
                    : "text-gray-900"
                )}
              >
                {it.label}
              </span>
            </a>
          )
        })}
      </motion.nav>
    </aside>
  )
}
