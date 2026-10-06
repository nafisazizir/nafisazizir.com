import { PatternFrame, type PatternProps } from "./frame"
import { Flip, Run } from "./motion"

// The bowl and the frame it is offset from are traced together, down one
// side, round the bottom and up the other, each window keeping level with
// the other's share of its own outline.
const bowl = { w: 40, p: 776, start: -1800 }
const frame = { w: 40, p: 1078, start: -1800 }

export function PatternBowl(props: PatternProps) {
  return (
    <PatternFrame {...props}>
      <path
        d="M0.5 -2000V119.5H383.5V-2000"
        stroke="currentColor"
        strokeDasharray="4 4"
      />
      <Run d="M0.5 -2000V119.5H383.5V-2000" {...frame} />
      <path
        d="M88 -2000V4.5A104 104 0 0 0 296 4.5V-2000"
        fill="var(--ds-background-100)"
      />
      <Flip d="M88 -2000V4.5A104 104 0 0 0 296 4.5V-2000" {...bowl} />
    </PatternFrame>
  )
}
