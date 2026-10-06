import { PatternFrame, type PatternProps } from "./frame"
import { Flip, on, Run } from "./motion"

// A walk along the solid path, the one the graph's search found: in from
// the left, edge by edge through each vertex on it, and out. Every other
// edge stays a guide. Vertices the walk holds fill.
const walk = { length: 681.89, w: 28 }

export function PatternGraph(props: PatternProps) {
  return (
    <PatternFrame loop={10} {...props}>
      <path d="M64 60H-2000" stroke="currentColor" strokeDasharray="4 4" />
      <Run d="M-60 60H64" {...walk} />
      <Flip d="M320 60H2400" start={401.89} {...walk} />
      <path
        d="M192 8L237.03 34M237.03 34L237.03 86M237.03 86L192 112M192 112L146.97 86M146.97 86L146.97 34M146.97 34L192 8M192 60L192 8M192 60L237.03 34M192 60L192 112M192 60L146.97 86M64 60L146.97 86M320 60L237.03 34"
        stroke="currentColor"
        strokeDasharray="4 4"
      />
      <Flip
        d="M64 60L146.97 34L192 60L237.03 86L320 60"
        start={124}
        {...walk}
      />
      <circle
        cx="192"
        cy="8"
        r="8"
        fill="var(--ds-background-100)"
        stroke="currentColor"
      />
      <circle
        cx="237.03"
        cy="34"
        r="8"
        fill="var(--ds-background-100)"
        stroke="currentColor"
      />
      <circle
        cx="192"
        cy="112"
        r="8"
        fill="var(--ds-background-100)"
        stroke="currentColor"
      />
      <circle
        cx="146.97"
        cy="86"
        r="8"
        fill="var(--ds-background-100)"
        stroke="currentColor"
      />
      <circle
        cx="64"
        cy="60"
        r="8"
        fill="var(--ds-background-100)"
        stroke="currentColor"
      />
      <circle cx="64" cy="60" r="8" fill="currentColor" {...on(walk, 124, 8)} />
      <circle cx="146.97" cy="34" r="8" fill="currentColor" />
      <circle cx="237.03" cy="86" r="8" fill="currentColor" />
      <circle
        cx="192"
        cy="60"
        r="12"
        fill="var(--ds-background-100)"
        stroke="currentColor"
      />
      <circle
        cx="192"
        cy="60"
        r="12"
        fill="currentColor"
        {...on(walk, 262.95, 12)}
      />
      <circle cx="320" cy="60" r="8" fill="currentColor" />
    </PatternFrame>
  )
}
