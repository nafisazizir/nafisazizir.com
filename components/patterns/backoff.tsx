import { PatternFrame, type PatternProps } from "./frame"

export function PatternBackoff(props: PatternProps) {
  return (
    <PatternFrame {...props}>
      <path d="M40.5 96.5H-2000" stroke="currentColor" strokeDasharray="4 4" />
      <path d="M40.5 96.5H264.5" stroke="currentColor" strokeDasharray="4 4" />
      <path
        d="M40.5 96.5A16.0 16.0 0 0 1 72.5 96.5M72.5 96.5A32.0 32.0 0 0 1 136.5 96.5M136.5 96.5A64.0 64.0 0 0 1 264.5 96.5"
        stroke="currentColor"
      />
      <path d="M264.5 96.5H2400" stroke="currentColor" />
      <circle
        cx="40.5"
        cy="96.5"
        r="4"
        fill="var(--ds-background-100)"
        stroke="currentColor"
      />
      <circle
        cx="72.5"
        cy="96.5"
        r="4"
        fill="var(--ds-background-100)"
        stroke="currentColor"
      />
      <circle
        cx="136.5"
        cy="96.5"
        r="4"
        fill="var(--ds-background-100)"
        stroke="currentColor"
      />
      <rect x="261.5" y="93.5" width="6" height="6" fill="currentColor" />
    </PatternFrame>
  )
}
