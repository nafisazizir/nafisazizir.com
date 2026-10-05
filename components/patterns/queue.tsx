import { PatternFrame, type PatternProps } from "./frame"

export function PatternQueue(props: PatternProps) {
  return (
    <PatternFrame {...props}>
      <path d="M-2000 40.5H2400V80.5H-2000Z" fill="var(--ds-background-100)" />
      <path d="M-2000 40.5H2400M-2000 80.5H2400" stroke="currentColor" />
      <rect
        x="88.5"
        y="48.5"
        width="24"
        height="24"
        stroke="currentColor"
        strokeDasharray="4 4"
      />
      <rect
        x="120.5"
        y="48.5"
        width="24"
        height="24"
        stroke="currentColor"
        strokeDasharray="4 4"
      />
      <rect
        x="152.5"
        y="48.5"
        width="24"
        height="24"
        fill="var(--ds-background-100)"
        stroke="currentColor"
      />
      <rect
        x="184.5"
        y="48.5"
        width="24"
        height="24"
        fill="var(--ds-background-100)"
        stroke="currentColor"
      />
      <rect
        x="216.5"
        y="48.5"
        width="24"
        height="24"
        fill="var(--ds-background-100)"
        stroke="currentColor"
      />
      <rect
        x="248.5"
        y="48.5"
        width="24"
        height="24"
        fill="var(--ds-background-100)"
        stroke="currentColor"
      />
      <path d="M72.5 40.5V-2000" stroke="currentColor" strokeDasharray="4 4" />
      <path d="M296.5 40.5V-2000" stroke="currentColor" />
      <rect
        x="69.5"
        y="37.5"
        width="6"
        height="6"
        fill="var(--ds-background-100)"
        stroke="currentColor"
      />
      <rect x="293.5" y="37.5" width="6" height="6" fill="currentColor" />
    </PatternFrame>
  )
}
