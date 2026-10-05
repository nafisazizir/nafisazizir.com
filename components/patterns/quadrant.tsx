import { PatternFrame, type PatternProps } from "./frame"

export function PatternQuadrant(props: PatternProps) {
  return (
    <PatternFrame {...props}>
      <path
        d="M192 116.5L-2489 -1507.5"
        stroke="currentColor"
        strokeDasharray="4 4"
      />
      <path d="M192 -2000V116.5H2400" stroke="currentColor" />
      <path
        d="M200 -2000V16.75A91.75 91.75 0 0 0 383.5 16.75V-2000"
        fill="var(--ds-background-100)"
        stroke="currentColor"
      />
      <rect x="189" y="113.5" width="6" height="6" fill="currentColor" />
    </PatternFrame>
  )
}
