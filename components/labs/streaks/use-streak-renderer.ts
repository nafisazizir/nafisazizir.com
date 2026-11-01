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
    const r = createStreakRenderer()
    // Setting state from the effect is the point: WebGL only exists here.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (r) setRenderer(r)
    else setSupported(false)
    return () => r?.dispose()
  }, [])

  return { renderer, supported }
}
