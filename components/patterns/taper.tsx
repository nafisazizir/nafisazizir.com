import { PatternFrame, type PatternProps } from "./frame"

export function PatternTaper(props: PatternProps) {
  return (
    <PatternFrame {...props}>
      <path d="M320 60L-2000 -313.38V433.38Z" fill="var(--ds-background-100)" />
      <path d="M320 60L-2000 -313.38" stroke="currentColor" />
      <path
        d="M320 60L-2000 433.38"
        stroke="currentColor"
        strokeDasharray="4 4"
      />
      <path d="M320 60H2400" stroke="currentColor" />
      <path
        d="M128.5 28.88V90.82"
        stroke="currentColor"
        strokeDasharray="4 4"
      />
      <path
        d="M224.5 44.48V75.37"
        stroke="currentColor"
        strokeDasharray="4 4"
      />
      <rect x="317" y="57" width="6" height="6" fill="currentColor" />
    </PatternFrame>
  )
}
