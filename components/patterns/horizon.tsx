import { PatternFrame, type PatternProps } from "./frame"

export function PatternHorizon(props: PatternProps) {
  return (
    <PatternFrame {...props}>
      <path d="M192 60V-2000" stroke="currentColor" strokeDasharray="4 4" />
      <path
        d="M3.46 119.5A240 240 0 0 1 380.54 119.5"
        stroke="currentColor"
        strokeDasharray="4 4"
      />
      <path
        d="M46.36 119.5A208 208 0 0 1 337.64 119.5"
        fill="var(--ds-background-100)"
        stroke="currentColor"
      />
      <path d="M192 119.5H-2000M192 119.5H2400" stroke="currentColor" />
      <circle
        cx="192"
        cy="28"
        r="4"
        fill="var(--ds-background-100)"
        stroke="currentColor"
      />
    </PatternFrame>
  )
}
