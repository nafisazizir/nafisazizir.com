import type * as React from "react"

export type PatternProps = React.SVGProps<SVGSVGElement>

// Every pattern is drawn once on this 16:5 frame, with no padding and no
// background. Closed shapes stay inside it. Only straight lines, and the
// bands between them, cross an edge, and they are drawn far past it so
// whatever holds the pattern does the clipping. Nothing leaves through the
// bottom, which is where a title goes.
export function PatternFrame(props: PatternProps) {
  return (
    <svg
      viewBox="0 0 384 120"
      fill="none"
      overflow="visible"
      aria-hidden="true"
      {...props}
    />
  )
}
