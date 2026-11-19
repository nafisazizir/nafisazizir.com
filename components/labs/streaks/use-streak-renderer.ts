"use client"

import { useEffect, useState } from "react"

import { createStreakRenderer, type StreakRenderer } from "./renderer"

// The renderer lives in state rather than a ref so components re-render (and
// their draw effects run) once WebGL is ready. `null` until then, and for
// good if the browser has no WebGL2: `supported` tells the two apart.
export function useStreakRenderer() {
  const [renderer, setRenderer] = useState<StreakRenderer | null>(null)
  const [supported, setSupported] = useState(true)

  useEffect(() => {
    let r: StreakRenderer | null = null
    // If the GPU drops the context, start over on a fresh one; everything
    // drawing with the renderer redraws when it changes.
    const make = () => {
      r = createStreakRenderer(make)
      // Setting state from the effect is the point: WebGL only exists here.
      if (r) setRenderer(r)
      else setSupported(false)
    }
    make()
    return () => r?.dispose()
  }, [])

  return { renderer, supported }
}
