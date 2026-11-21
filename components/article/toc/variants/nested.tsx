"use client"

import { IconArrowUp, IconChevronDown } from "@tabler/icons-react"
import {
  AnimatePresence,
  LayoutGroup,
  motion,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useSpring,
} from "framer-motion"
import { useEffect, useId, useRef, useState } from "react"

import { track } from "@/lib/analytics/events"
import { tap } from "@/lib/audio"
import { useScrollSpy } from "@/lib/hooks/use-scroll-spy"
import { cn } from "@/lib/utils"

import type { TocVariantProps } from "../types"

type Item = TocVariantProps["items"][number]
const focus =
  "outline-none focus-visible:border-gray-600 focus-visible:ring-3 focus-visible:ring-gray-600/50 focus-visible:ring-inset"

export default function NestedToc({ slug, items }: TocVariantProps) {
  if (items.length === 0) return null
  return <NestedContents slug={slug} items={items} />
}

function NestedContents({ slug, items }: TocVariantProps) {
  const reduced = useReducedMotion() ?? false
  const panelId = useId()
  const rootRef = useRef<HTMLDivElement>(null)
  const menuRef = useRef<HTMLDivElement>(null)
  const triggerRef = useRef<HTMLButtonElement>(null)
  const [wide, setWide] = useState<boolean | null>(null)
  const [visible, setVisible] = useState(false)
  const [open, setOpen] = useState(false)
  const [percent, setPercent] = useState(0)
  const { scrollYProgress } = useScroll({
    target: rootRef,
    offset: ["start start", "end end"],
  })
  const spring = useSpring(scrollYProgress, { stiffness: 180, damping: 30 })
  useMotionValueEvent(scrollYProgress, "change", (value) =>
    setPercent(Math.round(Math.max(0, Math.min(1, value)) * 100))
  )
  const { active, scrollToId } = useScrollSpy({
    ids: items.map((item) => item.id),
    topOffset: wide === false ? 144 : 96,
  })
  const sections: { heading: Item; children: Item[] }[] = []
  for (const item of items) {
    if (item.depth === 2 || sections.length === 0)
      sections.push({ heading: item, children: [] })
    else sections[sections.length - 1].children.push(item)
  }
  const activeId = items[active]?.id
  const sectionIndex = Math.max(
    0,
    sections.findIndex(
      (section) =>
        section.heading.id === activeId ||
        section.children.some((item) => item.id === activeId)
    )
  )
  const section = sections[sectionIndex]
  const firstId = items[0]?.id

  useEffect(() => {
    const resize = () => {
      setWide(window.innerWidth >= 1168)
      setOpen(false)
    }
    const scroll = () => {
      const first = firstId ? document.getElementById(firstId) : null
      const sticky = rootRef.current?.querySelector<HTMLElement>(
        "[data-nested-mobile]"
      )
      const band = sticky ? parseFloat(getComputedStyle(sticky).top) : 0
      const show = !!first && first.getBoundingClientRect().top < band
      setVisible(show)
      if (!show) setOpen(false)
    }
    resize()
    scroll()
    window.addEventListener("resize", resize)
    window.addEventListener("scroll", scroll, { passive: true })
    return () => {
      window.removeEventListener("resize", resize)
      window.removeEventListener("scroll", scroll)
    }
  }, [firstId])

  useEffect(() => {
    if (!open) return
    const outside = (event: PointerEvent) => {
      if (
        event.target instanceof Node &&
        !menuRef.current?.contains(event.target)
      )
        setOpen(false)
    }
    const escape = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return
      setOpen(false)
      triggerRef.current?.focus()
    }
    document.addEventListener("pointerdown", outside)
    document.addEventListener("keydown", escape)
    return () => {
      document.removeEventListener("pointerdown", outside)
      document.removeEventListener("keydown", escape)
    }
  }, [open])

  const select = (item: Item) => {
    tap()
    scrollToId(item.id)
    track("toc link clicked", { slug, heading: item.label })
    setOpen(false)
  }
  const progress = (
    <div aria-hidden="true" className="h-px overflow-hidden bg-gray-alpha-400">
      <motion.div
        className="h-full origin-left bg-gray-1000"
        style={{ scaleX: reduced ? scrollYProgress : spring }}
      />
    </div>
  )
  const footer = (
    <div className="mt-4 flex items-center justify-between gap-2 border-t border-gray-alpha-400 pt-3 text-label-12 text-gray-900">
      <button
        type="button"
        className={cn(
          "flex items-center gap-1.5 rounded-sm border border-transparent py-1 pe-1 transition-colors hover:text-gray-1000",
          focus
        )}
        onClick={() => {
          tap()
          setOpen(false)
          window.scrollTo({ top: 0, behavior: reduced ? "auto" : "smooth" })
        }}
      >
        <IconArrowUp aria-hidden="true" className="size-3.5" />
        Back to top
      </button>
      <span className="tabular-nums">
        {sectionIndex + 1} / {sections.length}
      </span>
    </div>
  )

  return (
    <div ref={rootRef} className="pointer-events-none absolute inset-0">
      {items.length > 0 &&
        wide !== null &&
        (wide ? (
          <aside className="absolute end-0 top-0 h-full w-49 pt-11.5">
            <motion.nav
              aria-label="Contents"
              initial={reduced ? false : { opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{
                duration: reduced ? 0 : 0.4,
                delay: reduced ? 0 : 0.15,
              }}
              className="pointer-events-auto sticky top-[calc(var(--nav-band)+2rem)] ps-4"
            >
              <div className="mb-3 flex justify-between text-label-12 text-gray-900">
                <span>Contents</span>
                <span className="tabular-nums">{percent}%</span>
              </div>
              {progress}
              <NestedList
                sections={sections}
                sectionIndex={sectionIndex}
                activeId={activeId}
                mobile={false}
                reduced={reduced}
                select={select}
              />
              {footer}
            </motion.nav>
          </aside>
        ) : (
          <div
            data-nested-mobile
            className="sticky top-(--nav-band) z-40 mx-auto max-w-180"
          >
            <AnimatePresence>
              {visible && (
                <motion.div
                  ref={menuRef}
                  initial={reduced ? false : { opacity: 0, y: -6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: reduced ? 0 : -6 }}
                  transition={{ duration: reduced ? 0 : 0.2 }}
                  className="pointer-events-auto overflow-hidden material-menu border border-gray-alpha-400 backdrop-blur-xl"
                >
                  <button
                    ref={triggerRef}
                    type="button"
                    aria-expanded={open}
                    aria-controls={panelId}
                    onClick={() => {
                      tap()
                      setOpen((value) => !value)
                    }}
                    className={cn(
                      "flex w-full items-center gap-2 border border-transparent px-3 py-3 text-label-12 text-gray-900 transition-colors hover:bg-gray-alpha-100",
                      focus
                    )}
                  >
                    <span className="text-gray-1000">Contents</span>
                    <span className="min-w-0 flex-1 truncate text-start">
                      {section?.heading.label}
                    </span>
                    <span className="tabular-nums">{percent}%</span>
                    <IconChevronDown
                      aria-hidden="true"
                      className={cn(
                        "size-3.5 shrink-0 transition-transform motion-reduce:transition-none",
                        open && "rotate-180"
                      )}
                    />
                  </button>
                  {progress}
                  <AnimatePresence initial={false}>
                    {open && (
                      <motion.nav
                        key="panel"
                        id={panelId}
                        aria-label="Contents"
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: reduced ? 0 : 0.2 }}
                        className="overflow-hidden"
                      >
                        <div className="px-3 pb-3">
                          <NestedList
                            sections={sections}
                            sectionIndex={sectionIndex}
                            activeId={activeId}
                            mobile
                            reduced={reduced}
                            select={select}
                          />
                          {footer}
                        </div>
                      </motion.nav>
                    )}
                  </AnimatePresence>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
    </div>
  )
}

function NestedList({
  sections,
  sectionIndex,
  activeId,
  mobile,
  reduced,
  select,
}: {
  sections: { heading: Item; children: Item[] }[]
  sectionIndex: number
  activeId: string | undefined
  mobile: boolean
  reduced: boolean
  select: (item: Item) => void
}) {
  const listRef = useRef<HTMLDivElement>(null)
  const contentRef = useRef<HTMLUListElement>(null)
  const [edges, setEdges] = useState({ top: false, bottom: false })
  const layoutId = useId()
  useEffect(() => {
    const list = listRef.current
    const content = contentRef.current
    if (!list || !content) return
    const updateEdges = () =>
      setEdges({
        top: list.scrollTop > 1,
        bottom: list.scrollTop + list.clientHeight < list.scrollHeight - 1,
      })
    const reveal = () => {
      const active = content.querySelector<HTMLElement>(
        '[aria-current="location"]'
      )
      if (active) {
        const box = active.getBoundingClientRect()
        const viewport = list.getBoundingClientRect()
        const delta =
          box.top < viewport.top + 8
            ? box.top - viewport.top - 8
            : box.bottom > viewport.bottom - 8
              ? box.bottom - viewport.bottom + 8
              : 0
        if (delta)
          list.scrollTo({
            top: list.scrollTop + delta,
            behavior: reduced ? "auto" : "smooth",
          })
      }
      updateEdges()
    }
    const observer = new ResizeObserver(reveal)
    observer.observe(content)
    observer.observe(list)
    list.addEventListener("scroll", updateEdges, { passive: true })
    reveal()
    return () => {
      observer.disconnect()
      list.removeEventListener("scroll", updateEdges)
    }
  }, [activeId, reduced])

  return (
    <div
      ref={listRef}
      className={cn(
        "mt-3 [scrollbar-width:none] overflow-y-auto overscroll-contain [&::-webkit-scrollbar]:hidden",
        mobile ? "max-h-[60dvh]" : "max-h-[calc(100dvh-var(--nav-band)-13rem)]"
      )}
      style={{
        maskImage: `linear-gradient(to bottom, ${edges.top ? "transparent" : "black"}, black 8px, black calc(100% - 8px), ${edges.bottom ? "transparent" : "black"})`,
      }}
    >
      <LayoutGroup id={layoutId}>
        <ul ref={contentRef} className="m-0 list-none p-0">
          {sections.map((section, index) => {
            const active = index === sectionIndex
            const expanded = mobile || active
            return (
              <li key={section.heading.id}>
                <a
                  href={`#${section.heading.id}`}
                  aria-current={
                    activeId === section.heading.id ? "location" : undefined
                  }
                  onClick={(event) => {
                    event.preventDefault()
                    select(section.heading)
                  }}
                  className={cn(
                    "relative flex items-center gap-1 rounded-sm border border-transparent py-2 ps-3 pe-1 text-label-13 no-underline transition-colors",
                    focus,
                    active
                      ? "text-gray-1000"
                      : "text-gray-900 hover:text-gray-1000"
                  )}
                >
                  {active && (
                    <motion.span
                      layoutId="section-marker"
                      transition={
                        reduced
                          ? { duration: 0 }
                          : { type: "spring", stiffness: 420, damping: 38 }
                      }
                      className="absolute start-0 h-1 w-1 rounded-full bg-gray-1000"
                    />
                  )}
                  <span className="line-clamp-2 min-w-0 flex-1">
                    {section.heading.label}
                  </span>
                  {section.children.length > 0 && (
                    <span
                      aria-label={`${section.children.length} subsections`}
                      className="flex shrink-0 items-center gap-0.5 text-label-12 text-gray-900"
                    >
                      <span className="tabular-nums">
                        {section.children.length}
                      </span>
                      <IconChevronDown
                        aria-hidden="true"
                        className={cn(
                          "size-3 transition-transform motion-reduce:transition-none",
                          expanded && "rotate-180"
                        )}
                      />
                    </span>
                  )}
                </a>
                <AnimatePresence initial={false}>
                  {expanded && section.children.length > 0 && (
                    <motion.div
                      key="children"
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: reduced ? 0 : 0.2 }}
                      className="overflow-hidden"
                    >
                      <ul className="ms-3 list-none border-s border-gray-alpha-400 p-0">
                        {section.children.map((item) => (
                          <li key={item.id}>
                            <a
                              href={`#${item.id}`}
                              aria-current={
                                activeId === item.id ? "location" : undefined
                              }
                              onClick={(event) => {
                                event.preventDefault()
                                select(item)
                              }}
                              className={cn(
                                "mx-1 block rounded-sm border border-transparent py-2 ps-2 pe-1 text-label-12 no-underline transition-colors",
                                focus,
                                activeId === item.id
                                  ? "text-gray-1000"
                                  : "text-gray-900 hover:text-gray-1000"
                              )}
                            >
                              <span className="line-clamp-2">{item.label}</span>
                            </a>
                          </li>
                        ))}
                      </ul>
                    </motion.div>
                  )}
                </AnimatePresence>
              </li>
            )
          })}
        </ul>
      </LayoutGroup>
    </div>
  )
}
