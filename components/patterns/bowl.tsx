import { PatternFrame, type PatternProps } from "./frame"

export function PatternBowl(props: PatternProps) {
  return (
    <PatternFrame {...props}>
      <path
        d="M0.5 -2000V119.5H383.5V-2000"
        stroke="currentColor"
        strokeDasharray="4 4"
      />
      <path
        d="M88 -2000V4.5A104 104 0 0 0 296 4.5V-2000"
        fill="var(--ds-background-100)"
        stroke="currentColor"
      />
    </PatternFrame>
  )
}
