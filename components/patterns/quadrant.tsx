import { PatternFrame, type PatternProps } from "./frame"
import { Flip, Run } from "./motion"

// Flow comes in down the dashed diagonal to the origin and leaves along
// both axes that bound the quadrant.
const flow = { length: 600, w: 32 }

export function PatternQuadrant(props: PatternProps) {
  return (
    <PatternFrame {...props}>
      <path
        d="M192 116.5L-2489 -1507.5"
        stroke="currentColor"
        strokeDasharray="4 4"
      />
      <Run d="M-64.6 -38.9L192 116.5" {...flow} />
      <Flip d="M192 116.5V-2000" start={300} {...flow} />
      <Flip d="M192 116.5H2400" start={300} {...flow} />
      <path
        d="M200 -2000V16.75A91.75 91.75 0 0 0 383.5 16.75V-2000"
        fill="var(--ds-background-100)"
        stroke="currentColor"
      />
      <rect x="189" y="113.5" width="6" height="6" fill="currentColor" />
    </PatternFrame>
  )
}
