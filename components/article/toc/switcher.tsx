"use client"

import {
  IconChevronLeft,
  IconChevronRight,
  IconListDetails,
} from "@tabler/icons-react"
import { useEffect, useState } from "react"

import { cn } from "@/lib/utils"

import { TOC_VARIANTS } from "./registry"
import { setTocVariant } from "./store"

const BUTTON =
  "flex size-8 items-center justify-center rounded-full text-gray-900 transition-colors hover:bg-gray-alpha-200 hover:text-gray-1000 focus-visible:ring-3 focus-visible:ring-gray-600/50 focus-visible:outline-none"

/**
 * A floating picker for comparing contents variants: bottom-right, out of the
 * way of every variant's own placement. `[` and `]` step through them.
 */
export function TocSwitcher({ activeId }: { activeId: string }) {
  const [open, setOpen] = useState(false)
  const index = Math.max(
    0,
    TOC_VARIANTS.findIndex((v) => v.id === activeId)
  )
  const active = TOC_VARIANTS[index]

  useEffect(() => {
    const step = (d: number) => {
      const n = TOC_VARIANTS.length
      setTocVariant(TOC_VARIANTS[(index + d + n) % n].id)
    }
    const onKey = (e: KeyboardEvent) => {
      const t = e.target as HTMLElement | null
      if (t?.closest("input, textarea, [contenteditable]")) return
      if (e.metaKey || e.ctrlKey || e.altKey) return
      if (e.key === "[") step(-1)
      if (e.key === "]") step(1)
      if (e.key === "Escape") setOpen(false)
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [index])

  const go = (d: number) => {
    const n = TOC_VARIANTS.length
    setTocVariant(TOC_VARIANTS[(index + d + n) % n].id)
  }

  return (
    <div className="fixed right-4 bottom-4 z-60 flex flex-col items-end gap-2">
      {open && (
        <div className="max-h-[70vh] w-80 overflow-y-auto material-menu p-1">
          {TOC_VARIANTS.map((v, i) => (
            <button
              key={v.id}
              type="button"
              onClick={() => setTocVariant(v.id)}
              className={cn(
                "flex w-full flex-col items-start gap-0.5 rounded-md px-2 py-1.5 text-start transition-colors hover:bg-gray-alpha-100",
                v.id === activeId && "bg-gray-alpha-200"
              )}
            >
              <span className="text-label-14 text-gray-1000">
                <span className="text-label-14-mono text-gray-900">
                  {String(i + 1).padStart(2, "0")}
                </span>{" "}
                {v.name}
              </span>
              <span className="text-copy-13 text-gray-900">
                {v.description}
              </span>
            </button>
          ))}
        </div>
      )}
      <div className="flex items-center gap-0.5 material-menu rounded-full p-0.5">
        <button
          type="button"
          aria-label="Previous contents variant"
          onClick={() => go(-1)}
          className={BUTTON}
        >
          <IconChevronLeft className="size-4" />
        </button>
        <button
          type="button"
          aria-expanded={open}
          onClick={() => setOpen((o) => !o)}
          className="flex h-8 items-center gap-2 rounded-full px-3 text-label-14 text-gray-1000 transition-colors hover:bg-gray-alpha-200 focus-visible:ring-3 focus-visible:ring-gray-600/50 focus-visible:outline-none"
        >
          <IconListDetails className="size-4 text-gray-900" />
          <span className="text-label-13-mono text-gray-900">
            {index + 1}/{TOC_VARIANTS.length}
          </span>
          {active.name}
        </button>
        <button
          type="button"
          aria-label="Next contents variant"
          onClick={() => go(1)}
          className={BUTTON}
        >
          <IconChevronRight className="size-4" />
        </button>
      </div>
    </div>
  )
}
