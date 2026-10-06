import { PatternFrame, type PatternProps } from "./frame"
import { Flip, on, Run } from "./motion"

// A write comes in to the primary along M-60 60H120 and replicates to
// both replicas from its centre. The lagging replica's copy leaves later,
// so it holds the write after the other one does.
const write = { p: 352.43, w: 24 }
const lagging = { ...write, phase: 0.34 }

const held = (cy: number, timing: typeof write, arrival: number) => (
  <circle
    cx="264"
    cy={cy}
    r="3"
    fill="currentColor"
    {...on(timing, arrival + 70, 70)}
  />
)

export function PatternReplica(props: PatternProps) {
  return (
    <PatternFrame loop={8} {...props}>
      <Flip d="M-2000 60H88" start={-1940} {...write} />
      <path
        d="M284 24H2400M284 96H2400"
        stroke="currentColor"
        strokeDasharray="4 4"
      />
      <Flip d="M120 60L264 24" start={180} {...write} />
      <path d="M120 60L264 96" stroke="currentColor" strokeDasharray="4 4" />
      <Run d="M120 60L264 96" {...lagging} />
      <circle
        cx="120"
        cy="60"
        r="32"
        fill="var(--ds-background-100)"
        stroke="currentColor"
      />
      <circle
        cx="264"
        cy="24"
        r="20"
        fill="var(--ds-background-100)"
        stroke="currentColor"
      />
      {held(24, write, 328.43)}
      <circle
        cx="264"
        cy="96"
        r="20"
        fill="var(--ds-background-100)"
        stroke="currentColor"
        strokeDasharray="4 4"
      />
      {held(96, lagging, 148.43)}
      <circle cx="120" cy="60" r="3" fill="currentColor" />
    </PatternFrame>
  )
}
