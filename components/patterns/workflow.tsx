import { PatternFrame, type PatternProps } from "./frame"
import { Flip, on, Run } from "./motion"

// A run along M-40 60H160V24H280V60H600: in through the start, the first
// step, the decision, the branch it takes, the join and the last step,
// then out. Each step is toned while the run is inside it; the dashed
// branch is never taken.
const run = { length: 712, w: 24 }

const step = (x: number, y: number, at: number) => (
  <rect
    x={x}
    y={y}
    width="48"
    height="28"
    rx="6"
    fill="var(--ds-gray-300)"
    stroke="currentColor"
    {...on(run, at, 24)}
  />
)

export function PatternWorkflow(props: PatternProps) {
  return (
    <PatternFrame loop={10} {...props}>
      <path d="M28 60H-2000" stroke="currentColor" strokeDasharray="4 4" />
      <Run d="M-40 60H28" {...run} />
      <Flip d="M36 60H64" start={76} {...run} />
      <Flip d="M112 60H144" start={152} {...run} />
      <Flip d="M280 60H304" start={392} {...run} />
      <Flip d="M352 60H2400" start={464} {...run} />
      <Flip d="M160 44V24H208" start={216} {...run} />
      <Flip d="M256 24H280V60" start={332} {...run} />
      <path
        d="M160 76V96H208M256 96H280V60"
        stroke="currentColor"
        strokeDasharray="4 4"
      />
      <circle
        cx="32"
        cy="60"
        r="4"
        fill="var(--ds-background-100)"
        stroke="currentColor"
      />
      <rect
        x="64"
        y="46"
        width="48"
        height="28"
        rx="6"
        fill="var(--ds-background-100)"
        stroke="currentColor"
      />
      {step(64, 46, 128)}
      <path
        d="M160 44L176 60L160 76L144 60Z"
        fill="var(--ds-background-100)"
        stroke="currentColor"
      />
      <path
        d="M160 44L176 60L160 76L144 60Z"
        fill="var(--ds-gray-300)"
        stroke="currentColor"
        {...on(run, 200, 16)}
      />
      <rect
        x="208"
        y="10"
        width="48"
        height="28"
        rx="6"
        fill="var(--ds-background-100)"
        stroke="currentColor"
      />
      {step(208, 10, 308)}
      <rect
        x="208"
        y="82"
        width="48"
        height="28"
        rx="6"
        fill="var(--ds-background-100)"
        stroke="currentColor"
        strokeDasharray="4 4"
      />
      <rect
        x="304"
        y="46"
        width="48"
        height="28"
        rx="6"
        fill="var(--ds-background-100)"
        stroke="currentColor"
      />
      {step(304, 46, 440)}
      <rect x="277" y="57" width="6" height="6" fill="currentColor" />
    </PatternFrame>
  )
}
