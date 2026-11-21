"use client"

import { motion, useReducedMotion } from "framer-motion"
import { useId, useRef, useState } from "react"

import { track } from "@/lib/analytics/events"
import { tap as tapSound } from "@/lib/audio"
import { useScrollSpy } from "@/lib/hooks/use-scroll-spy"
import { cn } from "@/lib/utils"

import type { TocVariantProps } from "../types"

const ROW_HEIGHT = 32

export default function FocusToc({ slug, items: all }: TocVariantProps) {
  const items = all.filter((item) => item.depth === 2)
  const reduced = useReducedMotion() ?? false
  const [hovered, setHovered] = useState(false)
  const [focused, setFocused] = useState(false)
  const links = useRef<(HTMLAnchorElement | null)[]>([])
  const hintId = useId()
  const { active, scrollToId } = useScrollSpy({
    ids: items.map((item) => item.id),
    topOffset: 96,
  })
  const half = Math.min(3, Math.max(0, items.length - 1))
  const clear = hovered || focused
  const transition = reduced
    ? { duration: 0 }
    : { type: "spring" as const, stiffness: 260, damping: 32 }

  if (items.length === 0) return null

  const go = (index: number) => {
    const item = items[index]
    if (!item) return
    tapSound()
    scrollToId(item.id)
    track("toc link clicked", { slug, heading: item.label })
  }

  return (
    <aside className="absolute end-0 top-0 hidden h-full w-49 pt-11.5 min-[1168px]:block">
      <nav
        aria-label="Contents"
        aria-describedby={hintId}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        onFocusCapture={() => setFocused(true)}
        onBlurCapture={(e) => {
          if (!e.currentTarget.contains(e.relatedTarget)) setFocused(false)
        }}
        onKeyDown={(e) => {
          if (e.key !== "ArrowUp" && e.key !== "ArrowDown") return
          if (e.metaKey || e.ctrlKey || e.altKey) return
          e.preventDefault()
          const from = links.current.indexOf(
            document.activeElement as HTMLAnchorElement
          )
          const next = Math.max(
            0,
            Math.min(
              items.length - 1,
              (from < 0 ? active : from) + (e.key === "ArrowDown" ? 1 : -1)
            )
          )
          if (next === from) return
          go(next)
          links.current[next]?.focus({ preventScroll: true })
        }}
        className="sticky top-48 ps-2"
      >
        <p id={hintId} className="sr-only">
          Use the up and down arrow keys to move between sections.
        </p>
        <div className="mb-3 flex items-center justify-between ps-3 pe-3 text-label-13-mono text-gray-900">
          <span>Contents</span>
          <span className="tabular-nums">
            {String(active + 1).padStart(2, "0")}/
            {String(items.length).padStart(2, "0")}
          </span>
        </div>
        <div
          className="relative isolate overflow-hidden"
          style={{
            height: (half * 2 + 1) * ROW_HEIGHT,
            maskImage:
              half === 0
                ? undefined
                : "linear-gradient(to bottom, transparent, black 14%, black 86%, transparent)",
          }}
        >
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-1 rounded-md bg-gray-alpha-100"
            style={{ top: half * ROW_HEIGHT, height: ROW_HEIGHT }}
          />
          <motion.ol
            initial={false}
            animate={{ y: (half - active) * ROW_HEIGHT }}
            transition={transition}
            className="relative m-0 list-none p-0"
          >
            {items.map((item, index) => {
              const distance = Math.min(4, Math.abs(index - active))
              return (
                <motion.li
                  key={item.id}
                  initial={false}
                  animate={{
                    opacity:
                      clear || reduced ? 1 : Math.max(0.2, 1 - distance * 0.22),
                    filter:
                      reduced || clear
                        ? "blur(0px)"
                        : `blur(${Math.min(2, distance * 0.55)}px)`,
                    scale: reduced || clear ? 1 : 1 - distance * 0.035,
                  }}
                  transition={reduced ? { duration: 0 } : { duration: 0.2 }}
                  className="origin-center px-1"
                  style={{ height: ROW_HEIGHT }}
                >
                  <a
                    ref={(element) => {
                      links.current[index] = element
                    }}
                    href={`#${item.id}`}
                    title={item.label}
                    tabIndex={index === active ? 0 : -1}
                    aria-current={index === active ? "location" : undefined}
                    onClick={(e) => {
                      if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey)
                        return
                      e.preventDefault()
                      go(index)
                    }}
                    className={cn(
                      "flex h-8 items-center rounded-md border border-transparent ps-3 pe-3 text-label-13 no-underline transition-colors hover:bg-gray-alpha-200 hover:text-gray-1000 focus-visible:border-gray-600 focus-visible:ring-3 focus-visible:ring-gray-600/50 focus-visible:outline-none",
                      index === active ? "text-gray-1000" : "text-gray-900"
                    )}
                  >
                    <span className="truncate">{item.label}</span>
                  </a>
                </motion.li>
              )
            })}
          </motion.ol>
        </div>
      </nav>
    </aside>
  )
}
