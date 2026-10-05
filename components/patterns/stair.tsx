import { PatternFrame, type PatternProps } from "./frame"

export function PatternStair(props: PatternProps) {
  return (
    <PatternFrame {...props}>
      <path
        d="M-2000 8.5H112.5V40.5H240.5V72.5H2400V104.5H272.5V72.5H144.5V40.5H-2000Z"
        fill="var(--ds-background-100)"
      />
      <path
        d="M112.5 8.5H-2000M112.5 8.5V40.5H240.5V72.5H2400"
        stroke="currentColor"
      />
      <path
        d="M144.5 40.5H-2000M144.5 40.5V72.5H272.5V104.5H2400"
        stroke="currentColor"
        strokeDasharray="4 4"
      />
      <rect x="109.5" y="5.5" width="6" height="6" fill="currentColor" />
      <rect x="269.5" y="101.5" width="6" height="6" fill="currentColor" />
    </PatternFrame>
  )
}
