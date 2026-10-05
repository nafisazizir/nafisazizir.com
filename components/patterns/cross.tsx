import { PatternFrame, type PatternProps } from "./frame"

export function PatternCross(props: PatternProps) {
  return (
    <PatternFrame {...props}>
      <path d="M-2000 119.5H2400" stroke="currentColor" strokeDasharray="4 4" />
      <path
        d="M216.5 104.5V-2000H264.5V104.5Z"
        fill="var(--ds-background-100)"
        stroke="currentColor"
      />
      <path d="M-2000 40.5H2400V72.5H-2000Z" fill="var(--ds-background-100)" />
      <path d="M-2000 40.5H2400M-2000 72.5H2400" stroke="currentColor" />
      <path
        d="M216.5 40.5V72.5M264.5 40.5V72.5"
        stroke="currentColor"
        strokeDasharray="4 4"
      />
      <rect x="237.5" y="101.5" width="6" height="6" fill="currentColor" />
    </PatternFrame>
  )
}
