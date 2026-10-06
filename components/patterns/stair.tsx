import { PatternFrame, type PatternProps } from "./frame"
import { Flip, Run } from "./motion"

// The band flows down the steps: windows run both edges in step, dashed on
// the solid edge and solid on the dashed one, each lower point 32 on from
// the upper one it pairs with.
const flow = { w: 32, p: 264, speed: 2 }

export function PatternStair(props: PatternProps) {
  return (
    <PatternFrame {...props}>
      <path
        d="M-2000 8.5H112.5V40.5H240.5V72.5H2400V104.5H272.5V72.5H144.5V40.5H-2000Z"
        fill="var(--ds-background-100)"
      />
      <Flip d="M-2000 8.5H112.5V40.5H240.5V72.5H2400" start={-1960} {...flow} />
      <path
        d="M144.5 40.5H-2000M144.5 40.5V72.5H272.5V104.5H2400"
        stroke="currentColor"
        strokeDasharray="4 4"
      />
      <Run d="M-40 40.5H144.5V72.5H272.5V104.5H424" start={-32} {...flow} />
      <rect x="109.5" y="5.5" width="6" height="6" fill="currentColor" />
      <rect x="269.5" y="101.5" width="6" height="6" fill="currentColor" />
    </PatternFrame>
  )
}
