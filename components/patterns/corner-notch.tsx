import { PatternFrame, type PatternProps } from "./frame"
import { Flip, Run } from "./motion"

// The cut runs from the corner down to the vertical and on under the notch.
const cut = { w: 32, length: 448.14 }

export function PatternCornerNotch(props: PatternProps) {
  return (
    <PatternFrame {...props}>
      <path
        d="M0.5 0.5L204.5 116.5V-2000"
        stroke="currentColor"
        strokeDasharray="4 4"
      />
      <Flip d="M0.5 0.5L204.5 60.5" {...cut} />
      <path d="M204.5 60.5H2400" stroke="currentColor" strokeDasharray="4 4" />
      <Run d="M204.5 60.5H440" start={212.64} {...cut} />
      <rect
        x="212.5"
        y="0.5"
        width="171"
        height="52"
        rx="26"
        fill="var(--ds-background-100)"
        stroke="currentColor"
      />
      <rect x="201.5" y="113.5" width="6" height="6" fill="currentColor" />
      <rect x="201.5" y="57.5" width="6" height="6" fill="currentColor" />
    </PatternFrame>
  )
}
