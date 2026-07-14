"use client"

import { motion, useReducedMotion } from "framer-motion"
import { useEffect, useState } from "react"

import { tap as tapSound } from "@/lib/audio"
import type { TocItem } from "@/lib/content"
import { useScrollSpy } from "@/lib/hooks/use-scroll-spy"
import { cn } from "@/lib/utils"

const TOC_ITEM_H = 28

export function Toc({ items }: { items: TocItem[] }) {
  const reduced = useReducedMotion() ?? false
  const [wide, setWide] = useState(false)
  const { active, scrollToId } = useScrollSpy({
    ids: items.map((it) => it.id),
    topOffset: 96,
  })

  useEffect(() => {
    const setW = () => setWide(window.innerWidth >= 1080)
    setW()
    window.addEventListener("resize", setW)
    return () => window.removeEventListener("resize", setW)
  }, [])

  if (!wide || items.length === 0) return null

  return (
    <aside aria-label="Contents" className="absolute top-0 right-0 h-full w-49">
      <motion.nav
        initial={reduced ? false : { opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={reduced ? { duration: 0 } : { duration: 0.4, delay: 0.15 }}
        className="sticky top-32 mt-0 flex flex-col pl-3"
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
            }}
            style={{ height: TOC_ITEM_H }}
            className={cn(
              "flex items-center text-sm no-underline transition-colors duration-200",
              i === active
                ? "text-foreground"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            <span className="truncate">{it.label}</span>
          </a>
        ))}
      </motion.nav>
    </aside>
  )
}
