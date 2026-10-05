import { PatternFrame, type PatternProps } from "./frame"

export function PatternLinkedList(props: PatternProps) {
  return (
    <PatternFrame {...props}>
      <path d="M40.5 60.5H-2000" stroke="currentColor" strokeDasharray="4 4" />
      <path d="M104.5 60.5H152.5" stroke="currentColor" />
      <path d="M216.5 60.5H264.5" stroke="currentColor" />
      <rect
        x="40.5"
        y="36.5"
        width="80"
        height="48"
        fill="var(--ds-background-100)"
        stroke="currentColor"
      />
      <path d="M96.5 36.5V84.5" stroke="currentColor" />
      <circle cx="108.5" cy="60.5" r="3" fill="currentColor" />
      <rect
        x="152.5"
        y="36.5"
        width="80"
        height="48"
        fill="var(--ds-background-100)"
        stroke="currentColor"
      />
      <path d="M208.5 36.5V84.5" stroke="currentColor" />
      <circle cx="220.5" cy="60.5" r="3" fill="currentColor" />
      <rect
        x="264.5"
        y="36.5"
        width="80"
        height="48"
        fill="var(--ds-background-100)"
        stroke="currentColor"
      />
      <path d="M320.5 36.5V84.5" stroke="currentColor" />
      <path d="M320.5 84.5L344.5 36.5" stroke="currentColor" />
      <rect x="37.5" y="57.5" width="6" height="6" fill="currentColor" />
    </PatternFrame>
  )
}
