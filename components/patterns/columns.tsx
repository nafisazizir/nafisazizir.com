import { PatternFrame, type PatternProps } from "./frame"
import { Clip, except, slideIn } from "./motion"

// The solid column sets the rhythm: its dashed repeats are drawn out from
// under it one pitch per cycle and sink into the last column's wall.
const step = slideIn(80, 0, { speed: 2 })
const still = except(0, 1)

export function PatternColumns(props: PatternProps) {
  return (
    <PatternFrame {...props}>
      <path
        d="M104.5 -2000V119.5H160.5V-2000"
        fill="var(--ds-background-100)"
        stroke="currentColor"
      />
      <path
        d="M-2000 60.5H80.5V119.5H-2000"
        stroke="currentColor"
        strokeDasharray="4 4"
      />
      <g {...still}>
        <path
          d="M184.5 -2000V119.5H240.5V-2000"
          stroke="currentColor"
          strokeDasharray="4 4"
        />
        <path
          d="M264.5 -2000V119.5H320.5V-2000"
          stroke="currentColor"
          strokeDasharray="4 4"
        />
      </g>
      <Clip x={161} y={-2000} width={183.5} height={2121}>
        <g {...step}>
          {[104.5, 184.5, 264.5].map((x) => (
            <path
              key={x}
              d={`M${x} -2000V119.5H${x + 56}V-2000`}
              stroke="currentColor"
              strokeDasharray="4 4"
            />
          ))}
        </g>
      </Clip>
      <path
        d="M344.5 -2000V119.5H2400"
        stroke="currentColor"
        strokeDasharray="4 4"
      />
    </PatternFrame>
  )
}
