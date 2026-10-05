import { PatternFrame, type PatternProps } from "./frame"

export function PatternCorridor(props: PatternProps) {
  return (
    <PatternFrame {...props}>
      <path d="M36.5 60H-2000" stroke="currentColor" strokeDasharray="4 4" />
      <path d="M348.5 60H2400" stroke="currentColor" strokeDasharray="4 4" />
      <path d="M36.5 8.5H348.5V112.5H36.5Z" stroke="currentColor" />
      <path
        d="M96.5 28.5H288.5V92.5H96.5Z"
        stroke="currentColor"
        strokeDasharray="4 4"
      />
      <path
        d="M156.5 48.5L36.5 8.5M228.5 48.5L348.5 8.5M228.5 72.5L348.5 112.5M156.5 72.5L36.5 112.5"
        stroke="currentColor"
      />
      <path
        d="M156.5 48.5H228.5V72.5H156.5Z"
        fill="var(--ds-background-100)"
        stroke="currentColor"
      />
    </PatternFrame>
  )
}
