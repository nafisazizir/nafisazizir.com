import { PatternFrame, type PatternProps } from "./frame"

export function PatternTangent(props: PatternProps) {
  return (
    <PatternFrame {...props}>
      <path d="M88 60H-2000" stroke="currentColor" strokeDasharray="4 4" />
      <circle
        cx="144"
        cy="60"
        r="56"
        stroke="currentColor"
        strokeDasharray="4 4"
      />
      <path d="M172 108.5L3824.02 -2000" stroke="currentColor" />
      <path d="M144 60L172 108.5" stroke="currentColor" strokeDasharray="4 4" />
      <circle
        cx="144"
        cy="60"
        r="36"
        fill="var(--ds-background-100)"
        stroke="currentColor"
      />
      <rect x="169" y="105.5" width="6" height="6" fill="currentColor" />
    </PatternFrame>
  )
}
