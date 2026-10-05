import { PatternFrame, type PatternProps } from "./frame"

export function PatternBelt(props: PatternProps) {
  return (
    <PatternFrame {...props}>
      <path d="M84 60H-2000" stroke="currentColor" strokeDasharray="4 4" />
      <path d="M300 60H2400" stroke="currentColor" strokeDasharray="4 4" />
      <path d="M138 28.82L246 91.18" stroke="currentColor" />
      <path d="M138 91.18L246 28.82" stroke="currentColor" />
      <circle
        cx="120"
        cy="60"
        r="36"
        fill="var(--ds-background-100)"
        stroke="currentColor"
      />
      <circle
        cx="264"
        cy="60"
        r="36"
        fill="var(--ds-background-100)"
        stroke="currentColor"
      />
      <circle
        cx="264"
        cy="60"
        r="20"
        stroke="currentColor"
        strokeDasharray="4 4"
      />
      <circle cx="120" cy="60" r="3" fill="currentColor" />
      <circle cx="264" cy="60" r="3" fill="currentColor" />
    </PatternFrame>
  )
}
