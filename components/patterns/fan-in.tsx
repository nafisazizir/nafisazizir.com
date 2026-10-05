import { PatternFrame, type PatternProps } from "./frame"

export function PatternFanIn(props: PatternProps) {
  return (
    <PatternFrame {...props}>
      <path d="M264 60L-2000 -283.03" stroke="currentColor" />
      <path
        d="M264 60L-2000 -111.52"
        stroke="currentColor"
        strokeDasharray="4 4"
      />
      <path d="M264 60L-2000 60" stroke="currentColor" />
      <path
        d="M264 60L-2000 231.52"
        stroke="currentColor"
        strokeDasharray="4 4"
      />
      <path d="M264 60L-2000 403.03" stroke="currentColor" />
      <path d="M264 60H2400" stroke="currentColor" />
      <circle
        cx="264"
        cy="60"
        r="19.5"
        fill="var(--ds-background-100)"
        stroke="currentColor"
      />
      <circle cx="264" cy="60" r="3" fill="currentColor" />
    </PatternFrame>
  )
}
