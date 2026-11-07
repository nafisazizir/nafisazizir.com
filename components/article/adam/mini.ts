// The Mini from ../mabot as a real solid, so he can turn his head: its rings,
// hull, turn and eye placement, without the DOM. Units are about one from the
// centre to a side, x right, y down, z toward the viewer.

export type Point = [number, number]
type Vec3 = [number, number, number]

/** Where he looks, as mabot's pose has it. The body follows stiffly. */
export type Pose = {
  yaw: number
  pitch: number
  tilt: number
  eyeX: number
  eyeY: number
}

export type Eye = { x: number; y: number; rot: number; sx: number; sy: number }

const [A, B, C] = [0.79, 0.79, 0.23]
const ROUND = 0.05
const EXPONENT = 6
const STEPS = 96
const BEVEL_STEPS = 4

const TURN_YAW = 0.65
const TURN_PITCH = 0.55
const GAP = 0.72
const SIZE = 0.8
const DROP = 0.1
const TRAVEL: Point = [0.39, 0.5]
const LEAN = 0.12
const DEPTH = 0.2
const EYE_DISTANCE = 14

const depthScale = (z: number) => EYE_DISTANCE / (EYE_DISTANCE - z)
const project = ([x, y, z]: Vec3): Point => {
  const k = depthScale(z)
  return [x * k, y * k]
}

/** Half his width head-on, in head units. */
export const HALF = (A + ROUND) * depthScale(C)

type Turn = { yaw: number; pitch: number; tilt: number }

function turn([x, y, z]: Vec3, { yaw, pitch, tilt }: Turn): Vec3 {
  const x1 = x * Math.cos(yaw) + z * Math.sin(yaw)
  const z1 = -x * Math.sin(yaw) + z * Math.cos(yaw)
  const y2 = y * Math.cos(pitch) - z1 * Math.sin(pitch)
  const z2 = y * Math.sin(pitch) + z1 * Math.cos(pitch)
  return [
    x1 * Math.cos(tilt) - y2 * Math.sin(tilt),
    x1 * Math.sin(tilt) + y2 * Math.cos(tilt),
    z2,
  ]
}

const OUTLINE = Array.from({ length: STEPS }, (_, i) => {
  const t = (i / STEPS) * Math.PI * 2
  const [ct, st] = [Math.cos(t), Math.sin(t)]
  const x = A * Math.sign(ct) * Math.abs(ct) ** (2 / EXPONENT)
  const y = B * Math.sign(st) * Math.abs(st) ** (2 / EXPONENT)
  const g: Point = [
    (Math.sign(x) * Math.abs(x / A) ** (EXPONENT - 1)) / A,
    (Math.sign(y) * Math.abs(y / B) ** (EXPONENT - 1)) / B,
  ]
  const len = Math.hypot(...g) || 1
  return { x, y, nx: g[0] / len, ny: g[1] / len }
})

const ring = (z: number, angle: number): Vec3[] => {
  const [out, up] = [Math.cos(angle), Math.sin(angle)]
  return OUTLINE.map(({ x, y, nx, ny }) => [
    x + nx * ROUND * out,
    y + ny * ROUND * out,
    z + ROUND * up,
  ])
}

const bevel = (side: -1 | 1) =>
  Array.from({ length: BEVEL_STEPS + 1 }, (_, k) =>
    ring(side * C, (side * (k / BEVEL_STEPS) * Math.PI) / 2)
  )

const RINGS = [...bevel(-1), ...bevel(1)].flat()

function hull(points: Point[]): Point[] {
  const sorted = [...points].sort((a, b) => a[0] - b[0] || a[1] - b[1])
  const cross = (o: Point, a: Point, b: Point) =>
    (a[0] - o[0]) * (b[1] - o[1]) - (a[1] - o[1]) * (b[0] - o[0])
  const half = (list: Point[]) =>
    list.reduce<Point[]>((chain, p) => {
      while (
        chain.length >= 2 &&
        cross(chain[chain.length - 2], chain[chain.length - 1], p) <= 0
      )
        chain.pop()
      chain.push(p)
      return chain
    }, [])
  const lower = half(sorted)
  const upper = half([...sorted].reverse())
  return [...lower.slice(0, -1), ...upper.slice(0, -1)]
}

/** His silhouette and eyes for a pose, in head units. */
export function solid(pose: Pose) {
  const t: Turn = {
    yaw: pose.yaw * TURN_YAW,
    pitch: pose.pitch * TURN_PITCH,
    tilt: pose.tilt,
  }
  const outline = hull(RINGS.map((p) => project(turn(p, t))))

  const [tl, tr, br, bl] = (
    [
      [-1, -1],
      [1, -1],
      [1, 1],
      [-1, 1],
    ] as Point[]
  ).map(([sx, sy]): Vec3 => turn([sx * A, sy * B, C + ROUND], t))
  const lerp = (a: Vec3, b: Vec3, u: number): Vec3 => [
    a[0] + (b[0] - a[0]) * u,
    a[1] + (b[1] - a[1]) * u,
    a[2] + (b[2] - a[2]) * u,
  ]
  const on = ([pu, pv]: Point) => {
    const s = (pu / A + 1) / 2
    return lerp(lerp(tl, tr, s), lerp(bl, br, s), (pv / B + 1) / 2)
  }
  const glance: Point = [pose.eyeX * TRAVEL[0] * A, pose.eyeY * TRAVEL[1] * B]
  const centreZ = on([0, 0])[2]
  const size = (SIZE * HALF) / 24
  const eyes = ([-1, 1] as const).map((side): Eye => {
    const p: Point = [
      (side * GAP * HALF) / 2 + glance[0],
      DROP * HALF + glance[1],
    ]
    const e = 1e-3
    const [x, y] = project(on(p))
    const [ux, uy] = project(on([p[0] + e, p[1]]))
    const [vx, vy] = project(on([p[0], p[1] + e]))
    const near = 1 + (DEPTH * (on(p)[2] - centreZ)) / HALF
    return {
      x,
      y,
      rot: Math.atan2(uy - y, ux - x) - LEAN * pose.eyeX,
      sx: (size * near * Math.hypot(ux - x, uy - y)) / e,
      sy: (size * near * Math.hypot(vx - x, vy - y)) / e,
    }
  })
  return { outline, eyes }
}

// His asterisk as a closed outline, on mabot's 24 grid centred on the origin,
// at mabot's line weight.
const WEIGHT = 2.75
const ARMS: Point[] = [
  [0, -7.5],
  [6.5, -3.75],
  [6.5, 3.75],
  [0, 7.5],
  [-6.5, 3.75],
  [-6.5, -3.75],
]
const ASTERISK = ARMS.flatMap(([dx, dy]) => {
  const a = Math.atan2(dy, dx)
  const len = Math.hypot(dx, dy)
  const h = WEIGHT / 2
  const [c, s] = [Math.cos(a), Math.sin(a)]
  const notch = h / Math.sin(Math.PI / 6)
  return [
    [c * len + s * h, s * len - c * h],
    [c * len - s * h, s * len + c * h],
    [Math.cos(a + Math.PI / 6) * notch, Math.sin(a + Math.PI / 6) * notch],
  ] as Point[]
})

const place = (points: Point[], { x, y, rot, sx, sy }: Eye, lid = 1) => {
  const [c, s] = [Math.cos(rot), Math.sin(rot)]
  return points.map(([gx, gy]): Point => {
    const ux = gx * sx
    const uy = gy * sy * lid
    return [x + ux * c - uy * s, y + ux * s + uy * c]
  })
}

/** An eye at a place on screen. `lid` is mabot's: 1 open, down to 0.08 mid-blink. */
export const eyePoints = (eye: Eye, lid = 1) => place(ASTERISK, eye, lid)
