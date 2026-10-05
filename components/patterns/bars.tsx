import { PatternFrame, type PatternProps } from "./frame"

export function PatternBars(props: PatternProps) {
  return (
    <PatternFrame {...props}>
      <path d="M-2000 119.5H2400" stroke="currentColor" />
      <path
        d="M56.5 119.5V83.5H84.5V119.5"
        stroke="currentColor"
        strokeDasharray="4 4"
      />
      <path
        d="M100.5 119.5V59.5H128.5V119.5"
        stroke="currentColor"
        strokeDasharray="4 4"
      />
      <path
        d="M144.5 119.5V75.5H172.5V119.5"
        stroke="currentColor"
        strokeDasharray="4 4"
      />
      <path
        d="M188.5 119.5V35.5H216.5V119.5"
        stroke="currentColor"
        strokeDasharray="4 4"
      />
      <path
        d="M276.5 119.5V51.5H304.5V119.5"
        stroke="currentColor"
        strokeDasharray="4 4"
      />
      <path
        d="M320.5 119.5V67.5H348.5V119.5"
        stroke="currentColor"
        strokeDasharray="4 4"
      />
      <path
        d="M232.5 119.5V-2000H260.5V119.5Z"
        fill="var(--ds-background-100)"
        stroke="currentColor"
      />
      <path d="M232.5 35.5H-2000" stroke="currentColor" strokeDasharray="4 4" />
      <rect x="229.5" y="32.5" width="6" height="6" fill="currentColor" />
    </PatternFrame>
  )
}
