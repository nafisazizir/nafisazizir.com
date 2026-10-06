import { PatternFrame, type PatternProps } from "./frame"
import { Clip, during, except, rise, tick } from "./motion"

// A live bar chart, one bar per interval. The current interval's bar is
// dashed and fills as it runs; when the interval closes the bar is drawn
// solid and the chart steps left one interval, the oldest bar leaving and
// an empty slot opening at now. Twelve intervals a loop, two copies of the
// twelve one loop apart.
const tops = [
  76.5, 64.5, 84.5, 72.5, 64.5, 80.5, 28.5, 72.5, 60.5, 76.5, 72.5, 80.5,
]
const n = tops.length
const pitch = 32
const f = 0.25

// Eight slots show, from 40 to now at 296; bar i is the current one in
// step (i - 8) of the loop.
const step = (i: number) => (i - 8 + n) % n

function bar(i: number, dx: number) {
  const x = 44.5 + i * pitch + dx
  const d = `M${x} 116.5V${tops[i]}H${x + 24}V116.5`
  const fill = i === 6 ? "var(--ds-gray-300)" : "var(--ds-background-100)"
  const k = step(i)
  return (
    <g key={dx + i} {...rise(117 - tops[i], (k + f) / n, (1 - f) / n, f / n)}>
      <path d={d} fill={fill} stroke="currentColor" {...except(k / n, 1 / n)} />
      <path
        d={d}
        fill={fill}
        stroke="currentColor"
        strokeDasharray="4 4"
        {...during(k / n, 1 / n)}
      />
    </g>
  )
}

export function PatternBars(props: PatternProps) {
  return (
    <PatternFrame loop={24} {...props}>
      <path d="M-2000 68.5H2400" stroke="currentColor" strokeDasharray="4 4" />
      <Clip x={40} y={-2000} width={256} height={2116.5}>
        <g {...tick(-n * pitch, 0, n, f)}>
          {tops.map((_, i) => bar(i, 0))}
          {tops.map((_, i) => bar(i, n * pitch))}
        </g>
      </Clip>
      <path d="M-2000 116.5H2400" stroke="currentColor" />
    </PatternFrame>
  )
}
