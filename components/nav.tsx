"use client"

import { useEffect, useRef, useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { HugeiconsIcon } from "@hugeicons/react"
import { MenuTwoLineIcon, MinusSignIcon } from "@hugeicons/core-free-icons"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

const links = [
  { href: "/projects", label: "Projects" },
  { href: "/blogs", label: "Blogs" },
  { href: "/about", label: "About" },
]

export function Nav() {
  const [open, setOpen] = useState(false)
  // Overflow must stay clipped while the panel collapses, but become visible
  // once open so focus rings on the items aren't cut off by the edges.
  const [expanded, setExpanded] = useState(false)
  const pathname = usePathname()
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

  const moveDotToLabel = (label: HTMLElement | null) => {
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
  }
  const hideDot = () => setDot((d) => ({ ...d, visible: false }))

  const closeMenu = () => {
    setOpen(false)
    setExpanded(false)
    hideDot()
  }

  useEffect(() => {
    if (!open) return
    const onPointerDown = (e: PointerEvent) => {
      if (!pillRef.current?.contains(e.target as Node)) closeMenu()
    }
    document.addEventListener("pointerdown", onPointerDown)
    return () => document.removeEventListener("pointerdown", onPointerDown)
  }, [open])

  // After opening from the keyboard, move focus onto the first/last link.
  useEffect(() => {
    if (!open || !focusOnOpen.current) return
    const items = getItems()
    const link = focusOnOpen.current === "first" ? items[1] : items.at(-1)
    link?.focus()
    focusOnOpen.current = null
  }, [open])

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape" && open) {
      closeMenu()
      focusTrigger()
      return
    }

    if (e.key !== "ArrowDown" && e.key !== "ArrowUp") return
    e.preventDefault()

    if (!open) {
      focusOnOpen.current = e.key === "ArrowDown" ? "first" : "last"
      setOpen(true)
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
          "rounded-3xl border border-border bg-card/70 text-card-foreground shadow-[0_16px_40px_-12px_color-mix(in_oklab,var(--background)_50%,transparent)] backdrop-blur-2xl backdrop-saturate-150",
          open ? "w-52 p-2" : "w-24 p-0"
        )}
      >
        <Button
          variant="ghost"
          data-nav-item
          data-nav-trigger
          onClick={() => (open ? closeMenu() : setOpen(true))}
          aria-expanded={open}
          aria-controls="nav-menu"
          aria-label={open ? "Close menu" : "Open menu"}
          className="group w-full justify-between font-semibold hover:bg-foreground/8 dark:hover:bg-foreground/8"
        >
          Home
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
        </Button>

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
              className="relative flex flex-col pt-1"
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
              {links.map(({ href, label }, i) => {
                const active =
                  pathname === href || pathname.startsWith(`${href}/`)
                return (
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
                      onClick={closeMenu}
                      render={<Link href={href} />}
                      aria-current={active ? "page" : undefined}
                      className={cn(
                        "w-full justify-start hover:bg-foreground/8 dark:hover:bg-foreground/8",
                        active && "bg-foreground/6"
                      )}
                    >
                      <span data-nav-label>{label}</span>
                    </Button>
                  </li>
                )
              })}
            </ul>
          </div>
        </div>
      </div>
    </nav>
  )
}
