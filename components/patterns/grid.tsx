import { PatternFrame, type PatternProps } from "./frame"
import { Flip } from "./motion"

// The chosen cell's edge circulates, four windows round its 288 units.

export function PatternGrid(props: PatternProps) {
  return (
    <PatternFrame {...props}>
      <path
        d="M48.5 119.5V-2000M96.5 119.5V-2000M144.5 119.5V-2000M192.5 119.5V-2000M240.5 119.5V-2000M288.5 119.5V-2000M336.5 119.5V-2000"
        stroke="currentColor"
        strokeDasharray="4 4"
      />
      <path
        d="M-2000 24.5H2400M-2000 72.5H2400M-2000 119.5H2400"
        stroke="currentColor"
        strokeDasharray="4 4"
      />
      <path d="M144.5 24.5H240.5V72.5H144.5Z" fill="var(--ds-background-100)" />
      <Flip d="M144.5 24.5H240.5V72.5H144.5Z" w={24} p={72} speed={3} />
      <rect
        x="141.5"
        y="21.5"
        width="6"
        height="6"
        fill="var(--ds-background-100)"
        stroke="currentColor"
      />
      <rect
        x="237.5"
        y="21.5"
        width="6"
        height="6"
        fill="var(--ds-background-100)"
        stroke="currentColor"
      />
      <rect
        x="141.5"
        y="69.5"
        width="6"
        height="6"
        fill="var(--ds-background-100)"
        stroke="currentColor"
      />
      <rect
        x="237.5"
        y="69.5"
        width="6"
        height="6"
        fill="var(--ds-background-100)"
        stroke="currentColor"
      />
    </PatternFrame>
  )
}
