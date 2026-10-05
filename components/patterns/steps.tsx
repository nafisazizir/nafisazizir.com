import { PatternFrame, type PatternProps } from "./frame"

export function PatternSteps(props: PatternProps) {
  return (
    <PatternFrame {...props}>
      <path d="M0.5 119.5L88.5 31.5" stroke="currentColor" />
      <path
        d="M0.5 -2000V119.5H152.5V-2000"
        stroke="currentColor"
        strokeDasharray="4 4"
      />
      <path
        d="M32.5 -2000V87.5H216.5V-2000"
        stroke="currentColor"
        strokeDasharray="4 4"
      />
      <path
        d="M88.5 -2000V31.5H2400"
        stroke="currentColor"
        strokeDasharray="4 4"
      />
      <path d="M272.5 -2000V31.5" stroke="currentColor" strokeDasharray="4 4" />
      <rect
        x="93"
        y="-2000"
        width="48"
        height="2027"
        fill="var(--ds-background-100)"
      />
      <circle
        cx="32.5"
        cy="87.5"
        r="4"
        fill="var(--ds-background-100)"
        stroke="currentColor"
      />
      <circle
        cx="88.5"
        cy="31.5"
        r="4"
        fill="var(--ds-background-100)"
        stroke="currentColor"
      />
    </PatternFrame>
  )
}
