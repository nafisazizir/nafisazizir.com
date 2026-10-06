import { PatternFrame, type PatternProps } from "./frame"
import { Clip, except, Flip, Run, slideIn } from "./motion"

// First in, first out. Every item moves one slot toward the head per
// cycle: pending items come in under the tail pointer and turn solid as
// they cross into the queue, the oldest leaves at the head, and the head
// pointer carries it up as the tail pointer brings the next one down.
const cycle = { speed: 4 }
const step = slideIn(32, 0, cycle)
const slots = [24.5, 56.5, 88.5, 120.5, 152.5, 184.5, 216.5, 248.5]

const item = (x: number, dashed: boolean) => (
  <rect
    key={x}
    x={x}
    y="48.5"
    width="24"
    height="24"
    fill={dashed ? undefined : "var(--ds-background-100)"}
    stroke="currentColor"
    strokeDasharray={dashed ? "4 4" : undefined}
  />
)

// Hidden while the conveyor runs in their place.
const still = except(0, 1)

export function PatternQueue(props: PatternProps) {
  return (
    <PatternFrame {...props}>
      <path d="M-2000 40.5H2400V80.5H-2000Z" fill="var(--ds-background-100)" />
      <path d="M-2000 40.5H2400M-2000 80.5H2400" stroke="currentColor" />
      <g {...still}>
        <rect
          x="88.5"
          y="48.5"
          width="24"
          height="24"
          stroke="currentColor"
          strokeDasharray="4 4"
        />
        <rect
          x="120.5"
          y="48.5"
          width="24"
          height="24"
          stroke="currentColor"
          strokeDasharray="4 4"
        />
        <rect
          x="152.5"
          y="48.5"
          width="24"
          height="24"
          fill="var(--ds-background-100)"
          stroke="currentColor"
        />
        <rect
          x="184.5"
          y="48.5"
          width="24"
          height="24"
          fill="var(--ds-background-100)"
          stroke="currentColor"
        />
        <rect
          x="216.5"
          y="48.5"
          width="24"
          height="24"
          fill="var(--ds-background-100)"
          stroke="currentColor"
        />
        <rect
          x="248.5"
          y="48.5"
          width="24"
          height="24"
          fill="var(--ds-background-100)"
          stroke="currentColor"
        />
      </g>
      <Clip x={84.5} y={44.5} width={64} height={32}>
        <g {...step}>{slots.map((x) => item(x, true))}</g>
      </Clip>
      <Clip x={148.5} y={44.5} width={128} height={32}>
        <g {...step}>{slots.map((x) => item(x, false))}</g>
      </Clip>
      <path d="M72.5 40.5V-2000" stroke="currentColor" strokeDasharray="4 4" />
      <Run d="M72.5 -200V40.5" length={240.5} w={24} {...cycle} phase={0.68} />
      <Flip
        d="M296.5 40.5V-2000"
        length={240.5}
        w={24}
        {...cycle}
        phase={0.86}
      />
      <rect
        x="69.5"
        y="37.5"
        width="6"
        height="6"
        fill="var(--ds-background-100)"
        stroke="currentColor"
      />
      <rect x="293.5" y="37.5" width="6" height="6" fill="currentColor" />
    </PatternFrame>
  )
}
