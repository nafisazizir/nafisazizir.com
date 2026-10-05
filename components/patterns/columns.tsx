import { PatternFrame, type PatternProps } from "./frame"

export function PatternColumns(props: PatternProps) {
  return (
    <PatternFrame {...props}>
      <path
        d="M104.5 -2000V119.5H160.5V-2000"
        fill="var(--ds-background-100)"
        stroke="currentColor"
      />
      <path
        d="M-2000 60.5H80.5V119.5H-2000"
        stroke="currentColor"
        strokeDasharray="4 4"
      />
      <path
        d="M184.5 -2000V119.5H240.5V-2000"
        stroke="currentColor"
        strokeDasharray="4 4"
      />
      <path
        d="M264.5 -2000V119.5H320.5V-2000"
        stroke="currentColor"
        strokeDasharray="4 4"
      />
      <path
        d="M344.5 -2000V119.5H2400"
        stroke="currentColor"
        strokeDasharray="4 4"
      />
    </PatternFrame>
  )
}
