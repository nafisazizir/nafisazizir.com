import { PatternFrame, type PatternProps } from "./frame"

export function PatternMask(props: PatternProps) {
  return (
    <PatternFrame {...props}>
      <path d="M136.5 80.0H-2000" stroke="currentColor" strokeDasharray="4 4" />
      <path d="M169.0 8.5V-2000" stroke="currentColor" strokeDasharray="4 4" />
      <path d="M240.5 60.5H2400" stroke="currentColor" />
      <rect
        x="136.5"
        y="8.5"
        width="104"
        height="104"
        stroke="currentColor"
        strokeDasharray="4 4"
      />
      <path
        d="M136.5 8.5H149.5V21.5H162.5V34.5H175.5V47.5H188.5V60.5H201.5V73.5H214.5V86.5H227.5V99.5H240.5V112.5H136.5Z"
        fill="var(--ds-background-100)"
        stroke="currentColor"
      />
      <path
        d="M136.5 80.0H169.0V8.5"
        stroke="currentColor"
        strokeDasharray="4 4"
      />
      <rect x="166" y="77" width="6" height="6" fill="currentColor" />
    </PatternFrame>
  )
}
