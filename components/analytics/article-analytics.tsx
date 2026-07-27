"use client"

import { useEffect } from "react"

import { type PostKind, track } from "@/lib/analytics/events"

const MILESTONES = [25, 50, 75, 100] as const

export function ArticleAnalytics({
  slug,
  kind,
}: {
  slug: string
  kind: PostKind
}) {
  useEffect(() => {
    const article = document.querySelector("article")
    if (!article) return

    const startedAt = Date.now()
    const sent = new Set<number>()
    let frame = 0

    const measure = () => {
      frame = 0
      const { top, height } = article.getBoundingClientRect()
      const seen = window.innerHeight - top
      // Articles shorter than the viewport never scroll — count those as read.
      const percent = height <= 0 ? 100 : (seen / height) * 100

      for (const milestone of MILESTONES) {
        if (percent < milestone || sent.has(milestone)) continue
        sent.add(milestone)
        track("article progress", { slug, kind, percent: milestone })
        if (milestone === 100) {
          track("article finished", {
            slug,
            kind,
            seconds: Math.round((Date.now() - startedAt) / 1000),
          })
        }
      }

      if (sent.size === MILESTONES.length) detach()
    }

    const onScroll = () => {
      if (frame) return
      frame = requestAnimationFrame(measure)
    }

    const detach = () => {
      window.removeEventListener("scroll", onScroll)
      window.removeEventListener("resize", onScroll)
      if (frame) cancelAnimationFrame(frame)
      frame = 0
    }

    window.addEventListener("scroll", onScroll, { passive: true })
    window.addEventListener("resize", onScroll, { passive: true })
    measure()

    return detach
  }, [slug, kind])

  return null
}
