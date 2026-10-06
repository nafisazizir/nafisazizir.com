import { PatternFrame, type PatternProps } from "./frame"
import { Flip, Run } from "./motion"

// A loop in steady state: work comes in at the left, goes over the top,
// and at the right both leaves along the output and goes round under the
// bottom to come back in with the next. Two windows ride the loop half a
// turn apart. Positions are along the loop from the left ring.
const loop = { w: 24, p: 150.8, speed: 3 }

export function PatternCycle(props: PatternProps) {
  return (
    <PatternFrame {...props}>
      <Flip d="M-2000 60H144" start={-2144} {...loop} />
      <path d="M240 60H2400" stroke="currentColor" strokeDasharray="4 4" />
      <Run d="M240 60H600" start={150.8} {...loop} />
      <circle
        cx="192"
        cy="60"
        r="48"
        stroke="currentColor"
        strokeDasharray="4 4"
      />
      <Run d="M240 60A48 48 0 0 1 144 60" start={150.8} {...loop} />
      <Flip d="M144 60A48 48 0 0 1 240 60" {...loop} />
      <circle
        cx="192"
        cy="60"
        r="20"
        fill="var(--ds-background-100)"
        stroke="currentColor"
      />
      <circle
        cx="144"
        cy="60"
        r="4"
        fill="var(--ds-background-100)"
        stroke="currentColor"
      />
      <circle
        cx="240"
        cy="60"
        r="4"
        fill="var(--ds-background-100)"
        stroke="currentColor"
      />
      <circle
        cx="192"
        cy="108"
        r="4"
        fill="var(--ds-background-100)"
        stroke="currentColor"
      />
      <circle cx="192" cy="12" r="4" fill="currentColor" />
    </PatternFrame>
  )
}
