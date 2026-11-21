"use client"

import { AnimatePresence, motion, useReducedMotion } from "framer-motion"
import { useEffect, useRef, useState } from "react"

import { track } from "@/lib/analytics/events"
import { tap as tapSound } from "@/lib/audio"
import { useScrollSpy } from "@/lib/hooks/use-scroll-spy"
import { cn } from "@/lib/utils"

import type { TocVariantProps } from "../types"
import { HEADING_OFFSET, WIDE, useMedia } from "./ticks-minimap"

// One dash per heading, 10px apart: the article's shape at a glance.
const PITCH = 10
const PAD_Y = 12

/**
 * Ticks: a column of dashes at the edge of the page, one per heading, the
 * one being read drawn long and bright and the ones already read a step
 * dimmer. Pointing at it (or tabbing to it) lifts a menu out of the column
 * with every heading as a link, each row ending in the dash it came from.
 * Below 1168px the column moves into the page's right margin, centred on the
 * screen, and opens with a tap.
 */
export default function TicksToc({ slug, items }: TocVariantProps) {
  const wide = useMedia(WIDE)
  const reduced = useReducedMotion() ?? false
  const { active, scrollToId } = useScrollSpy({
    ids: items.map((it) => it.id),
    topOffset: HEADING_OFFSET,
  })
  const [open, setOpen] = useState(false)
  const rootRef = useRef<HTMLDivElement>(null)
  const buttonRef = useRef<HTMLButtonElement>(null)
  const listRef = useRef<HTMLDivElement>(null)
  const closeTimer = useRef<number | null>(null)

  const cancelClose = () => {
    if (closeTimer.current != null) window.clearTimeout(closeTimer.current)
    closeTimer.current = null
  }

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return
      // Focus first: returning it fires the wrapper's onFocus, which opens.
      buttonRef.current?.focus()
      setOpen(false)
    }
    const onDown = (e: PointerEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false)
    }
    window.addEventListener("keydown", onKey)
    window.addEventListener("pointerdown", onDown)
    return () => {
      window.removeEventListener("keydown", onKey)
      window.removeEventListener("pointerdown", onDown)
    }
  }, [open])

  // Opening on a long post lands the list on the section being read.
  useEffect(() => {
    if (!open) return
    const row = listRef.current?.querySelector<HTMLElement>(
      "[aria-current='true']"
    )
    row?.scrollIntoView({ block: "nearest" })
  }, [open])

  useEffect(() => cancelClose, [])

  if (items.length === 0) return null

  const height = items.length * PITCH + PAD_Y * 2

  return (
    <aside
      aria-label="Contents"
      className={cn(
        "absolute top-0 z-40 h-full",
        wide ? "end-0 pt-11.5" : "-end-5 md:-end-6"
      )}
    >
      <div
        ref={rootRef}
        className="sticky"
        style={{ top: wide ? 128 : `calc(50vh - ${height / 2}px)` }}
        onPointerEnter={(e) => {
          if (e.pointerType !== "mouse") return
          cancelClose()
          setOpen(true)
        }}
        onPointerLeave={(e) => {
          if (e.pointerType !== "mouse") return
          cancelClose()
          closeTimer.current = window.setTimeout(() => setOpen(false), 160)
        }}
        onFocus={() => setOpen(true)}
        onBlur={(e) => {
          if (!e.currentTarget.contains(e.relatedTarget as Node | null)) {
            setOpen(false)
          }
        }}
      >
        <motion.button
          ref={buttonRef}
          type="button"
          aria-expanded={open}
          aria-label="Contents"
          onClick={() => setOpen(true)}
          initial={reduced ? false : { opacity: 0, x: 6 }}
          animate={{ opacity: open ? 0 : 1, x: 0 }}
          transition={
            reduced ? { duration: 0 } : { duration: 0.25, ease: "easeOut" }
          }
          style={{ paddingBlock: PAD_Y }}
          className={cn(
            "flex cursor-pointer flex-col items-end rounded-md focus-visible:outline-none",
            wide ? "w-12 pe-0.5" : "w-6 pe-1"
          )}
        >
          {items.map((it, i) => (
            <span
              key={it.id}
              aria-hidden
              style={{ height: PITCH }}
              className="flex items-center"
            >
              <span
                className={cn(
                  "h-0.5 rounded-full transition-[width,background-color] duration-300 ease-out motion-reduce:transition-none",
                  dashWidth(it.depth, i === active, wide),
                  dashColor(i, active)
                )}
              />
            </span>
          ))}
        </motion.button>

        <AnimatePresence>
          {open && (
            <motion.div
              key="card"
              initial={
                reduced ? { opacity: 0 } : { opacity: 0, x: 8, scale: 0.97 }
              }
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={
                reduced ? { opacity: 0 } : { opacity: 0, x: 8, scale: 0.97 }
              }
              transition={
                reduced ? { duration: 0 } : { duration: 0.18, ease: "easeOut" }
              }
              style={{ transformOrigin: wide ? "top right" : "center right" }}
              className={cn(
                "absolute end-0 flex w-56 flex-col material-menu p-1",
                wide ? "top-0" : "top-1/2 -translate-y-1/2"
              )}
            >
              <div className="flex items-center justify-between px-2 pt-1.5 pb-1">
                <span className="text-label-12 text-gray-900">
                  On this page
                </span>
                <span className="text-label-12-mono text-gray-900">
                  {String(active + 1).padStart(2, "0")}/
                  {String(items.length).padStart(2, "0")}
                </span>
              </div>
              <div
                ref={listRef}
                className="flex max-h-[min(34rem,calc(100vh-12rem))] flex-col overflow-y-auto overscroll-contain"
              >
                {items.map((it, i) => (
                  <a
                    key={it.id}
                    href={`#${it.id}`}
                    title={it.label}
                    aria-current={i === active ? "true" : undefined}
                    onClick={(e) => {
                      e.preventDefault()
                      tapSound()
                      scrollToId(it.id)
                      track("toc link clicked", { slug, heading: it.label })
                      if (!wide) setOpen(false)
                    }}
                    className={cn(
                      "flex min-h-7 shrink-0 items-center gap-3 rounded-md py-1.5 pe-2 text-label-13 no-underline transition-colors focus-visible:ring-3 focus-visible:ring-gray-600/50 focus-visible:outline-none",
                      it.depth === 3 ? "ps-5" : "ps-2",
                      i === active
                        ? "bg-gray-alpha-200 text-gray-1000"
                        : "text-gray-900 hover:bg-gray-alpha-100 hover:text-gray-1000"
                    )}
                  >
                    <span className="line-clamp-2 min-w-0 flex-1">
                      {it.label}
                    </span>
                    <span
                      aria-hidden
                      className={cn(
                        "h-0.5 shrink-0 rounded-full",
                        dashWidth(it.depth, i === active, true),
                        dashColor(i, active)
                      )}
                    />
                  </a>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </aside>
  )
}

function dashWidth(depth: 2 | 3, isActive: boolean, wide: boolean) {
  if (wide) return isActive ? "w-6" : depth === 3 ? "w-2" : "w-3.5"
  return isActive ? "w-3" : depth === 3 ? "w-1" : "w-2"
}

function dashColor(i: number, active: number) {
  if (i === active) return "bg-gray-1000"
  return i < active ? "bg-gray-700" : "bg-gray-alpha-500"
}
