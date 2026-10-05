import { PatternFrame, type PatternProps } from "./frame"

export function PatternCone(props: PatternProps) {
  return (
    <PatternFrame {...props}>
      <path d="M48 60H-2000" stroke="currentColor" strokeDasharray="4 4" />
      <path d="M344 60H2400" stroke="currentColor" />
      <path
        d="M344 60L117.07 5.55A56 56 0 1 0 117.07 114.45Z"
        fill="var(--ds-background-100)"
        stroke="currentColor"
      />
      <circle
        cx="104"
        cy="60"
        r="56"
        stroke="currentColor"
        strokeDasharray="4 4"
      />
      <circle
        cx="104"
        cy="60"
        r="20"
        stroke="currentColor"
        strokeDasharray="4 4"
      />
      <rect x="341" y="57" width="6" height="6" fill="currentColor" />
    </PatternFrame>
  )
}
