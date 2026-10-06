import * as React from "react"

// Helpers that write the attributes motion.css reads. Every part is
// periodic: `speed` whole cycles per loop, offset by `phase` (a fraction of
// a cycle). Lengths and positions are frame units.

export type Cycle = { speed?: number; phase?: number }

// A run: solid windows `w` long, one every `p`, each moving `p` along its
// route per cycle. Without `p` it is the route's `length` plus `w`: one
// window at a time, entering as the last one leaves.
export type RunTiming = Cycle & { w: number; p?: number; length?: number }

// Where a line lies on its run's route: `d` is the line, `start` how far
// along the route it begins. A run can pass through several lines this way.
type Placed = { d: string; start?: number }

type Vars = Record<string, string | number | undefined>

// Rounded so the server and every browser print the same digits.
const round = (v: number) => Math.round(v * 1e4) / 1e4

function motion(kind: string, vars: Vars, hidden = false) {
  const style = Object.fromEntries(
    Object.entries(vars)
      .filter(([, v]) => v !== undefined)
      .map(([k, v]) => [`--${k}`, typeof v === "number" ? round(v) : v])
  ) as React.CSSProperties
  return {
    "data-motion": kind,
    style,
    ...(hidden && { opacity: 0 }),
  }
}

const origin = (x: number, y: number) => `${x}px ${y}px`

function period({ w, p, length }: RunTiming) {
  if (p === undefined && length === undefined)
    throw new Error("A run needs its period `p` or its route's `length`.")
  return p ?? length! + w
}

const runVars = ({ start, ...timing }: RunTiming & { start?: number }) => ({
  w: timing.w,
  p: period(timing),
  start,
  speed: timing.speed,
  phase: timing.phase,
})

// Solid windows running along a line, usually a dashed guide, so the guide
// reads solid where a window passes.
export function Run({ d, ...timing }: RunTiming & Placed) {
  return (
    <path
      d={d}
      stroke="currentColor"
      {...motion("run", runVars(timing), true)}
    />
  )
}

// A solid line that turns dashed wherever a run's window passes along it.
// Draw it in place of the line.
export function Flip({ d, ...timing }: RunTiming & Placed) {
  const id = React.useId()
  const hole = (stroke: string) => (
    <path
      d={d}
      stroke={stroke}
      strokeWidth={8}
      {...motion("window", runVars(timing), true)}
    />
  )
  return (
    <>
      <mask id={`${id}-out`} {...area}>
        <rect {...areaRect} fill="#fff" />
        {hole("#000")}
      </mask>
      <mask id={`${id}-in`} {...area}>
        {hole("#fff")}
      </mask>
      <path d={d} stroke="currentColor" mask={`url(#${id}-out)`} />
      <path
        d={d}
        stroke="currentColor"
        strokeDasharray="4 4"
        mask={`url(#${id}-in)`}
      />
    </>
  )
}

const areaRect = { x: -2000, y: -2000, width: 4400, height: 4400 }
const area = { maskUnits: "userSpaceOnUse" as const, ...areaRect }

// Spread onto a part shown only while a run's window covers the point `at`
// along its route, widened by `r` on each side. `off` hides a part of the
// drawing over the same span instead.
export const on = (run: RunTiming, at: number, r = 0) =>
  motion("on", cover(run, at, r), true)

export const off = (run: RunTiming, at: number, r = 0) =>
  motion("off", cover(run, at, r))

function cover(run: RunTiming, at: number, r: number) {
  const p = period(run)
  const a = ((((at - r - run.w) / p) % 1) + 1) % 1
  const len = Math.min(1, (run.w + 2 * r) / p)
  return { speed: run.speed, phase: run.phase, a, len }
}

// Spread onto a part shown only while u (the part's phase in its cycle) is
// in [a, a + len), wrapping past the end of the cycle.
export const during = (a: number, len: number, cycle: Cycle = {}) =>
  motion("on", { ...cycle, a, len }, true)

// The same span, hiding a part of the drawing instead.
export const except = (a: number, len: number, cycle: Cycle = {}) =>
  motion("off", { ...cycle, a, len })

// Whole turns about (x, y) per cycle; `dir` -1 runs counter-clockwise.
export const turn = (
  x: number,
  y: number,
  cycle: Cycle & { dir?: 1 | -1 } = {}
) => motion("turn", { o: origin(x, y), ...cycle })

// A dashed guide running one dash period per cycle; `dir` -1 runs back.
export const march = (cycle: Cycle & { dir?: 1 | -1 } = {}) =>
  motion("march", cycle)

// Moved by (dx, dy) per cycle: a conveyor. Copies one pitch apart, with the
// ends hidden by a `Clip` or a cut-out, make it seamless.
export const slide = (dx: number, dy: number, cycle: Cycle = {}) =>
  motion("slide", { dx, dy, ...cycle })

// The same, for a part that only exists while it moves (an entering copy).
export const slideIn = (dx: number, dy: number, cycle: Cycle = {}) =>
  motion("slide", { dx, dy, ...cycle }, true)

// Moved by (dx, dy) per cycle in `n` even steps, each taken over the first
// `f` of its step on a cosine ease: a live chart advancing one interval at
// a time. Copies one cycle apart, clipped, make it seamless.
export const tick = (
  dx: number,
  dy: number,
  n: number,
  f: number,
  cycle: Cycle = {}
) => motion("tick", { dx, dy, n, f, ...cycle })

// Up from `dy` below its place over [a, a + len) of each cycle, at an even
// pace, then held there; for `before` ahead of `a` it waits all the way
// down. A bar filling as its interval runs, hidden under its axis.
export const rise = (
  dy: number,
  a: number,
  len: number,
  before = 0,
  cycle: Cycle = {}
) => motion("rise", { dy, a, len, h: before, ...cycle })

// Out by (dx, dy) and back on a sine, once per cycle.
export const swing = (dx: number, dy: number, cycle: Cycle = {}) =>
  motion("swing", { dx, dy, ...cycle })

// Out by `angle` degrees about (x, y) and back on a sine, once per cycle.
export const sway = (x: number, y: number, angle: number, cycle: Cycle = {}) =>
  motion("swing", { o: origin(x, y), angle: `${angle}deg`, ...cycle })

// A copy of a shape scaled about (x, y) from 1 to `s` once per cycle,
// exponentially. Start it on one shape and end it on another (or past a
// clip) and the copy never visibly appears or leaves.
export const zoom = (x: number, y: number, s: number, cycle: Cycle = {}) =>
  motion("zoom", { o: origin(x, y), s, ...cycle }, true)

// Clips its children to a rectangle of the frame, for a conveyor's ends.
export function Clip({
  x,
  y,
  width,
  height,
  children,
}: {
  x: number
  y: number
  width: number
  height: number
  children: React.ReactNode
}) {
  const id = React.useId()
  return (
    <>
      <clipPath id={id}>
        <rect x={x} y={y} width={width} height={height} />
      </clipPath>
      <g clipPath={`url(#${id})`}>{children}</g>
    </>
  )
}

// Shows its children only inside a rectangle of the frame that moves: a
// mask whose rect carries a motion (a swing, a slide), for a share that
// grows and shrinks behind a cursor. A static Clip is cheaper.
export function Reveal({
  x,
  y,
  width,
  height,
  motion,
  children,
}: {
  x: number
  y: number
  width: number
  height: number
  motion?: object
  children: React.ReactNode
}) {
  const id = React.useId()
  return (
    <>
      <mask id={id} {...area}>
        <rect
          x={x}
          y={y}
          width={width}
          height={height}
          fill="#fff"
          {...motion}
        />
      </mask>
      <g mask={`url(#${id})`}>{children}</g>
    </>
  )
}

// A polyline route: its path, how far along it each vertex falls, and its
// length.
export function route(points: [number, number][]) {
  const lengths = points
    .slice(1)
    .map(([x, y], i) => Math.hypot(x - points[i][0], y - points[i][1]))
  const total = lengths.reduce((a, b) => a + b, 0)
  let run = 0
  const at = [0, ...lengths.map((l) => round((run += l)))]
  const d = points.map(([x, y], i) => `${i ? "L" : "M"}${x} ${y}`).join("")
  return { d, at, length: round(total) }
}
