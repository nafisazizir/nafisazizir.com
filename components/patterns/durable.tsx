import { PatternFrame, type PatternProps } from "./frame"

export function PatternDurable(props: PatternProps) {
  return (
    <PatternFrame {...props}>
      <path d="M152.5 36.5H224.5V84.5H152.5Z" fill="var(--ds-background-100)" />
      <path d="M224.5 36.5H-2000" stroke="currentColor" />
      <path d="M224.5 28.5V44.5" stroke="currentColor" />
      <path d="M152.5 36.5V84.5" stroke="currentColor" strokeDasharray="4 4" />
      <path d="M152.5 84.5H2400" stroke="currentColor" />
      <rect x="77.5" y="33.5" width="6" height="6" fill="currentColor" />
      <rect x="149.5" y="33.5" width="6" height="6" fill="currentColor" />
      <rect x="293.5" y="81.5" width="6" height="6" fill="currentColor" />
      <circle
        cx="224.5"
        cy="84.5"
        r="4"
        fill="var(--ds-background-100)"
        stroke="currentColor"
      />
    </PatternFrame>
  )
}
