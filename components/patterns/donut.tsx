import { PatternFrame, type PatternProps } from "./frame"
import { Flip } from "./motion"

// Reading the share: a window sweeps the rim clockwise from twelve o'clock,
// and as it crosses the middle of the toned share its label is read out,
// running along the leader.
const sweep = { w: 40, p: 351.86, speed: 2 }

export function PatternDonut(props: PatternProps) {
  return (
    <PatternFrame {...props}>
      <Flip d="M216.5 32L230.35 24H2400" start={58.64} {...sweep} />
      <path
        d="M112 60a56 56 0 1 0 112 0a56 56 0 1 0 -112 0M132 60a36 36 0 1 0 72 0a36 36 0 1 0 -72 0"
        fill="var(--ds-background-100)"
        fillRule="evenodd"
      />
      <path
        d="M132 60a36 36 0 1 0 72 0a36 36 0 1 0 -72 0"
        stroke="currentColor"
      />
      <path
        d="M136.82 78L119.5 88M140.42 36.86L125.1 24"
        stroke="currentColor"
      />
      <path
        d="M168 4A56 56 0 0 1 216.5 88L199.18 78A36 36 0 0 0 168 24Z"
        fill="var(--ds-gray-300)"
      />
      <path
        d="M216.5 88L199.18 78A36 36 0 0 0 168 24L168 4"
        stroke="currentColor"
      />
      <Flip d="M168 4A56 56 0 0 1 168 116A56 56 0 0 1 168 4" {...sweep} />
      <rect x="227.35" y="21" width="6" height="6" fill="currentColor" />
    </PatternFrame>
  )
}
