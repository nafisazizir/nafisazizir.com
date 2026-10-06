"use client"

import * as React from "react"

// Readies an animated stage: measures one screen pixel in frame units for
// the parts drawn without non-scaling strokes, and runs the clock while the
// stage is on screen.
export function PatternPlay() {
  const ref = React.useRef<HTMLSpanElement>(null)

  React.useEffect(() => {
    const stage = ref.current?.parentElement
    const svg = stage?.querySelector("svg")
    if (!stage || !svg) return
    const resize = new ResizeObserver(() => {
      const width = svg.getBoundingClientRect().width
      if (!width) return
      stage.style.setProperty("--hairline", String(384 / width))
      stage.setAttribute("data-ready", "")
    })
    const view = new IntersectionObserver(([entry]) =>
      stage.toggleAttribute("data-playing", entry.isIntersecting)
    )
    resize.observe(svg)
    view.observe(stage)
    return () => {
      resize.disconnect()
      view.disconnect()
      stage.removeAttribute("data-ready")
      stage.removeAttribute("data-playing")
      stage.style.removeProperty("--hairline")
    }
  }, [])

  return <span ref={ref} hidden />
}
