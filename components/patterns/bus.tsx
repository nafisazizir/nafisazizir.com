import { PatternFrame, type PatternProps } from "./frame"
import { Flip, on } from "./motion"

// The solid publisher puts a message on the bus; it runs along the bus
// and, as it passes each solid subscriber, a copy drops to it and its ring
// fills. The dashed publisher is silent and the dashed subscriber is not
// subscribed. Positions are along M88.5 -200V68.5H600, with each
// subscriber branching off where it meets the bus.
const message = { length: 780, w: 24 }

const delivered = (cx: number, at: number) => (
  <circle
    cx={cx}
    cy="100.5"
    r="4"
    fill="currentColor"
    stroke="currentColor"
    {...on(message, at, 4)}
  />
)

export function PatternBus(props: PatternProps) {
  return (
    <PatternFrame loop={10} {...props}>
      <path d="M-2000 52.5H2400V68.5H-2000Z" fill="var(--ds-background-100)" />
      <path d="M-2000 52.5H2400" stroke="currentColor" />
      <path d="M-2000 68.5H88.5" stroke="currentColor" />
      <Flip d="M88.5 68.5H2400" start={268.5} {...message} />
      <Flip d="M88.5 -2000V52.5" start={-1800} {...message} />
      <path d="M136.5 52.5V-2000" stroke="currentColor" strokeDasharray="4 4" />
      <Flip d="M216.5 68.5V100.5" start={396.5} {...message} />
      <Flip d="M264.5 68.5V100.5" start={444.5} {...message} />
      <path d="M312.5 68.5V100.5" stroke="currentColor" strokeDasharray="4 4" />
      <rect x="85.5" y="49.5" width="6" height="6" fill="currentColor" />
      <rect
        x="133.5"
        y="49.5"
        width="6"
        height="6"
        fill="var(--ds-background-100)"
        stroke="currentColor"
      />
      <circle
        cx="216.5"
        cy="100.5"
        r="4"
        fill="var(--ds-background-100)"
        stroke="currentColor"
      />
      {delivered(216.5, 428.5)}
      <circle
        cx="264.5"
        cy="100.5"
        r="4"
        fill="var(--ds-background-100)"
        stroke="currentColor"
      />
      {delivered(264.5, 476.5)}
      <circle
        cx="312.5"
        cy="100.5"
        r="4"
        fill="var(--ds-background-100)"
        stroke="currentColor"
      />
    </PatternFrame>
  )
}
