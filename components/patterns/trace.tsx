import type * as React from "react"

import { PatternFrame, type PatternProps } from "./frame"
import { Clip, during, except, slideIn } from "./motion"

// A trace as a waterfall: one row per depth, each span a line from its
// start to its end. A cursor walks the request at an even pace, and the
// spans open at that instant, the call stack, are drawn solid, the rest
// dashed; the square sits on the deepest, the one actually running. At
// the root's end the next request begins at its start.
const spans: [number, number, number][] = [
  [48.5, 336.5, 0],
  [64.5, 192.5, 1],
  [80.5, 128.5, 2],
  [136.5, 184.5, 2],
  [208.5, 320.5, 1],
  [224.5, 296.5, 2],
  [240.5, 272.5, 3],
]
const row = (depth: number) => 20.5 + depth * 24
const W = 288

// The cursor is at 256.5 when the loop starts, and at x when its phase is
// (x - 48.5) / W. Parts inside it inherit that phase, so every window here
// is written in it.
const phase = (256.5 - 48.5) / W
const span = (x0: number, x1: number) =>
  [(x0 - 48.5) / W, (x1 - x0) / W, { phase }] as const
const open = (x0: number, x1: number) => during(...span(x0, x1))

// Between each pair of span edges, the deepest open span.
const edges = [...new Set(spans.flatMap(([s, e]) => [s, e]))].sort(
  (a, b) => a - b
)
const top = edges.slice(0, -1).map((x0, i) => {
  const x1 = edges[i + 1]
  const depth = Math.max(
    ...spans.filter(([s, e]) => s <= x0 && e >= x1).map(([, , d]) => d)
  )
  return [x0, x1, depth] as const
})

const cursor = (x: number, stack: React.ReactNode) => (
  <g key={x}>
    <path d={`M${x} 116.5V-2000`} stroke="currentColor" />
    {stack}
  </g>
)

const square = (x: number, depth: number) => (
  <rect x={x - 3} y={row(depth) - 3} width="6" height="6" fill="currentColor" />
)

export function PatternTrace(props: PatternProps) {
  return (
    <PatternFrame loop={14} {...props}>
      <path d="M-2000 116.5H2400" stroke="currentColor" />
      {spans.map(([s, e, depth]) => {
        const y = row(depth)
        const ends = `M${s} ${y - 4}V${y + 4}M${e} ${y - 4}V${y + 4}`
        const solid = s <= 256.5 && e >= 256.5
        return (
          <g key={s}>
            <path d={ends} stroke="currentColor" />
            <path
              d={`M${s} ${y}H${e}`}
              stroke="currentColor"
              strokeDasharray={solid ? undefined : "4 4"}
              {...except(0, 1)}
            />
            <g {...during(0, 1)}>
              <path
                d={`M${s} ${y}H${e}`}
                stroke="currentColor"
                strokeDasharray="4 4"
                {...except(...span(s, e))}
              />
            </g>
            <path d={`M${s} ${y}H${e}`} stroke="currentColor" {...open(s, e)} />
          </g>
        )
      })}
      <g {...except(0, 1)}>{cursor(256.5, square(256.5, 3))}</g>
      <Clip x={48} y={-2000} width={W + 1} height={2120}>
        <g {...slideIn(W, 0, { phase })}>
          {[48.5, 48.5 - W].map((x) =>
            cursor(
              x,
              top.map(([x0, x1, depth]) => (
                <g key={x0} {...open(x0, x1)}>
                  {square(x, depth)}
                </g>
              ))
            )
          )}
        </g>
      </Clip>
    </PatternFrame>
  )
}
