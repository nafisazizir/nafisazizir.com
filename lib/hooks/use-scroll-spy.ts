"use client"

import { useCallback, useEffect, useRef, useState } from "react"

export interface ScrollSpyOptions {
  ids: string[]
  topOffset?: number
}

const isBrowser = typeof window !== "undefined"
const prefersReduced = () =>
  isBrowser && !!window.matchMedia?.("(prefers-reduced-motion: reduce)").matches

export function useScrollSpy({ ids, topOffset = 0 }: ScrollSpyOptions) {
  const idsKey = ids.join("|")
  const [active, setActive] = useState(0)
  const lockRef = useRef(false)
  const rafRef = useRef<number | null>(null)
  const releaseRef = useRef<(() => void) | null>(null)

  const compute = useCallback((): number => {
    if (!isBrowser || ids.length === 0) return 0
    const vh = window.innerHeight
    const scrollY = window.scrollY
    const maxScroll = Math.max(1, document.documentElement.scrollHeight - vh)
    const n = ids.length
    if (scrollY <= 0) return 0
    if (scrollY >= maxScroll - 1) return n - 1
    // A single, consistent trigger line for every heading: a section becomes
    // active once its heading crosses into the upper third of the viewport
    // (but never above the fixed nav). Using one line for all headings keeps the
    // highlight in step with what's actually being read — a per-index sliding
    // line makes later sections light up while their heading is still far down.
    const line = Math.max(topOffset + 8, vh * 0.3)
    let idx = 0
    for (let i = 0; i < n; i++) {
      const el = document.getElementById(ids[i])
      if (!el) continue
      if (el.getBoundingClientRect().top <= line) idx = i
    }
    return idx
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [idsKey, topOffset])

  const requestUpdate = useCallback(() => {
    if (rafRef.current != null) return
    rafRef.current = requestAnimationFrame(() => {
      rafRef.current = null
      if (lockRef.current) return
      setActive(compute())
    })
  }, [compute])

  useEffect(() => {
    if (!isBrowser) return
    requestUpdate()
    window.addEventListener("scroll", requestUpdate, { passive: true })
    window.addEventListener("resize", requestUpdate)
    let ro: ResizeObserver | undefined
    if (typeof ResizeObserver !== "undefined") {
      ro = new ResizeObserver(requestUpdate)
      ro.observe(document.documentElement)
      ids.forEach((id) => {
        const el = document.getElementById(id)
        if (el) ro?.observe(el)
      })
    }
    const t = setTimeout(requestUpdate, 200)
    return () => {
      window.removeEventListener("scroll", requestUpdate)
      window.removeEventListener("resize", requestUpdate)
      ro?.disconnect()
      clearTimeout(t)
      // Cancel any pending frame AND clear the ref. If we leave a stale (already
      // cancelled) id here, the next effect run — e.g. React StrictMode's
      // remount, or a client-side navigation into this page — sees a non-null
      // rafRef and the `requestUpdate` guard blocks every future update, leaving
      // the active section frozen. This is why the TOC tracked on a hard refresh
      // but not after navigating in from the list.
      if (rafRef.current != null) {
        cancelAnimationFrame(rafRef.current)
        rafRef.current = null
      }
      releaseRef.current?.()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [idsKey, requestUpdate])

  const scrollToId = useCallback(
    (id: string) => {
      if (!isBrowser) return
      const i = ids.indexOf(id)
      const el = document.getElementById(id)
      if (i < 0 || !el) return
      setActive(i)
      lockRef.current = true
      releaseRef.current?.()
      const reduce = prefersReduced()
      const maxScroll = Math.max(
        0,
        document.documentElement.scrollHeight - window.innerHeight
      )
      const top = el.getBoundingClientRect().top + window.scrollY
      const target = Math.max(0, Math.min(top - topOffset, maxScroll))
      window.scrollTo({ top: target, behavior: reduce ? "auto" : "smooth" })
      let settled = false
      const settleTimer = window.setTimeout(() => {
        settled = true
      }, 1200)
      const onScrollProbe = () => {
        if (!settled) {
          if (Math.abs(window.scrollY - target) < 2) settled = true
          return
        }
        release()
      }
      const cleanup = () => {
        window.clearTimeout(settleTimer)
        window.removeEventListener("wheel", release)
        window.removeEventListener("touchstart", release)
        window.removeEventListener("keydown", release)
        window.removeEventListener("scroll", onScrollProbe)
        releaseRef.current = null
      }
      function release() {
        lockRef.current = false
        cleanup()
        requestUpdate()
      }
      releaseRef.current = cleanup
      window.addEventListener("wheel", release, { once: true, passive: true })
      window.addEventListener("touchstart", release, {
        once: true,
        passive: true,
      })
      window.addEventListener("keydown", release, { once: true })
      window.addEventListener("scroll", onScrollProbe, { passive: true })
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [idsKey, topOffset, requestUpdate]
  )

  const safe = Math.min(active, Math.max(0, ids.length - 1))
  return { active: safe, activeId: ids[safe] ?? "", scrollToId }
}
