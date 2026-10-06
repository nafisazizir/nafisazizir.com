import { PatternFrame, type PatternProps } from "./frame"
import { Flip, on, Run } from "./motion"

// Flow converges along both edges into the vertex and leaves as one line.
// Each cross-section goes solid as the flow passes it.
const flow = { length: 725.4, w: 32, speed: 2 }

const section = (d: string, at: number) => (
  <path d={d} stroke="currentColor" {...on(flow, at, 2)} />
)

export function PatternTaper(props: PatternProps) {
  return (
    <PatternFrame {...props}>
      <path d="M320 60L-2000 -313.38V433.38Z" fill="var(--ds-background-100)" />
      <Flip d="M-100 -7.59L320 60" {...flow} />
      <path d="M-100 -7.59L-2000 -313.38" stroke="currentColor" />
      <path
        d="M320 60L-2000 433.38"
        stroke="currentColor"
        strokeDasharray="4 4"
      />
      <Run d="M-100 127.59L320 60" {...flow} />
      <Flip d="M320 60H2400" start={425.4} {...flow} />
      <path
        d="M128.5 28.88V90.82"
        stroke="currentColor"
        strokeDasharray="4 4"
      />
      {section("M128.5 28.88V90.82", 231.4)}
      <path
        d="M224.5 44.48V75.37"
        stroke="currentColor"
        strokeDasharray="4 4"
      />
      {section("M224.5 44.48V75.37", 328.7)}
      <rect x="317" y="57" width="6" height="6" fill="currentColor" />
    </PatternFrame>
  )
}
