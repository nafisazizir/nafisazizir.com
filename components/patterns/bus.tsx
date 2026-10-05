import { PatternFrame, type PatternProps } from "./frame"

export function PatternBus(props: PatternProps) {
  return (
    <PatternFrame {...props}>
      <path d="M-2000 52.5H2400V68.5H-2000Z" fill="var(--ds-background-100)" />
      <path d="M-2000 52.5H2400M-2000 68.5H2400" stroke="currentColor" />
      <path d="M88.5 52.5V-2000" stroke="currentColor" />
      <path d="M136.5 52.5V-2000" stroke="currentColor" strokeDasharray="4 4" />
      <path d="M216.5 68.5V100.5M264.5 68.5V100.5" stroke="currentColor" />
      <path d="M312.5 68.5V100.5" stroke="currentColor" strokeDasharray="4 4" />
      <rect x="85.5" y="49.5" width="6" height="6" fill="currentColor" />
      <rect
        x="133.5"
        y="49.5"
        width="6"
        height="6"
        fill="var(--ds-background-100)"
        stroke="currentColor"
      />
      <circle
        cx="216.5"
        cy="100.5"
        r="4"
        fill="var(--ds-background-100)"
        stroke="currentColor"
      />
      <circle
        cx="264.5"
        cy="100.5"
        r="4"
        fill="var(--ds-background-100)"
        stroke="currentColor"
      />
      <circle
        cx="312.5"
        cy="100.5"
        r="4"
        fill="var(--ds-background-100)"
        stroke="currentColor"
      />
    </PatternFrame>
  )
}
