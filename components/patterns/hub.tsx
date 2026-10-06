import { PatternFrame, type PatternProps } from "./frame"
import { Flip, march, on, Run } from "./motion"

// Fan in, fan out: a message comes in from the left through its node and
// spoke to the hub, then leaves along every spoke at once, on along the
// line out from the right. The node with no spoke gets nothing. Every node
// it reaches is toned. The orbit's guides run slowly.
const message = { length: 660, w: 24 }
const spokes = [
  "M192 60L240 60",
  "M192 60L216 101.57",
  "M192 60L168 18.43",
  "M192 60L216 18.43",
]

const reached = (cx: number, cy: number, at: number) => (
  <circle
    cx={cx}
    cy={cy}
    r="10"
    fill="var(--ds-gray-300)"
    stroke="currentColor"
    {...on(message, at, 10)}
  />
)

export function PatternHub(props: PatternProps) {
  return (
    <PatternFrame loop={10} {...props}>
      <path d="M144 60H-2000" stroke="currentColor" strokeDasharray="4 4" />
      <Run d="M-60 60H144" {...message} />
      <Flip d="M240 60H2400" start={300} {...message} />
      <circle
        cx="192"
        cy="60"
        r="48"
        stroke="currentColor"
        strokeDasharray="4 4"
        {...march({ speed: 2 })}
      />
      <Flip d="M144 60L192 60" start={204} {...message} />
      {spokes.map((d) => (
        <Flip key={d} d={d} start={252} {...message} />
      ))}
      <circle
        cx="240"
        cy="60"
        r="10"
        fill="var(--ds-background-100)"
        stroke="currentColor"
      />
      {reached(240, 60, 300)}
      <circle
        cx="216"
        cy="101.57"
        r="10"
        fill="var(--ds-background-100)"
        stroke="currentColor"
      />
      {reached(216, 101.57, 300)}
      <circle
        cx="144"
        cy="60"
        r="10"
        fill="var(--ds-background-100)"
        stroke="currentColor"
      />
      {reached(144, 60, 204)}
      <circle
        cx="168"
        cy="18.43"
        r="10"
        fill="var(--ds-background-100)"
        stroke="currentColor"
      />
      {reached(168, 18.43, 300)}
      <circle
        cx="216"
        cy="18.43"
        r="10"
        fill="var(--ds-background-100)"
        stroke="currentColor"
      />
      {reached(216, 18.43, 300)}
      <circle
        cx="168"
        cy="101.57"
        r="10"
        fill="var(--ds-background-100)"
        stroke="currentColor"
        strokeDasharray="4 4"
      />
      <circle
        cx="192"
        cy="60"
        r="20"
        fill="var(--ds-background-100)"
        stroke="currentColor"
      />
      <circle cx="192" cy="60" r="3" fill="currentColor" />
    </PatternFrame>
  )
}
