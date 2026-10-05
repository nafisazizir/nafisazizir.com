import { PatternFrame, type PatternProps } from "./frame"

export function PatternSlots(props: PatternProps) {
  return (
    <PatternFrame {...props}>
      <path
        d="M-2000 56.5H112.5V-2000"
        stroke="currentColor"
        strokeDasharray="4 4"
      />
      <path
        d="M271.5 -2000V56.5H383.5V-2000"
        stroke="currentColor"
        strokeDasharray="4 4"
      />
      <path d="M-2000 119.5H2400" stroke="currentColor" strokeDasharray="4 4" />
      <path
        d="M136.5 -2000V88.5H247.5V-2000"
        fill="var(--ds-background-100)"
        stroke="currentColor"
      />
    </PatternFrame>
  )
}
