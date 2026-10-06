import { PatternFrame, type PatternProps } from "./frame"
import { Flip, Run } from "./motion"

// Every ray is measured back from the hub, so the five streams arrive
// together and leave as one.
const inflow = { w: 28, p: 200, speed: 2 }

export function PatternFanIn(props: PatternProps) {
  return (
    <PatternFrame {...props}>
      <Flip d="M-2000 -283.03L264 60" start={-1889.84} {...inflow} />
      <path
        d="M264 60L-2000 -111.52"
        stroke="currentColor"
        strokeDasharray="4 4"
      />
      <Run d="M-2000 -111.52L264 60" start={-1870.49} {...inflow} />
      <Flip d="M-2000 60H264" start={-1864} {...inflow} />
      <path
        d="M264 60L-2000 231.52"
        stroke="currentColor"
        strokeDasharray="4 4"
      />
      <Run d="M-2000 231.52L264 60" start={-1870.49} {...inflow} />
      <Flip d="M-2000 403.03L264 60" start={-1889.84} {...inflow} />
      <Flip d="M264 60H2400" start={400} {...inflow} />
      <circle
        cx="264"
        cy="60"
        r="19.5"
        fill="var(--ds-background-100)"
        stroke="currentColor"
      />
      <circle cx="264" cy="60" r="3" fill="currentColor" />
    </PatternFrame>
  )
}
