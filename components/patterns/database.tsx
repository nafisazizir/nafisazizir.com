import { PatternFrame, type PatternProps } from "./frame"

export function PatternDatabase(props: PatternProps) {
  return (
    <PatternFrame {...props}>
      <path d="M136 60H-2000" stroke="currentColor" strokeDasharray="4 4" />
      <path d="M248 60H2400" stroke="currentColor" />
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
