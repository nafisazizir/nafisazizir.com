import { PatternFrame, type PatternProps } from "./frame"
import { Flip, Run } from "./motion"

// One beam, measured from x -40: in along the ray, bent through the glass
// and out as three, each window splitting at the far face.
const light = { w: 28, p: 500 }

export function PatternPrism(props: PatternProps) {
  return (
    <PatternFrame {...props}>
      <Flip d="M-2000 64H161.98" start={-1960} {...light} />
      <Flip d="M228.95 76L2400 -488.47" start={270.02} {...light} />
      <path
        d="M228.95 76L2400 32.58"
        stroke="currentColor"
        strokeDasharray="4 4"
      />
      <Run d="M228.95 76L2400 32.58" start={270.02} {...light} />
      <path
        d="M228.95 76L2400 423.37"
        stroke="currentColor"
        strokeDasharray="4 4"
      />
      <Run d="M228.95 76L2400 423.37" start={270.02} {...light} />
      <path
        d="M192 12L247.43 108H136.57Z"
        fill="var(--ds-background-100)"
        stroke="currentColor"
      />
      <path
        d="M161.98 64L228.95 76"
        stroke="currentColor"
        strokeDasharray="4 4"
      />
      <Run d="M161.98 64L228.95 76" start={201.98} {...light} />
      <circle cx="161.98" cy="64" r="3" fill="currentColor" />
    </PatternFrame>
  )
}
