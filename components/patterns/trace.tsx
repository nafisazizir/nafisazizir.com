import { PatternFrame, type PatternProps } from "./frame"

export function PatternTrace(props: PatternProps) {
  return (
    <PatternFrame {...props}>
      <path d="M264.5 96V-2000" stroke="currentColor" strokeDasharray="4 4" />
      <rect
        x="40.5"
        y="8.5"
        width="304"
        height="14"
        fill="var(--ds-background-100)"
        stroke="currentColor"
      />
      <rect
        x="56.5"
        y="30.5"
        width="144"
        height="14"
        fill="var(--ds-background-100)"
        stroke="currentColor"
      />
      <rect
        x="208.5"
        y="30.5"
        width="120"
        height="14"
        fill="var(--ds-background-100)"
        stroke="currentColor"
      />
      <rect
        x="72.5"
        y="52.5"
        width="72"
        height="14"
        fill="var(--ds-background-100)"
        stroke="currentColor"
      />
      <rect
        x="152.5"
        y="52.5"
        width="40"
        height="14"
        fill="var(--ds-background-100)"
        stroke="currentColor"
        strokeDasharray="4 4"
      />
      <rect
        x="216.5"
        y="52.5"
        width="72"
        height="14"
        fill="var(--ds-background-100)"
        stroke="currentColor"
      />
      <rect
        x="224.5"
        y="74.5"
        width="40"
        height="14"
        fill="var(--ds-background-100)"
        stroke="currentColor"
      />
      <rect x="261.5" y="93" width="6" height="6" fill="currentColor" />
    </PatternFrame>
  )
}
