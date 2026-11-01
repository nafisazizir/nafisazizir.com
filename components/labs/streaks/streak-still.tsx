"use client"

import { useEffect, useRef } from "react"

import { cn } from "@/lib/utils"

import { STREAK_PRESETS, type StreakParams } from "./presets"
import { useStreakRenderer } from "./use-streak-renderer"

// A single still frame, sized to its box. Used for card art, where a live
// loop would be wasted; it redraws only when its box or params change.
export function StreakStill({
  params = STREAK_PRESETS[0],
  samples = 32,
  className,
}: {
  params?: StreakParams
  samples?: number
  className?: string
}) {
  const canvas = useRef<HTMLCanvasElement>(null)
  const { renderer } = useStreakRenderer()

  useEffect(() => {
    const el = canvas.current
    if (!el || !renderer) return
    const draw = () => {
      const { width, height } = el.getBoundingClientRect()
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      const w = Math.max(1, Math.round(width * dpr))
      const h = Math.max(1, Math.round(height * dpr))
      if (el.width !== w || el.height !== h) {
        el.width = w
        el.height = h
      }
      renderer.render(el.getContext("2d")!, w, h, params, { samples })
    }
    draw()
    const ro = new ResizeObserver(draw)
    ro.observe(el)
    return () => ro.disconnect()
  }, [renderer, params, samples])

  return (
    <canvas
      ref={canvas}
      aria-hidden
      className={cn("block size-full bg-gray-100", className)}
    />
  )
}
