import { PatternFrame, type PatternProps } from "./frame"
import { Flip, Run } from "./motion"

// The upright band's outline circulates, up one side and down the other,
// 21 windows round the loop. Where it runs under the cross band its hidden
// edges light solid.
const loop = { w: 32, p: 205, speed: 2 }

export function PatternCross(props: PatternProps) {
  return (
    <PatternFrame {...props}>
      <path d="M-2000 119.5H2400" stroke="currentColor" strokeDasharray="4 4" />
      <path
        d="M216.5 104.5V-2000H264.5V104.5Z"
        fill="var(--ds-background-100)"
      />
      <Flip d="M216.5 104.5V-2000H264.5V104.5Z" {...loop} />
      <path d="M-2000 40.5H2400V72.5H-2000Z" fill="var(--ds-background-100)" />
      <path d="M-2000 40.5H2400M-2000 72.5H2400" stroke="currentColor" />
      <path
        d="M216.5 40.5V72.5M264.5 40.5V72.5"
        stroke="currentColor"
        strokeDasharray="4 4"
      />
      <Run d="M216.5 72.5V40.5" start={32} {...loop} />
      <Run d="M264.5 40.5V72.5" start={4193} {...loop} />
      <rect x="237.5" y="101.5" width="6" height="6" fill="currentColor" />
    </PatternFrame>
  )
}
