"use client"

import { motion, useReducedMotion } from "framer-motion"
import { useEffect, useState } from "react"

import { track } from "@/lib/analytics/events"
import { tap as tapSound } from "@/lib/audio"
import type { TocItem } from "@/lib/content"
import { useScrollSpy } from "@/lib/hooks/use-scroll-spy"
import { cn } from "@/lib/utils"

const TOC_ITEM_H = 28
// The 720px column centred in the page's 1120px leaves 200px beside it, and
// only once the page has its full width: 1120 plus the 24px gutters.
const TOC_MIN_WIDTH = 1168

export function Toc({ slug, items }: { slug: string; items: TocItem[] }) {
  const reduced = useReducedMotion() ?? false
  const [wide, setWide] = useState(false)
  const { active, scrollToId } = useScrollSpy({
    ids: items.map((it) => it.id),
    topOffset: 96,
  })

  useEffect(() => {
    const setW = () => setWide(window.innerWidth >= TOC_MIN_WIDTH)
    setW()
    window.addEventListener("resize", setW)
    return () => window.removeEventListener("resize", setW)
  }, [])

  if (!wide || items.length === 0) return null

  return (
    // The padding puts the first 28px row on the centre of the body's first
    // line, which starts 48px down.
    <aside
      aria-label="Contents"
      className="absolute top-0 right-0 h-full w-49 pt-11.5"
    >
      <motion.nav
        initial={reduced ? false : { opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={reduced ? { duration: 0 } : { duration: 0.4, delay: 0.15 }}
        className="sticky top-32 flex flex-col pl-3"
      >
        {items.map((it, i) => (
          <a
            key={it.id}
            href={`#${it.id}`}
            aria-current={i === active ? "true" : undefined}
            onClick={(e) => {
              e.preventDefault()
              tapSound()
              scrollToId(it.id)
              track("toc link clicked", { slug, heading: it.label })
            }}
            style={{ height: TOC_ITEM_H }}
            className={cn(
              "flex items-center text-label-14 no-underline transition-colors duration-200",
              i === active
                ? "text-gray-1000"
                : "text-gray-900 hover:text-gray-1000"
            )}
          >
            <span className="truncate">{it.label}</span>
          </a>
        ))}
      </motion.nav>
    </aside>
  )
}
