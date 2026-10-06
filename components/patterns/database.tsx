import { PatternFrame, type PatternProps } from "./frame"
import { Flip, on, Run } from "./motion"

// Along M-60 60H440: a write comes in, the layers it lands in are committed
// while it is inside the store, and the read goes out.
const write = { length: 500, w: 32 }

export function PatternDatabase(props: PatternProps) {
  return (
    <PatternFrame loop={8} {...props}>
      <path d="M136 60H-2000" stroke="currentColor" strokeDasharray="4 4" />
      <Run d="M-60 60H136" {...write} />
      <Flip d="M248 60H2400" start={308} {...write} />
      <path
        d="M136 18V102A56 14 0 0 0 248 102V18"
        fill="var(--ds-background-100)"
        stroke="currentColor"
      />
      <path
        d="M136 46A56 14 0 0 0 248 46M136 74A56 14 0 0 0 248 74"
        stroke="currentColor"
        strokeDasharray="4 4"
      />
      <path
        d="M136 46A56 14 0 0 0 248 46M136 74A56 14 0 0 0 248 74"
        stroke="currentColor"
        {...on(write, 252, 56)}
      />
      <ellipse
        cx="192"
        cy="18"
        rx="56"
        ry="14"
        fill="var(--ds-background-100)"
        stroke="currentColor"
      />
      <rect x="245" y="57" width="6" height="6" fill="currentColor" />
    </PatternFrame>
  )
}
