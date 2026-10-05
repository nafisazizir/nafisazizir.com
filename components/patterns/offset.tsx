import { PatternFrame, type PatternProps } from "./frame"

export function PatternOffset(props: PatternProps) {
  return (
    <PatternFrame {...props}>
      <path
        d="M-2000 16.5H240.5V72.5H-2000Z"
        fill="var(--ds-background-100)"
        stroke="currentColor"
      />
      <path
        d="M2400 48.5H144.5V104.5H2400Z"
        fill="var(--ds-background-100)"
        stroke="currentColor"
      />
      <path
        d="M144.5 72.5H240.5V48.5"
        stroke="currentColor"
        strokeDasharray="4 4"
      />
      <rect x="237.5" y="45.5" width="6" height="6" fill="currentColor" />
      <rect x="141.5" y="69.5" width="6" height="6" fill="currentColor" />
    </PatternFrame>
  )
}
