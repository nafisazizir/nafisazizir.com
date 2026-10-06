import { PatternFrame, type PatternProps } from "./frame"
import { Flip, on, Run } from "./motion"

// One pass along M-100 60H48, the encoder's edges, the code and the
// decoder's edges: the input narrows to the code, which is toned while it
// holds it, and widens back out through the reconstruction.
const pass = { length: 710.56, w: 28, speed: 2 }

export function PatternBottleneck(props: PatternProps) {
  return (
    <PatternFrame {...props}>
      <path d="M48 60H-2000" stroke="currentColor" strokeDasharray="4 4" />
      <Run d="M-100 60H48" {...pass} />
      <Flip d="M336 60H2400" start={446.56} {...pass} />
      <Flip d="M168 60H216" start={273.28} {...pass} />
      <path d="M48 8L168 44V76L48 112Z" fill="var(--ds-background-100)" />
      <Flip d="M48 8L168 44" start={148} {...pass} />
      <Flip d="M48 112L168 76" start={148} {...pass} />
      <path d="M168 44V76M48 112V8" stroke="currentColor" />
      <path
        d="M216 44L336 8V112L216 76Z"
        fill="var(--ds-background-100)"
        stroke="currentColor"
        strokeDasharray="4 4"
      />
      <Run d="M216 44L336 8" start={321.28} {...pass} />
      <Run d="M216 76L336 112" start={321.28} {...pass} />
      <rect
        x="180"
        y="48"
        width="24"
        height="24"
        fill="var(--ds-background-100)"
        stroke="currentColor"
      />
      <rect
        x="180"
        y="48"
        width="24"
        height="24"
        fill="var(--ds-gray-300)"
        stroke="currentColor"
        {...on(pass, 297.28, 12)}
      />
      <circle cx="192" cy="60" r="3" fill="currentColor" />
    </PatternFrame>
  )
}
