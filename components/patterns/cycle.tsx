import { PatternFrame, type PatternProps } from "./frame"

export function PatternCycle(props: PatternProps) {
  return (
    <PatternFrame {...props}>
      <path d="M144 60H-2000" stroke="currentColor" />
      <path d="M240 60H2400" stroke="currentColor" strokeDasharray="4 4" />
      <circle
        cx="192"
        cy="60"
        r="48"
        stroke="currentColor"
        strokeDasharray="4 4"
      />
      <path d="M144 60A48 48 0 0 1 240 60" stroke="currentColor" />
      <circle
        cx="192"
        cy="60"
        r="20"
        fill="var(--ds-background-100)"
        stroke="currentColor"
      />
      <circle
        cx="144"
        cy="60"
        r="4"
        fill="var(--ds-background-100)"
        stroke="currentColor"
      />
      <circle
        cx="240"
        cy="60"
        r="4"
        fill="var(--ds-background-100)"
        stroke="currentColor"
      />
      <circle
        cx="192"
        cy="108"
        r="4"
        fill="var(--ds-background-100)"
        stroke="currentColor"
      />
      <circle cx="192" cy="12" r="4" fill="currentColor" />
    </PatternFrame>
  )
}
