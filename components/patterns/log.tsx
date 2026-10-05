import { PatternFrame, type PatternProps } from "./frame"

export function PatternLog(props: PatternProps) {
  return (
    <PatternFrame {...props}>
      <path d="M-2000 48.5H312.5V72.5H-2000Z" fill="var(--ds-background-100)" />
      <path d="M288.5 48.5H-2000M288.5 72.5H-2000" stroke="currentColor" />
      <path
        d="M288.5 48.5H312.5V72.5H288.5"
        stroke="currentColor"
        strokeDasharray="4 4"
      />
      <path
        d="M24.5 48.5V72.5M48.5 48.5V72.5M72.5 48.5V72.5M96.5 48.5V72.5M120.5 48.5V72.5M144.5 48.5V72.5M168.5 48.5V72.5M192.5 48.5V72.5M216.5 48.5V72.5M240.5 48.5V72.5M264.5 48.5V72.5M288.5 48.5V72.5"
        stroke="currentColor"
      />
      <path d="M168.5 48.5V-2000" stroke="currentColor" />
      <path d="M240.5 48.5V-2000" stroke="currentColor" strokeDasharray="4 4" />
      <rect x="165.5" y="45.5" width="6" height="6" fill="currentColor" />
      <rect
        x="237.5"
        y="45.5"
        width="6"
        height="6"
        fill="var(--ds-background-100)"
        stroke="currentColor"
      />
      <rect x="309.5" y="57.5" width="6" height="6" fill="currentColor" />
    </PatternFrame>
  )
}
