import { PatternFrame, type PatternProps } from "./frame"
import { Flip, march } from "./motion"

// 45° guides every 16 along the bottom edge, running out through the top.
// The guides run up along themselves, and a wave rises through the band,
// both its edges going dashed in step.
const hatch = Array.from(
  { length: 12 },
  (_, i) => `M${8.5 + i * 16} 119.5l2119.5 -2119.5`
).join("")

const rise = { w: 32, p: 224, speed: 3 }

export function PatternHatch(props: PatternProps) {
  return (
    <PatternFrame {...props}>
      <path
        d={hatch}
        stroke="currentColor"
        strokeDasharray="4 4"
        {...march({ speed: 6 })}
      />
      <path
        d="M200.5 119.5L2320 -2000H2352L232.5 119.5Z"
        fill="var(--ds-background-100)"
      />
      <Flip d="M200.5 119.5L2320 -2000" {...rise} />
      <Flip d="M232.5 119.5L2352 -2000" {...rise} />
      <path d="M200.5 119.5H-2000" stroke="currentColor" />
      <path d="M232.5 119.5H2400" stroke="currentColor" strokeDasharray="4 4" />
    </PatternFrame>
  )
}
