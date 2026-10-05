import { PatternFrame, type PatternProps } from "./frame"

export function PatternLatency(props: PatternProps) {
  return (
    <PatternFrame {...props}>
      <path
        d="M24.5 84.5V84.5H48.5V84.5H72.5V80.5H96.5V80.5H120.5V80.5H144.5V84.5H168.5V84.5H192.5V88.5H216.5V88.5H240.5V84.5H264.5V84.5H288.5V80.5H312.5V80.5H336.5V84.5H360.5V112.5H24.5Z"
        fill="var(--ds-background-100)"
      />
      <path d="M-2000 112.5H2400" stroke="currentColor" />
      <path d="M-2000 28.5H2400" stroke="currentColor" strokeDasharray="4 4" />
      <path
        d="M24.5 84.5V84.5H48.5V84.5H72.5V80.5H96.5V80.5H120.5V80.5H144.5V84.5H168.5V84.5H192.5V88.5H216.5V88.5H240.5V84.5H264.5V84.5H288.5V80.5H312.5V80.5H336.5V84.5H360.5"
        stroke="currentColor"
      />
      <path
        d="M24.5 52.5V52.5H48.5V52.5H72.5V52.5H96.5V52.5H120.5V48.5H144.5V48.5H168.5V48.5H192.5V52.5H216.5V12.5H240.5V12.5H264.5V52.5H288.5V52.5H312.5V52.5H336.5V52.5H360.5"
        stroke="currentColor"
        strokeDasharray="4 4"
      />
      <rect x="213.5" y="25.5" width="6" height="6" fill="currentColor" />
      <rect x="261.5" y="25.5" width="6" height="6" fill="currentColor" />
    </PatternFrame>
  )
}
