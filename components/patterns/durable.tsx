import { PatternFrame, type PatternProps } from "./frame"
import { Flip, on, Run } from "./motion"

// The run passes two checkpoints and is lost at the crash. It resumes from
// the last checkpoint, not the start: down the dashed drop and along the
// replay, past the point it crashed at (the ring fills) and on. The span
// it lost is toned from the crash until the replay has covered it.
// Positions are along M-40 36.5H224.5, then M152.5 36.5V84.5H600.
const run = { length: 760, w: 24 }

export function PatternDurable(props: PatternProps) {
  return (
    <PatternFrame {...props}>
      <path d="M152.5 36.5H224.5V84.5H152.5Z" fill="var(--ds-background-100)" />
      <path
        d="M152.5 36.5H224.5V84.5H152.5Z"
        fill="var(--ds-gray-300)"
        {...on(run, 324.5, 60)}
      />
      <Flip d="M-2000 36.5H224.5" start={-1960} {...run} />
      <path d="M224.5 28.5V44.5" stroke="currentColor" />
      <path d="M152.5 36.5V84.5" stroke="currentColor" strokeDasharray="4 4" />
      <Run d="M152.5 36.5V84.5" start={264.5} {...run} />
      <Flip d="M152.5 84.5H2400" start={312.5} {...run} />
      <rect x="77.5" y="33.5" width="6" height="6" fill="currentColor" />
      <rect x="149.5" y="33.5" width="6" height="6" fill="currentColor" />
      <rect x="293.5" y="81.5" width="6" height="6" fill="currentColor" />
      <circle
        cx="224.5"
        cy="84.5"
        r="4"
        fill="var(--ds-background-100)"
        stroke="currentColor"
      />
      <circle
        cx="224.5"
        cy="84.5"
        r="4"
        fill="currentColor"
        stroke="currentColor"
        {...on(run, 384.5, 4)}
      />
    </PatternFrame>
  )
}
