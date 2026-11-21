"use client"

import { IconListDetails } from "@tabler/icons-react"
import { motion, useReducedMotion } from "framer-motion"
import { useEffect, useId, useRef, useState } from "react"

import { track } from "@/lib/analytics/events"
import { tap } from "@/lib/audio"
import { useScrollSpy } from "@/lib/hooks/use-scroll-spy"
import { cn } from "@/lib/utils"

import type { TocVariantProps } from "../types"

type Row = { x: number; top: number; height: number }

export default function ClerkToc({ slug, items }: TocVariantProps) {
  const reduced = useReducedMotion() ?? false
  const clipId = useId()
  const [wide, setWide] = useState(false)
  const [geometry, setGeometry] = useState<{
    path: string
    height: number
    rows: Row[]
  }>({ path: "", height: 0, rows: [] })
  const [edges, setEdges] = useState({ top: false, bottom: false })
  const listRef = useRef<HTMLDivElement>(null)
  const rowsRef = useRef<HTMLUListElement>(null)
  const { active, scrollToId } = useScrollSpy({
    ids: items.map((item) => item.id),
    topOffset: 96,
  })
  const itemsKey = items.map((item) => `${item.id}:${item.depth}`).join("|")

  useEffect(() => {
    const resize = () => setWide(window.innerWidth >= 1168)
    resize()
    window.addEventListener("resize", resize)
    return () => window.removeEventListener("resize", resize)
  }, [])

  useEffect(() => {
    const list = listRef.current
    const rows = rowsRef.current
    if (!list || !rows) return
    let disposed = false
    const updateEdges = () =>
      setEdges({
        top: list.scrollTop > 1,
        bottom: list.scrollTop + list.clientHeight < list.scrollHeight - 1,
      })
    const measure = () => {
      if (disposed) return
      const measured = Array.from(rows.children, (element) => {
        const row = element as HTMLLIElement
        return {
          x: row.dataset.depth === "3" ? 18 : 4,
          top: row.offsetTop,
          height: row.offsetHeight,
        }
      })
      let path = ""
      measured.forEach((row, index) => {
        if (index === 0) path = `M ${row.x} ${row.top}`
        else if (row.x !== measured[index - 1].x) {
          path += ` V ${row.top - 7} L ${row.x} ${row.top + 7}`
        }
        path += ` V ${row.top + row.height - (measured[index + 1] && measured[index + 1].x !== row.x ? 7 : 0)}`
      })
      setGeometry({ path, height: rows.offsetHeight, rows: measured })
      updateEdges()
    }
    const observer = new ResizeObserver(measure)
    observer.observe(rows)
    observer.observe(list)
    document.fonts.ready.then(measure)
    document.fonts.addEventListener("loadingdone", measure)
    window.addEventListener("resize", measure)
    list.addEventListener("scroll", updateEdges, { passive: true })
    measure()
    return () => {
      disposed = true
      observer.disconnect()
      document.fonts.removeEventListener("loadingdone", measure)
      window.removeEventListener("resize", measure)
      list.removeEventListener("scroll", updateEdges)
    }
  }, [itemsKey, wide])

  useEffect(() => {
    const list = listRef.current
    const row = geometry.rows[active]
    if (!list || !row) return
    const start = row.top - 8
    const end = row.top + row.height + 8
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
  }, [active, geometry, reduced])

  if (!wide || items.length === 0) return null

  const row = geometry.rows[active]
  const spring = reduced
    ? { duration: 0 }
    : { type: "spring" as const, stiffness: 420, damping: 38 }

  return (
    <aside className="absolute end-0 top-0 h-full w-49 pt-11.5">
      <motion.nav
        aria-label="On this page"
        initial={reduced ? false : { opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={reduced ? { duration: 0 } : { duration: 0.4, delay: 0.15 }}
        className="sticky top-[calc(var(--nav-band)+2rem)] ps-4"
      >
        <p className="mb-4 flex items-center gap-2 text-label-12 text-gray-900">
          <IconListDetails aria-hidden="true" className="size-3.5" />
          On this page
        </p>
        <div
          ref={listRef}
          className="max-h-[calc(100dvh-var(--nav-band)-8rem)] [scrollbar-width:none] overflow-y-auto overscroll-contain [&::-webkit-scrollbar]:hidden"
          style={{
            maskImage: `linear-gradient(to bottom, ${edges.top ? "transparent" : "black"}, black 8px, black calc(100% - 8px), ${edges.bottom ? "transparent" : "black"})`,
          }}
        >
          <div className="relative">
            <svg
              aria-hidden="true"
              width="24"
              height={geometry.height}
              className="pointer-events-none absolute start-0 top-0 overflow-visible fill-none"
            >
              <defs>
                <clipPath id={clipId} clipPathUnits="userSpaceOnUse">
                  <motion.rect
                    x="0"
                    y="0"
                    width="24"
                    initial={false}
                    animate={{ height: row ? row.top + row.height : 0 }}
                    transition={spring}
                  />
                </clipPath>
              </defs>
              <path
                d={geometry.path}
                className="stroke-gray-alpha-400"
                strokeWidth="1"
              />
              <path
                d={geometry.path}
                clipPath={`url(#${clipId})`}
                className="stroke-gray-1000"
                strokeWidth="2"
              />
              {row && (
                <motion.circle
                  initial={false}
                  animate={{ cx: row.x, cy: row.top + row.height / 2 }}
                  transition={spring}
                  r="2.5"
                  strokeWidth="1.5"
                  className="fill-background-100 stroke-gray-1000"
                />
              )}
            </svg>
            <ul ref={rowsRef} className="relative m-0 list-none p-0">
              {items.map((item, index) => (
                <li key={item.id} data-depth={item.depth}>
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
                      "block rounded-sm border border-transparent py-2 ps-5 pe-1 no-underline transition-colors outline-none focus-visible:border-gray-600 focus-visible:ring-3 focus-visible:ring-gray-600/50 focus-visible:ring-inset",
                      item.depth === 3
                        ? "ps-8.5 text-label-12"
                        : "text-label-13",
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
        </div>
      </motion.nav>
    </aside>
  )
}
