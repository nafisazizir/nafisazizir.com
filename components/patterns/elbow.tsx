import { PatternFrame, type PatternProps } from "./frame"
import { Run } from "./motion"

// Flow through the pipe along its centreline, M168.5 -200V56.5, the bend
// and out to the right, at one even pace through the turn.
const flow = { w: 32, p: 112, speed: 2 }

export function PatternElbow(props: PatternProps) {
  return (
    <PatternFrame {...props}>
      <path
        d="M144.5 56.5V-2000H192.5V56.5A8 8 0 0 0 200.5 64.5H2400V112.5H200.5A56 56 0 0 1 144.5 56.5Z"
        fill="var(--ds-background-100)"
      />
      <path
        d="M144.5 56.5A56 56 0 0 0 200.5 112.5H2400M144.5 56.5V-2000"
        stroke="currentColor"
      />
      <path
        d="M192.5 56.5A8 8 0 0 0 200.5 64.5H2400M192.5 56.5V-2000"
        stroke="currentColor"
      />
      <path
        d="M168.5 56.5A32 32 0 0 0 200.5 88.5"
        stroke="currentColor"
        strokeDasharray="4 4"
      />
      <Run d="M168.5 56.5A32 32 0 0 0 200.5 88.5" start={256.5} {...flow} />
      <path d="M168.5 56.5V-2000" stroke="currentColor" strokeDasharray="4 4" />
      <Run d="M168.5 -200V56.5" {...flow} />
      <path d="M200.5 88.5H2400" stroke="currentColor" strokeDasharray="4 4" />
      <Run d="M200.5 88.5H600" start={306.77} {...flow} />
    </PatternFrame>
  )
}
