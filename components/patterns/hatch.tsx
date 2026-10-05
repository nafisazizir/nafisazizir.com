import { PatternFrame, type PatternProps } from "./frame"

// 45° guides every 16 along the bottom edge, running out through the top.
const hatch = Array.from(
  { length: 12 },
  (_, i) => `M${8.5 + i * 16} 119.5l2119.5 -2119.5`
).join("")

export function PatternHatch(props: PatternProps) {
  return (
    <PatternFrame {...props}>
      <path d={hatch} stroke="currentColor" strokeDasharray="4 4" />
      <path
        d="M200.5 119.5L2320 -2000H2352L232.5 119.5Z"
        fill="var(--ds-background-100)"
      />
      <path
        d="M200.5 119.5L2320 -2000M232.5 119.5L2352 -2000"
        stroke="currentColor"
      />
      <path d="M200.5 119.5H-2000" stroke="currentColor" />
      <path d="M232.5 119.5H2400" stroke="currentColor" strokeDasharray="4 4" />
    </PatternFrame>
  )
}
