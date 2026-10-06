import { PatternFrame, type PatternProps } from "./frame"
import { Flip, Run } from "./motion"

// The orbit runs counter-clockwise, and at the point of tangency each
// window also carries straight on along the tangent, the way a body let go
// of a circular path leaves along it.
const orbit = { w: 32, p: 175.93, speed: 3 }

export function PatternTangent(props: PatternProps) {
  return (
    <PatternFrame {...props}>
      <path d="M88 60H-2000" stroke="currentColor" strokeDasharray="4 4" />
      <circle
        cx="144"
        cy="60"
        r="56"
        stroke="currentColor"
        strokeDasharray="4 4"
      />
      <Run
        d="M172 108.5A56 56 0 0 0 116 11.5A56 56 0 0 0 172 108.5"
        {...orbit}
      />
      <Flip d="M172 108.5L3824.02 -2000" {...orbit} />
      <path d="M144 60L172 108.5" stroke="currentColor" strokeDasharray="4 4" />
      <circle
        cx="144"
        cy="60"
        r="36"
        fill="var(--ds-background-100)"
        stroke="currentColor"
      />
      <rect x="169" y="105.5" width="6" height="6" fill="currentColor" />
    </PatternFrame>
  )
}
