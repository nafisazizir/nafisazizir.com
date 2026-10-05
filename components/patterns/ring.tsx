import { PatternFrame, type PatternProps } from "./frame"

export function PatternRing(props: PatternProps) {
  return (
    <PatternFrame {...props}>
      <path d="M144 60H-2000" stroke="currentColor" strokeDasharray="4 4" />
      <path d="M168 18.43L-1308 -2538.08" stroke="currentColor" />
      <circle
        cx="192"
        cy="60"
        r="48"
        fill="var(--ds-background-100)"
        stroke="currentColor"
        strokeDasharray="4 4"
      />
      <path d="M144 60A48 48 0 0 1 168 18.43" stroke="currentColor" />
      <circle
        cx="233.57"
        cy="36"
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
      <circle cx="168" cy="18.43" r="4" fill="currentColor" />
      <rect x="141" y="57" width="6" height="6" fill="currentColor" />
    </PatternFrame>
  )
}
