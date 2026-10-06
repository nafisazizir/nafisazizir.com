import { PatternFrame, type PatternProps } from "./frame"
import { Flip, Run } from "./motion"

// The slope lays the steps: a window climbs the diagonal and, as it
// passes each corner, runs out along that step's tread and up its riser.
const climb = { w: 32, p: 540 }

export function PatternSteps(props: PatternProps) {
  return (
    <PatternFrame {...props}>
      <Flip d="M0.5 119.5L88.5 31.5" {...climb} />
      <path
        d="M0.5 -2000V119.5H152.5V-2000"
        stroke="currentColor"
        strokeDasharray="4 4"
      />
      <Run d="M0.5 119.5H152.5V-200" {...climb} />
      <path
        d="M32.5 -2000V87.5H216.5V-2000"
        stroke="currentColor"
        strokeDasharray="4 4"
      />
      <Run d="M32.5 87.5H216.5V-200" start={45.25} {...climb} />
      <path
        d="M88.5 -2000V31.5H2400"
        stroke="currentColor"
        strokeDasharray="4 4"
      />
      <Run d="M88.5 31.5H440" start={124.45} {...climb} />
      <path d="M272.5 -2000V31.5" stroke="currentColor" strokeDasharray="4 4" />
      <rect
        x="93"
        y="-2000"
        width="48"
        height="2027"
        fill="var(--ds-background-100)"
      />
      <circle
        cx="32.5"
        cy="87.5"
        r="4"
        fill="var(--ds-background-100)"
        stroke="currentColor"
      />
      <circle
        cx="88.5"
        cy="31.5"
        r="4"
        fill="var(--ds-background-100)"
        stroke="currentColor"
      />
    </PatternFrame>
  )
}
