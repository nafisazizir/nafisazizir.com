import { PatternFrame, type PatternProps } from "./frame"
import { during, except, Reveal, swing } from "./motion"

const outline =
  "M48.5 116.5V108.5H64.5V96.5H80.5V76.5H96.5V52.5H112.5V32.5H128.5V24.5H144.5V28.5H160.5V40.5H176.5V54.5H192.5V68.5H208.5V78.5H224.5V86.5H240.5V92.5H256.5V98.5H272.5V102.5H288.5V106.5H304.5V108.5H320.5V110.5H336.5V116.5"

// Reading a percentile: a cursor is dragged across the distribution and
// back, the share of samples below it toned. It rests on the median in the
// drawing; moving, it swings about 188.5 from 56.5 to 320.5, past the p95,
// whose marker fills while the cursor is beyond it.
const c = 188.5
const A = 132
const phase = 1 - Math.asin((c - 160.5) / A) / (2 * Math.PI)
const read = swing(A, 0, { phase })
const beyond = Math.asin((304.5 - c) / A) / (2 * Math.PI)
const p95 = during((((beyond - phase) % 1) + 1) % 1, 0.5 - 2 * beyond)

const share = (x: number, motion?: object) => (
  <Reveal x={-2000} y={0} width={2000 + x} height={120} motion={motion}>
    <path d={`${outline}Z`} fill="var(--ds-gray-300)" />
  </Reveal>
)

const cursor = (x: number, motion?: object) => (
  <g {...motion}>
    <path d={`M${x} 116.5V-2000`} stroke="currentColor" />
    <rect x={x - 3} y="113.5" width="6" height="6" fill="currentColor" />
  </g>
)

export function PatternHistogram(props: PatternProps) {
  return (
    <PatternFrame loop={16} {...props}>
      <path d={`${outline}Z`} fill="var(--ds-background-100)" />
      <g {...except(0, 1)}>{share(160.5)}</g>
      <g {...during(0, 1)}>{share(c, read)}</g>
      <path d={outline} stroke="currentColor" />
      <path d="M-2000 116.5H2400" stroke="currentColor" />
      <path
        d="M304.5 116.5V-2000"
        stroke="currentColor"
        strokeDasharray="4 4"
      />
      <rect
        x="301.5"
        y="113.5"
        width="6"
        height="6"
        fill="var(--ds-background-100)"
        stroke="currentColor"
      />
      <rect
        x="301.5"
        y="113.5"
        width="6"
        height="6"
        fill="currentColor"
        stroke="currentColor"
        {...p95}
      />
      <g {...except(0, 1)}>{cursor(160.5)}</g>
      <g {...during(0, 1)}>{cursor(c, read)}</g>
    </PatternFrame>
  )
}
