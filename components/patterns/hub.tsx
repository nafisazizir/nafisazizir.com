import { PatternFrame, type PatternProps } from "./frame"

export function PatternHub(props: PatternProps) {
  return (
    <PatternFrame {...props}>
      <path d="M144 60H-2000" stroke="currentColor" strokeDasharray="4 4" />
      <path d="M240 60H2400" stroke="currentColor" />
      <circle
        cx="192"
        cy="60"
        r="48"
        stroke="currentColor"
        strokeDasharray="4 4"
      />
      <path
        d="M192 60L240 60M192 60L216 101.57M192 60L144 60M192 60L168 18.43M192 60L216 18.43"
        stroke="currentColor"
      />
      <circle
        cx="240"
        cy="60"
        r="10"
        fill="var(--ds-background-100)"
        stroke="currentColor"
      />
      <circle
        cx="216"
        cy="101.57"
        r="10"
        fill="var(--ds-background-100)"
        stroke="currentColor"
      />
      <circle
        cx="144"
        cy="60"
        r="10"
        fill="var(--ds-background-100)"
        stroke="currentColor"
      />
      <circle
        cx="168"
        cy="18.43"
        r="10"
        fill="var(--ds-background-100)"
        stroke="currentColor"
      />
      <circle
        cx="216"
        cy="18.43"
        r="10"
        fill="var(--ds-background-100)"
        stroke="currentColor"
      />
      <circle
        cx="168"
        cy="101.57"
        r="10"
        fill="var(--ds-background-100)"
        stroke="currentColor"
        strokeDasharray="4 4"
      />
      <circle
        cx="192"
        cy="60"
        r="20"
        fill="var(--ds-background-100)"
        stroke="currentColor"
      />
      <circle cx="192" cy="60" r="3" fill="currentColor" />
    </PatternFrame>
  )
}
