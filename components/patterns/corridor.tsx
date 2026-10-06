import { PatternFrame, type PatternProps } from "./frame"
import { Flip, on, Run } from "./motion"

// Flow down the corridor: in along the axis to the near frame, then down
// the four perspective lines to the far one. The dashed middle frame goes
// solid as the flow passes it.
const flow = { length: 263, w: 28, speed: 2 }

export function PatternCorridor(props: PatternProps) {
  return (
    <PatternFrame {...props}>
      <path d="M36.5 60H-2000" stroke="currentColor" strokeDasharray="4 4" />
      <Run d="M-100 60H36.5" {...flow} />
      <path d="M348.5 60H2400" stroke="currentColor" strokeDasharray="4 4" />
      <Run d="M484.5 60H348.5" {...flow} />
      <path d="M36.5 8.5H348.5V112.5H36.5Z" stroke="currentColor" />
      <path
        d="M96.5 28.5H288.5V92.5H96.5Z"
        stroke="currentColor"
        strokeDasharray="4 4"
      />
      <path
        d="M96.5 28.5H288.5V92.5H96.5Z"
        stroke="currentColor"
        {...on(flow, 199.75, 2)}
      />
      <Flip d="M36.5 8.5L156.5 48.5" start={136.5} {...flow} />
      <Flip d="M348.5 8.5L228.5 48.5" start={136.5} {...flow} />
      <Flip d="M348.5 112.5L228.5 72.5" start={136.5} {...flow} />
      <Flip d="M36.5 112.5L156.5 72.5" start={136.5} {...flow} />
      <path
        d="M156.5 48.5H228.5V72.5H156.5Z"
        fill="var(--ds-background-100)"
        stroke="currentColor"
      />
    </PatternFrame>
  )
}
