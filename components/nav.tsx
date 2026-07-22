"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { HugeiconsIcon } from "@hugeicons/react"
import { MenuTwoLineIcon, MinusSignIcon } from "@hugeicons/core-free-icons"

import { Button } from "@/components/ui/button"
import {
  close as closeSound,
  open as openSound,
  setVoice,
  tap as tapSound,
} from "@/lib/audio"
import { cn } from "@/lib/utils"

const links = [
  { href: "/", label: "Home" },
  { href: "/projects", label: "Projects" },
  { href: "/blogs", label: "Blogs" },
  { href: "/about", label: "About" },
]

const isActive = (href: string, pathname: string) =>
  href === "/"
    ? pathname === "/"
    : pathname === href || pathname.startsWith(`${href}/`)

function ToggleIcon({ open }: { open: boolean }) {
  return (
    <span className="relative grid size-4 place-items-center text-muted-foreground transition-colors group-hover:text-foreground">
      <HugeiconsIcon
        icon={MenuTwoLineIcon}
        className={cn(
          "col-start-1 row-start-1 transition-all duration-300 ease-out",
          open
            ? "scale-75 rotate-90 opacity-0"
            : "scale-100 rotate-0 opacity-100"
        )}
      />
      <HugeiconsIcon
        icon={MinusSignIcon}
        className={cn(
          "col-start-1 row-start-1 transition-all duration-300 ease-out",
          open
            ? "scale-100 rotate-0 opacity-100"
            : "scale-75 -rotate-90 opacity-0"
        )}
      />
    </span>
  )
}

function AnimatedLabel({ label }: { label: string }) {
  const [current, setCurrent] = useState(label)
  const [previous, setPrevious] = useState<string | null>(null)

  if (label !== current) {
    setPrevious(current)
    setCurrent(label)
  }

  useEffect(() => {
    if (previous === null) return
    const timer = setTimeout(() => setPrevious(null), 300)
    return () => clearTimeout(timer)
  }, [previous])

  return (
    <span
      data-nav-label
      className="relative grid justify-items-start overflow-hidden text-left"
    >
      <span
        key={current}
        className={cn(
          "col-start-1 row-start-1",
          previous && "animate-in duration-300 ease-out slide-in-from-bottom"
        )}
      >
        {current}
      </span>
      {previous && (
        <span
          key={previous}
          aria-hidden
          className="col-start-1 row-start-1 animate-out duration-300 ease-out fill-mode-forwards slide-out-to-top"
        >
          {previous}
        </span>
      )}
    </span>
  )
}

export function Nav() {
  const [open, setOpen] = useState(false)
  // Overflow must stay clipped while the panel collapses, but become visible
  // once open so focus rings on the items aren't cut off by the edges.
  const [expanded, setExpanded] = useState(false)
  const pathname = usePathname()
  const onKnownRoute = links.some((l) => l.href === pathname)
  const active = links.find((l) => isActive(l.href, pathname))
  const currentLabel = active?.label ?? "Home"
  const activeHref = active?.href ?? "/"
  const onSectionRoot = pathname === activeHref
  const pillRef = useRef<HTMLDivElement>(null)
  // When the menu is opened via keyboard, remember which end to focus once the
  // items are no longer `inert` (i.e. after `open` commits).
  const focusOnOpen = useRef<"first" | "last" | null>(null)

  const getItems = () =>
    Array.from(
      pillRef.current?.querySelectorAll<HTMLElement>("[data-nav-item]") ?? []
    )

  const focusTrigger = () =>
    pillRef.current?.querySelector<HTMLElement>("[data-nav-trigger]")?.focus()

  // A single dot that glides to sit just after the hovered/focused label.
  const ulRef = useRef<HTMLUListElement>(null)
  const [dot, setDot] = useState({ x: 0, y: 0, visible: false })

  const moveDotToLabel = useCallback(
    (label: HTMLElement | null) => {
      // Ignore hover/focus until the menu is fully open, so the dot never shows
      // or animates while the panel is still expanding.
      if (!expanded || !label || !ulRef.current) return
      const u = ulRef.current.getBoundingClientRect()
      const r = label.getBoundingClientRect()
      setDot({
        x: r.right - u.left + 10,
        y: r.top - u.top + r.height / 2,
        visible: true,
      })
    },
    [expanded]
  )
  const hideDot = useCallback(
    () => setDot((d) => ({ ...d, visible: false })),
    []
  )

  const closeMenu = useCallback(() => {
    setOpen(false)
    setExpanded(false)
    hideDot()
  }, [hideDot])

  // The site's own sonic identity: every pitched sound is re-voiced from this
  // seed, so the interface sounds like this site and no other. Set once.
  useEffect(() => {
    setVoice("nafisazizir")
  }, [])

  // Opening the overlay arrives on the z-axis; dismissing is its mirror.
  // Selecting a nav link is a plain tap (see the link handlers below), so the
  // structural close stays silent to avoid stacking two sounds at once.
  const openMenu = useCallback(() => {
    openSound()
    setOpen(true)
  }, [])
  const dismiss = useCallback(() => {
    closeSound()
    closeMenu()
  }, [closeMenu])

  useEffect(() => {
    if (!open) return
    const onPointerDown = (e: PointerEvent) => {
      if (!pillRef.current?.contains(e.target as Node)) dismiss()
    }
    document.addEventListener("pointerdown", onPointerDown)
    return () => document.removeEventListener("pointerdown", onPointerDown)
  }, [open, dismiss])

  useEffect(() => {
    if (!open || !focusOnOpen.current) return
    const link =
      focusOnOpen.current === "first"
        ? ulRef.current?.querySelector<HTMLElement>("[data-nav-item]")
        : getItems().at(-1)
    link?.focus()
    focusOnOpen.current = null
  }, [open])

  useEffect(() => {
    if (!expanded || !pillRef.current) return
    const hovered = pillRef.current.querySelector<HTMLElement>(
      "[data-nav-item]:hover [data-nav-label]"
    )
    const focusedLabel = document.activeElement
      ?.closest("[data-nav-item]")
      ?.querySelector<HTMLElement>("[data-nav-label]")
    const label = hovered ?? focusedLabel ?? null
    if (label) moveDotToLabel(label)
  }, [expanded, moveDotToLabel])

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape" && open) {
      dismiss()
      focusTrigger()
      return
    }

    if (e.key !== "ArrowDown" && e.key !== "ArrowUp") return
    e.preventDefault()

    if (!open) {
      focusOnOpen.current = e.key === "ArrowDown" ? "first" : "last"
      openMenu()
      return
    }

    const items = getItems()
    if (items.length === 0) return
    const current = items.indexOf(document.activeElement as HTMLElement)
    const start = current === -1 ? 0 : current
    const next =
      e.key === "ArrowDown"
        ? (start + 1) % items.length
        : (start - 1 + items.length) % items.length
    items[next]?.focus()
  }

  if (!onKnownRoute) return null

  return (
    <nav className="fixed inset-x-0 top-4 z-50 flex justify-center">
      <div
        ref={pillRef}
        onKeyDown={onKeyDown}
        // Width animates first; padding animates together with the height
        // (both delayed to 300ms on open). On close the order reverses.
        style={{
          transition: open
            ? "width 300ms ease-out 0ms, padding 300ms ease-out 300ms"
            : "width 300ms ease-out 400ms, padding 300ms ease-out 150ms",
        }}
        className={cn(
          "rounded-3xl border border-border bg-card/20 text-card-foreground shadow-[0_16px_40px_-12px_color-mix(in_oklab,var(--background)_50%,transparent)] backdrop-blur-sm backdrop-saturate-150",
          open ? "w-52 p-2" : "w-26 p-0"
        )}
      >
        {onSectionRoot || !open ? (
          <Button
            variant="ghost"
            data-nav-item
            data-nav-trigger
            onClick={() => (open ? dismiss() : openMenu())}
            onMouseEnter={(e) =>
              moveDotToLabel(e.currentTarget.querySelector("[data-nav-label]"))
            }
            onFocus={(e) =>
              moveDotToLabel(e.currentTarget.querySelector("[data-nav-label]"))
            }
            onMouseLeave={hideDot}
            aria-expanded={open}
            aria-controls="nav-menu"
            aria-label={open ? "Close menu" : "Open menu"}
            className={cn(
              "group w-full justify-between hover:bg-foreground/8 aria-expanded:bg-transparent dark:hover:bg-foreground/8",
              open ? "font-medium" : "font-semibold"
            )}
          >
            <AnimatedLabel label={currentLabel} />
            <ToggleIcon open={open} />
          </Button>
        ) : (
          <div className="flex w-full items-center">
            <Button
              variant="ghost"
              nativeButton={false}
              data-nav-item
              onClick={() => {
                tapSound()
                closeMenu()
              }}
              onMouseEnter={(e) =>
                moveDotToLabel(
                  e.currentTarget.querySelector("[data-nav-label]")
                )
              }
              onFocus={(e) =>
                moveDotToLabel(
                  e.currentTarget.querySelector("[data-nav-label]")
                )
              }
              onMouseLeave={hideDot}
              render={<Link href={activeHref} />}
              aria-label={`Go to ${currentLabel}`}
              className="group min-w-0 flex-1 justify-start font-medium hover:bg-foreground/8 dark:hover:bg-foreground/8"
            >
              <AnimatedLabel label={currentLabel} />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              data-nav-item
              data-nav-trigger
              onClick={() => (open ? dismiss() : openMenu())}
              aria-expanded={open}
              aria-controls="nav-menu"
              aria-label={open ? "Close menu" : "Open menu"}
              className="group shrink-0 hover:bg-foreground/8 aria-expanded:bg-transparent dark:hover:bg-foreground/8"
            >
              <ToggleIcon open={open} />
            </Button>
          </div>
        )}

        <div
          id="nav-menu"
          inert={!open}
          onTransitionEnd={(e) => {
            // Only react to this element's own transition, not bubbled child
            // transitions (e.g. a link's hover), and only once fully open.
            if (e.target === e.currentTarget && open) setExpanded(true)
          }}
          // Height animates second: on open it waits for the width (delay-300);
          // on close it collapses after the items have faded out.
          style={{ transitionDelay: open ? "300ms" : "150ms" }}
          className={cn(
            "grid transition-[grid-template-rows] duration-300 ease-out",
            open ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
          )}
        >
          <div
            className={cn(expanded ? "overflow-visible" : "overflow-hidden")}
          >
            <ul
              ref={ulRef}
              onMouseLeave={hideDot}
              className="relative flex flex-col"
            >
              <span
                aria-hidden
                style={{
                  transform: `translate(${dot.x - 2}px, ${dot.y - 2}px)`,
                }}
                className={cn(
                  "pointer-events-none absolute top-0 left-0 size-1 rounded-full bg-foreground transition-[transform,opacity] duration-300 ease-out",
                  dot.visible ? "opacity-100" : "opacity-0"
                )}
              />
              {links
                .filter(({ href }) => !isActive(href, pathname))
                .map(({ href, label }, i) => (
                  <li
                    key={href}
                    onMouseEnter={(e) =>
                      moveDotToLabel(
                        e.currentTarget.querySelector("[data-nav-label]")
                      )
                    }
                    onFocus={(e) =>
                      moveDotToLabel(
                        e.currentTarget.querySelector("[data-nav-label]")
                      )
                    }
                    // Items animate last, staggered, only after the box has
                    // finished growing (width 0-300ms, height 300-600ms).
                    style={{
                      transitionDelay: open ? `${600 + i * 60}ms` : "0ms",
                    }}
                    className={cn(
                      "transition-[opacity,transform] duration-200 ease-out",
                      open
                        ? "translate-y-0 opacity-100"
                        : "translate-y-1 opacity-0"
                    )}
                  >
                    <Button
                      variant="ghost"
                      nativeButton={false}
                      data-nav-item
                      onClick={() => {
                        tapSound()
                        closeMenu()
                      }}
                      render={<Link href={href} />}
                      className="w-full justify-start hover:bg-foreground/8 dark:hover:bg-foreground/8"
                    >
                      <span data-nav-label>{label}</span>
                    </Button>
                  </li>
                ))}
            </ul>
          </div>
        </div>
      </div>
    </nav>
  )
}
