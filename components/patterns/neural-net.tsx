import { PatternFrame, type PatternProps } from "./frame"
import { during, Flip, Run } from "./motion"

// A forward pass. The inputs come in, every input sends along each of its
// edges at once, and a layer fires only when its longest edge has
// delivered: hidden at 254.45, output at 356.9. Each node is toned from
// its first input until it has fired. Positions count from x -40.
const pass = { length: 684.9, w: 20 }
const P = pass.length + pass.w
const H = 254.45
const O = 356.9

const tone = (cx: number, cy: number, from: number, to: number) => (
  <circle
    cx={cx}
    cy={cy}
    r="10"
    fill="var(--ds-gray-300)"
    stroke="currentColor"
    {...during((from - pass.w) / P, (to - from) / P)}
  />
)

const edges = [
  ["M112 36L192 20", 152],
  ["M112 36L192 60", 152],
  ["M112 36L192 100", 152],
  ["M112 84L192 20", 152],
  ["M112 84L192 60", 152],
  ["M112 84L192 100", 152],
  ["M192 20L272 36", H],
  ["M192 20L272 84", H],
  ["M192 60L272 36", H],
  ["M192 60L272 84", H],
  ["M192 100L272 36", H],
  ["M192 100L272 84", H],
] as const

const node = (cx: number, cy: number) => (
  <circle
    cx={cx}
    cy={cy}
    r="10"
    fill="var(--ds-background-100)"
    stroke="currentColor"
  />
)

export function PatternNeuralNet(props: PatternProps) {
  return (
    <PatternFrame loop={10} {...props}>
      <path
        d="M112 36H-2000M112 84H-2000"
        stroke="currentColor"
        strokeDasharray="4 4"
      />
      <Run d="M-40 36H112" {...pass} />
      <Run d="M-40 84H112" {...pass} />
      <Flip d="M272 36H2400" start={O} {...pass} />
      <Flip d="M272 84H2400" start={O} {...pass} />
      {edges.map(([d, start]) => (
        <Flip key={d} d={d} start={start} {...pass} />
      ))}
      {node(112, 36)}
      {tone(112, 36, 142, 162)}
      {node(112, 84)}
      {tone(112, 84, 142, 162)}
      {node(192, 20)}
      {tone(192, 20, 152 + 81.58 - 10, H + 10)}
      {node(192, 100)}
      {tone(192, 100, 152 + 81.58 - 10, H + 10)}
      {node(272, 36)}
      {tone(272, 36, H + 81.58 - 10, O + 10)}
      {node(272, 84)}
      {tone(272, 84, H + 81.58 - 10, O + 10)}
      <circle cx="192" cy="60" r="10" fill="currentColor" />
    </PatternFrame>
  )
}
