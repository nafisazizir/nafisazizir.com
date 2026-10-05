import { PatternFrame, type PatternProps } from "./frame"

export function PatternEclipse(props: PatternProps) {
  return (
    <PatternFrame {...props}>
      <path d="M108 60H-2000" stroke="currentColor" strokeDasharray="4 4" />
      <path d="M276 60H2400" stroke="currentColor" />
      <circle
        cx="164"
        cy="60"
        r="55.5"
        fill="var(--ds-background-100)"
        stroke="currentColor"
        strokeDasharray="4 4"
      />
      <circle cx="220" cy="60" r="55.5" stroke="currentColor" />
      <circle
        cx="192"
        cy="12.08"
        r="4"
        fill="var(--ds-background-100)"
        stroke="currentColor"
      />
      <circle
        cx="192"
        cy="107.92"
        r="4"
        fill="var(--ds-background-100)"
        stroke="currentColor"
      />
    </PatternFrame>
  )
}
