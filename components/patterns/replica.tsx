import { PatternFrame, type PatternProps } from "./frame"

export function PatternReplica(props: PatternProps) {
  return (
    <PatternFrame {...props}>
      <path d="M88 60H-2000" stroke="currentColor" />
      <path
        d="M284 24H2400M284 96H2400"
        stroke="currentColor"
        strokeDasharray="4 4"
      />
      <path d="M120 60L264 24" stroke="currentColor" />
      <path d="M120 60L264 96" stroke="currentColor" strokeDasharray="4 4" />
      <circle
        cx="120"
        cy="60"
        r="32"
        fill="var(--ds-background-100)"
        stroke="currentColor"
      />
      <circle
        cx="264"
        cy="24"
        r="20"
        fill="var(--ds-background-100)"
        stroke="currentColor"
      />
      <circle
        cx="264"
        cy="96"
        r="20"
        fill="var(--ds-background-100)"
        stroke="currentColor"
        strokeDasharray="4 4"
      />
      <circle cx="120" cy="60" r="3" fill="currentColor" />
    </PatternFrame>
  )
}
