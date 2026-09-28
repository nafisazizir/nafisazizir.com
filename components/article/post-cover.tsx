"use client"

import Image from "next/image"
import { useEffect, useRef } from "react"

import { isVideoCover } from "@/lib/format"
import { cn } from "@/lib/utils"

const COVER_SIZES = "(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"

/**
 * A card cover that is either a still or a short clip. A clip holds on its
 * poster frame and only runs while the card is hovered or focused — motion
 * follows attention, and idle cards stay quiet.
 */
export function PostCover({
  src,
  poster,
  active,
  reduced,
  className,
}: {
  src: string
  poster?: string
  /** The card is hovered or keyboard-focused. */
  active: boolean
  reduced: boolean
  className?: string
}) {
  const videoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    const video = videoRef.current
    if (!video) return
    if (active && !reduced) {
      // Autoplay can still be refused (low power mode); the poster stays put.
      void video.play().catch(() => {})
    } else {
      video.pause()
    }
  }, [active, reduced])

  if (!isVideoCover(src)) {
    return (
      <Image
        src={src}
        alt=""
        fill
        sizes={COVER_SIZES}
        className={cn("object-cover grayscale", className)}
      />
    )
  }

  return (
    <video
      ref={videoRef}
      // The fragment pins the first frame, so Safari paints something even
      // when no poster is given.
      src={`${src}#t=0.001`}
      poster={poster}
      muted
      loop
      playsInline
      preload="metadata"
      aria-hidden
      tabIndex={-1}
      className={cn(
        "absolute inset-0 size-full object-cover grayscale",
        className
      )}
    />
  )
}
