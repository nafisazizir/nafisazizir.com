import { PatternFrame, type PatternProps } from "./frame"

export function PatternLens(props: PatternProps) {
  return (
    <PatternFrame {...props}>
      <path d="M-2000 0.5H192V119.5H-2000" stroke="currentColor" />
      <path d="M162 60H2400" stroke="currentColor" />
      <path d="M-2000 60H132" stroke="currentColor" strokeDasharray="4 4" />
      <circle cx="192" cy="60" r="59.5" stroke="currentColor" />
      <circle cx="165" cy="60" r="3" fill="currentColor" />
      <circle
        cx="192"
        cy="60"
        r="17"
        fill="var(--ds-background-100)"
        stroke="currentColor"
      />
    </PatternFrame>
  )
}
