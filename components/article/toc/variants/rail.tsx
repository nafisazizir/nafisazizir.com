"use client"

import { IconArrowUp } from "@tabler/icons-react"
import { motion, useReducedMotion } from "framer-motion"
import { useEffect, useRef, useState } from "react"

import { track } from "@/lib/analytics/events"
import { tap } from "@/lib/audio"
import { useScrollSpy } from "@/lib/hooks/use-scroll-spy"
import { cn } from "@/lib/utils"

import type { TocVariantProps } from "../types"

export default function RailToc({ slug, items }: TocVariantProps) {
  const reduced = useReducedMotion() ?? false
  const [wide, setWide] = useState(false)
  const [pastTop, setPastTop] = useState(false)
  const [bar, setBar] = useState({ top: 0, height: 0 })
  const [edges, setEdges] = useState({ top: false, bottom: false })
  const listRef = useRef<HTMLDivElement>(null)
  const rowsRef = useRef<HTMLUListElement>(null)
  const { active, scrollToId } = useScrollSpy({
    ids: items.map((item) => item.id),
    topOffset: 96,
  })
  const itemsKey = items.map((item) => item.id).join("|")

  useEffect(() => {
    const resize = () => setWide(window.innerWidth >= 1168)
    const scroll = () => setPastTop(window.scrollY > 400)
    resize()
    scroll()
    window.addEventListener("resize", resize)
    window.addEventListener("scroll", scroll, { passive: true })
    return () => {
      window.removeEventListener("resize", resize)
      window.removeEventListener("scroll", scroll)
    }
  }, [])

  useEffect(() => {
    const list = listRef.current
    const rows = rowsRef.current
    if (!list || !rows) return
    const row = rows.querySelectorAll<HTMLElement>("[data-rail-row]")[active]
    if (!row) return

    const measure = () => {
      setBar({ top: row.offsetTop, height: row.offsetHeight })
      const inset = 8
      const start = row.offsetTop - inset
      const end = row.offsetTop + row.offsetHeight + inset
      if (start < list.scrollTop) {
        list.scrollTo({
          top: Math.max(0, start),
          behavior: reduced ? "auto" : "smooth",
        })
      } else if (end > list.scrollTop + list.clientHeight) {
        list.scrollTo({
          top: end - list.clientHeight,
          behavior: reduced ? "auto" : "smooth",
        })
      }
      updateEdges()
    }
    const updateEdges = () =>
      setEdges({
        top: list.scrollTop > 1,
        bottom: list.scrollTop + list.clientHeight < list.scrollHeight - 1,
      })
    const observer = new ResizeObserver(measure)
    observer.observe(rows)
    observer.observe(list)
    list.addEventListener("scroll", updateEdges, { passive: true })
    measure()
    return () => {
      observer.disconnect()
      list.removeEventListener("scroll", updateEdges)
    }
  }, [active, itemsKey, reduced, wide])

  if (!wide || items.length === 0) return null

  return (
    <aside className="absolute end-0 top-0 h-full w-49 pt-11.5">
      <motion.nav
        aria-label="On this page"
        initial={reduced ? false : { opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={reduced ? { duration: 0 } : { duration: 0.4, delay: 0.15 }}
        className="sticky top-[calc(var(--nav-band)+2rem)] ps-4"
      >
        <p className="mb-4 text-label-12 text-gray-900">On this page</p>
        <div
          ref={listRef}
          className="max-h-[calc(100dvh-var(--nav-band)-11rem)] [scrollbar-width:none] overflow-y-auto overscroll-contain [&::-webkit-scrollbar]:hidden"
          style={{
            maskImage: `linear-gradient(to bottom, ${edges.top ? "transparent" : "black"}, black 8px, black calc(100% - 8px), ${edges.bottom ? "transparent" : "black"})`,
          }}
        >
          <ul ref={rowsRef} className="relative isolate m-0 list-none p-0">
            <li
              aria-hidden="true"
              className="pointer-events-none absolute inset-y-0 start-0 w-px bg-gray-alpha-400"
            />
            <motion.li
              aria-hidden="true"
              initial={false}
              animate={{ y: bar.top, height: bar.height }}
              transition={
                reduced
                  ? { duration: 0 }
                  : { type: "spring", stiffness: 420, damping: 38 }
              }
              className="pointer-events-none absolute start-0 top-0 w-0.5 bg-gray-1000"
            />
            {items.map((item, index) => (
              <li key={item.id} data-rail-row>
                <a
                  href={`#${item.id}`}
                  aria-current={active === index ? "location" : undefined}
                  onClick={(event) => {
                    event.preventDefault()
                    tap()
                    scrollToId(item.id)
                    track("toc link clicked", { slug, heading: item.label })
                  }}
                  className={cn(
                    "mx-1 block rounded-sm border border-transparent py-2 ps-3 pe-1 no-underline transition-colors outline-none focus-visible:border-gray-600 focus-visible:ring-3 focus-visible:ring-gray-600/50 focus-visible:ring-inset",
                    item.depth === 3 ? "ps-6 text-label-12" : "text-label-13",
                    active === index
                      ? "text-gray-1000"
                      : "text-gray-900 hover:text-gray-1000"
                  )}
                >
                  <span className="line-clamp-2">{item.label}</span>
                </a>
              </li>
            ))}
          </ul>
        </div>
        <motion.div
          initial={false}
          animate={{ opacity: pastTop ? 1 : 0 }}
          transition={{ duration: reduced ? 0 : 0.2 }}
          inert={!pastTop}
          className="mt-4 border-t border-gray-alpha-400 pt-3"
        >
          <button
            type="button"
            onClick={() => {
              tap()
              window.scrollTo({ top: 0, behavior: reduced ? "auto" : "smooth" })
            }}
            className="flex items-center gap-2 rounded-sm border border-transparent py-1 pe-2 text-label-12 text-gray-900 transition-colors outline-none hover:text-gray-1000 focus-visible:border-gray-600 focus-visible:ring-3 focus-visible:ring-gray-600/50"
          >
            <IconArrowUp aria-hidden="true" className="size-3.5" />
            Back to top
          </button>
        </motion.div>
      </motion.nav>
    </aside>
  )
}
