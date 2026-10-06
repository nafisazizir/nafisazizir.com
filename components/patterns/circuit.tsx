import { PatternFrame, type PatternProps } from "./frame"
import { during, Flip, Run } from "./motion"

// A clocked gate. Both solid inputs arrive, one after the other, and are
// held: the die is toned from the first arrival until the clock edge comes
// down its line. Only then does the output drive. The dashed input and
// output stay idle. Positions are along each input from x -40, with the
// clock and the output on the same count.
const tick = { length: 731.5, w: 24 }
const P = tick.length + tick.w
const head = (at: number) => (at - tick.w) / P

export function PatternCircuit(props: PatternProps) {
  return (
    <PatternFrame loop={10} {...props}>
      <Flip d="M-2000 16.5H124.5L152.5 44.5H176.5" start={-1960} {...tick} />
      <path d="M176.5 60.5H-2000" stroke="currentColor" strokeDasharray="4 4" />
      <Flip d="M-2000 104.5H124.5L152.5 76.5H176.5" start={-1920} {...tick} />
      <Flip d="M240.5 60.5H2400" start={372} {...tick} />
      <path
        d="M240.5 44.5H264.5L292.5 16.5H2400"
        stroke="currentColor"
        strokeDasharray="4 4"
      />
      <path d="M208.5 32.5V-2000" stroke="currentColor" strokeDasharray="4 4" />
      <Run d="M208.5 -200V32.5" start={107.5} {...tick} />
      <rect
        x="176.5"
        y="32.5"
        width="64"
        height="56"
        fill="var(--ds-background-100)"
        stroke="currentColor"
      />
      <rect
        x="188.5"
        y="44.5"
        width="40"
        height="32"
        fill="var(--ds-gray-300)"
        {...during(head(228.1), (340 - 228.1) / P)}
      />
      <rect
        x="188.5"
        y="44.5"
        width="40"
        height="32"
        stroke="currentColor"
        strokeDasharray="4 4"
      />
      <circle cx="124.5" cy="16.5" r="3" fill="currentColor" />
      <circle cx="124.5" cy="104.5" r="3" fill="currentColor" />
      <circle cx="292.5" cy="16.5" r="3" fill="currentColor" />
    </PatternFrame>
  )
}
