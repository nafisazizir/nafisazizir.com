import { PatternFrame, type PatternProps } from "./frame"
import { Clip, slide } from "./motion"

// A live latency monitor: p99 as the outline of the area, p50 dashed
// inside it, the SLO dashed across. History scrolls left and the newest
// samples come in at now, one window of data per loop, so a breach
// passes through once a cycle. Only now bounds the data; the past runs out
// the left side like the guides.
const L = 296
const now = 320.5

// One window, x from 24.5 (the oldest sample) to 320.5 (now). The ends
// match, so the next window follows on.
const p99: [number, number][] = [
  [24.5, 80.5],
  [64.5, 80.5],
  [80.5, 72.5],
  [112.5, 72.5],
  [128.5, 80.5],
  [222.5, 80.5],
  [236.5, 24.5],
  [244.5, 24.5],
  [268.5, 72.5],
  [276.5, 80.5],
  [320.5, 80.5],
]
const p50: [number, number][] = [
  [24.5, 100.5],
  [228.5, 100.5],
  [236.5, 92.5],
  [252.5, 92.5],
  [260.5, 100.5],
  [320.5, 100.5],
]

// History runs back past the left edge, as far as the guides do, and one
// window on past now for the scroll; drawn as one line, so it has no join.
const windows = Array.from({ length: 9 }, (_, k) => (k - 7) * L)
const line = (points: [number, number][]) =>
  windows
    .flatMap((dx) => points.map(([x, y]) => [x + dx, y]))
    .map(([x, y], i) => `${i ? "L" : "M"}${x} ${y}`)
    .join("")

// Where the p99 crosses the SLO at 40.5, and the breach between.
const breach = (dx: number) => (
  <g key={dx}>
    <path
      d={`M${232.5 + dx} 40.5L${236.5 + dx} 24.5H${244.5 + dx}L${252.5 + dx} 40.5Z`}
      fill="var(--ds-gray-300)"
    />
    <path d={`M${232.5 + dx} 40.5H${252.5 + dx}`} stroke="currentColor" />
    <rect x={229.5 + dx} y="37.5" width="6" height="6" fill="currentColor" />
    <rect x={249.5 + dx} y="37.5" width="6" height="6" fill="currentColor" />
  </g>
)

export function PatternLatency(props: PatternProps) {
  return (
    <PatternFrame loop={20} {...props}>
      <path d="M-2000 40.5H2400" stroke="currentColor" strokeDasharray="4 4" />
      <Clip x={-2000} y={0} width={now + 2000} height={120}>
        <g {...slide(-L, 0)}>
          <path
            d={`${line(p99)}V116.5H${24.5 + windows[0]}Z`}
            fill="var(--ds-background-100)"
          />
          {windows.map(breach)}
          <path d={line(p50)} stroke="currentColor" strokeDasharray="4 4" />
          <path d={line(p99)} stroke="currentColor" />
        </g>
      </Clip>
      <path d="M-2000 116.5H2400" stroke="currentColor" />
      <path
        d={`M${now} 116.5V-2000`}
        stroke="currentColor"
        strokeDasharray="4 4"
      />
      <rect x={now - 3} y="113.5" width="6" height="6" fill="currentColor" />
    </PatternFrame>
  )
}
