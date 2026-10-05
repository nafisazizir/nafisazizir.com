import { PatternFrame, type PatternProps } from "./frame"

export function PatternAngle(props: PatternProps) {
  return (
    <PatternFrame {...props}>
      <path d="M48.5 116.5H2400" stroke="currentColor" />
      <path
        d="M48.5 116.5L1895.48 -2247.53"
        stroke="currentColor"
        strokeDasharray="4 4"
      />
      <path
        d="M48.5 116.5H248.5A200 200 0 0 0 231.21 35.15Z"
        fill="var(--ds-background-100)"
        stroke="currentColor"
      />
      <path d="M48.5 116.5L2789.14 -1103.71" stroke="currentColor" />
      <path
        d="M96.5 116.5A48 48 0 0 0 78.05 78.68"
        stroke="currentColor"
        strokeDasharray="4 4"
      />
      <circle
        cx="231.21"
        cy="35.15"
        r="4"
        fill="var(--ds-background-100)"
        stroke="currentColor"
      />
      <rect x="45.5" y="113.5" width="6" height="6" fill="currentColor" />
    </PatternFrame>
  )
}
