import { PatternFrame, type PatternProps } from "./frame"
import { Clip, except, Run, slideIn } from "./motion"

// Events ride from the source to the sink at an even pace. The one about
// to be delivered is in flight, dashed, and arrives at the sink as the
// next event comes in from the source.
const pace = { speed: 1 }
const step = slideIn(304, 0, pace)
const events: [number, number][] = [
  [40.5, 56],
  [104.5, 32],
  [144.5, 72],
  [224.5, 40],
  [272.5, 64],
]

const pill = (x: number, width: number, dashed: boolean) => (
  <rect
    key={x}
    x={x}
    y="44.5"
    width={width}
    height="32"
    rx="16"
    fill="var(--ds-background-100)"
    stroke="currentColor"
    strokeDasharray={dashed ? "4 4" : undefined}
  />
)

const belt = (dashed: boolean) =>
  [-304, 0].flatMap((shift) =>
    events.map(([x, width]) => pill(x + shift, width, dashed))
  )

export function PatternStream(props: PatternProps) {
  return (
    <PatternFrame {...props}>
      <path d="M40.5 60H-2000" stroke="currentColor" strokeDasharray="4 4" />
      <Run d="M-264 60H40.5" p={304} w={24} {...pace} phase={0.91} />
      <path d="M40.5 60H336.5" stroke="currentColor" />
      <g {...except(0, 1)}>
        {events.map(([x, width]) => pill(x, width, x === 272.5))}
      </g>
      <Clip x={40} y={40} width={228.5} height={41}>
        <g {...step}>{belt(false)}</g>
      </Clip>
      <Clip x={268.5} y={40} width={68.5} height={41}>
        <g {...step}>{belt(true)}</g>
      </Clip>
      <path d="M352.5 60H2400" stroke="currentColor" strokeDasharray="4 4" />
      <rect x="349.5" y="57" width="6" height="6" fill="currentColor" />
    </PatternFrame>
  )
}
