import { PatternFrame, type PatternProps } from "./frame"
import { Flip, on, Run } from "./motion"

// One turning radius sweeps both arcs: windows of 12° every 60°, sized by
// angle rather than length so they stay on the same ray, and the ring fills
// as the sweep reaches the angle it marks.
const sweep = (r: number) => ({
  w: r * (Math.PI / 15),
  p: r * (Math.PI / 3),
  speed: 2,
})

export function PatternAngle(props: PatternProps) {
  return (
    <PatternFrame {...props}>
      <path d="M48.5 116.5H2400" stroke="currentColor" />
      <path
        d="M48.5 116.5L1895.48 -2247.53"
        stroke="currentColor"
        strokeDasharray="4 4"
      />
      <path
        d="M48.5 116.5H248.5A200 200 0 0 0 231.21 35.15Z"
        fill="var(--ds-background-100)"
      />
      <path d="M231.21 35.15L48.5 116.5H248.5" stroke="currentColor" />
      <Flip d="M248.5 116.5A200 200 0 0 0 231.21 35.15" {...sweep(200)} />
      <path d="M48.5 116.5L2789.14 -1103.71" stroke="currentColor" />
      <path
        d="M96.5 116.5A48 48 0 0 0 78.05 78.68"
        stroke="currentColor"
        strokeDasharray="4 4"
      />
      <Run d="M96.5 116.5A48 48 0 0 0 78.05 78.68" {...sweep(48)} />
      <circle
        cx="231.21"
        cy="35.15"
        r="4"
        fill="var(--ds-background-100)"
        stroke="currentColor"
      />
      <circle
        cx="231.21"
        cy="35.15"
        r="4"
        fill="currentColor"
        {...on(sweep(200), 83.77, 4)}
      />
      <rect x="45.5" y="113.5" width="6" height="6" fill="currentColor" />
    </PatternFrame>
  )
}
