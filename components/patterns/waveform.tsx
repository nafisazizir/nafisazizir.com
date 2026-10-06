import { PatternFrame, type PatternProps } from "./frame"
import { Clip, except, slideIn } from "./motion"

// Bar extents, one every 8 from x 64.5.
const bars = [
  [53, 67],
  [50, 70],
  [51, 69],
  [49, 71],
  [46, 74],
  [41, 79],
  [40, 80],
  [40, 80],
  [41, 79],
  [36, 84],
  [23, 97],
  [33, 87],
  [23, 97],
  [32, 88],
  [21, 99],
  [24, 96],
  [13, 107],
  [22, 98],
  [29, 91],
  [27, 93],
  [26, 94],
  [20, 100],
  [34, 86],
  [35, 85],
  [41, 79],
  [36, 84],
  [43, 77],
  [41, 79],
  [47, 73],
  [50, 70],
  [50, 70],
  [50, 70],
  [51, 69],
]

const path = (from: number, to: number, shift = 0) =>
  bars
    .slice(from, to)
    .map(
      ([y1, y2], i) =>
        `M${64.5 + (from + i) * 8 + shift} ${y1.toFixed(1)}V${y2.toFixed(1)}`
    )
    .join("")

// The clip played on a loop: the waveform scrolls under the playhead, and
// each bar turns from dashed (to come) to solid (played) as it crosses.
// The clip repeats every 264, so a copy follows it in.
const play = slideIn(-264, 0)
const both = (stroke: { strokeDasharray?: string }) => (
  <g {...play}>
    <path d={path(0, 33)} stroke="currentColor" {...stroke} />
    <path d={path(0, 33, 264)} stroke="currentColor" {...stroke} />
  </g>
)

export function PatternWaveform(props: PatternProps) {
  return (
    <PatternFrame loop={16} {...props}>
      <path d="M64.5 60H-2000" stroke="currentColor" strokeDasharray="4 4" />
      <path d="M320.5 60H2400" stroke="currentColor" strokeDasharray="4 4" />
      <g {...except(0, 1)}>
        <path d={path(0, 18)} stroke="currentColor" />
        <path d={path(18, 33)} stroke="currentColor" strokeDasharray="4 4" />
      </g>
      <Clip x={60.5} y={0} width={148} height={120}>
        {both({})}
      </Clip>
      <Clip x={208.5} y={0} width={116} height={120}>
        {both({ strokeDasharray: "4 4" })}
      </Clip>
      <path d="M208.5 112V-2000" stroke="currentColor" />
      <rect x="205.5" y="109" width="6" height="6" fill="currentColor" />
    </PatternFrame>
  )
}
