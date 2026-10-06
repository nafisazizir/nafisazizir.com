import { PatternFrame, type PatternProps } from "./frame"
import { Flip, Run } from "./motion"

// Parallel light: windows run in along the two rays and the axis, the rays
// turn at the lens face and meet the axis at its centre, and the light
// leaves along the axis. Every line is placed so the windows arrive at the
// centre together (500 along the route).
const light = { w: 32, p: 120, speed: 4 }

export function PatternLens(props: PatternProps) {
  return (
    <PatternFrame {...props}>
      <Flip d="M-2000 0.5H192.5" start={-1751.5} {...light} />
      <Flip d="M-2000 119.5H192.5" start={-1751.5} {...light} />
      <Flip d="M192 0.5V60" start={440.5} {...light} />
      <Flip d="M192 119.5V60" start={440.5} {...light} />
      <Flip d="M162 60H2400" start={470} {...light} />
      <path d="M-2000 60H132" stroke="currentColor" strokeDasharray="4 4" />
      <Run d="M-200 60H132" start={108} {...light} />
      <circle cx="192" cy="60" r="59.5" stroke="currentColor" />
      <circle cx="165" cy="60" r="3" fill="currentColor" />
      <circle
        cx="192"
        cy="60"
        r="17"
        fill="var(--ds-background-100)"
        stroke="currentColor"
      />
    </PatternFrame>
  )
}
