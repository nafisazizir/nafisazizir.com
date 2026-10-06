import { PatternFrame, type PatternProps } from "./frame"
import { Flip, Run } from "./motion"

// The load path: weight comes down onto the keystone, splits, runs down
// both halves of the arch in compression and leaves at the springings as
// the outward thrust along the ground.
const load = { w: 32, p: 160, speed: 3 }

export function PatternArch(props: PatternProps) {
  return (
    <PatternFrame {...props}>
      <path d="M96.5 119.5H-2000" stroke="currentColor" strokeDasharray="4 4" />
      <Run d="M96.5 119.5H-200" start={374.01} {...load} />
      <path d="M287.5 119.5H2400" stroke="currentColor" strokeDasharray="4 4" />
      <Run d="M287.5 119.5H584" start={374.01} {...load} />
      <Flip d="M192 -2000V24" start={-1800} {...load} />
      <path
        d="M96.5 119.5A95.5 95.5 0 0 1 287.5 119.5Z"
        fill="var(--ds-background-100)"
      />
      <Flip d="M192 24A95.5 95.5 0 0 0 96.5 119.5" start={224} {...load} />
      <Flip d="M192 24A95.5 95.5 0 0 1 287.5 119.5" start={224} {...load} />
      <path d="M96.5 119.5H287.5" stroke="currentColor" />
      <path
        d="M136.5 119.5A55.5 55.5 0 0 1 247.5 119.5"
        stroke="currentColor"
        strokeDasharray="4 4"
      />
      <rect x="189" y="21" width="6" height="6" fill="currentColor" />
    </PatternFrame>
  )
}
