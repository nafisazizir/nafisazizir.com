import { PatternFrame, type PatternProps } from "./frame"
import { Flip, Run, turn } from "./motion"

// The cone spins on its axis, and flow comes in along the axis, parts
// round the base, runs up both generators and meets at the apex, where it
// leaves along the axis again.
const flow = { w: 32, p: 160, speed: 3 }

export function PatternCone(props: PatternProps) {
  return (
    <PatternFrame {...props}>
      <path d="M48 60H-2000" stroke="currentColor" strokeDasharray="4 4" />
      <Run d="M-200 60H48" {...flow} />
      <Flip d="M344 60H2400" start={582.53} {...flow} />
      <path
        d="M344 60L117.07 5.55A56 56 0 1 0 117.07 114.45Z"
        fill="var(--ds-background-100)"
      />
      <Flip d="M48 60A56 56 0 0 1 117.07 5.55" start={248} {...flow} />
      <Flip d="M48 60A56 56 0 0 0 117.07 114.45" start={248} {...flow} />
      <Flip d="M117.07 5.55L344 60" start={349.16} {...flow} />
      <Flip d="M117.07 114.45L344 60" start={349.16} {...flow} />
      <circle
        cx="104"
        cy="60"
        r="56"
        stroke="currentColor"
        strokeDasharray="4 4"
        {...turn(104, 60)}
      />
      <circle
        cx="104"
        cy="60"
        r="20"
        stroke="currentColor"
        strokeDasharray="4 4"
        {...turn(104, 60)}
      />
      <rect x="341" y="57" width="6" height="6" fill="currentColor" />
    </PatternFrame>
  )
}
