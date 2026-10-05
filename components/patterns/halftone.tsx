import { PatternFrame, type PatternProps } from "./frame"

// A 12-pitch grid whose grains grow along the diagonal, eased at both ends.
const grains = Array.from({ length: 32 * 10 }, (_, i) => {
  const cx = 6 + (i % 32) * 12
  const cy = 6 + Math.floor(i / 32) * 12
  const t = Math.min(1, Math.max(0, (cx + 0.8 * (120 - cy) - 40) / 360))
  return { cx, cy, r: 2.6 * t * t * (3 - 2 * t) }
}).filter(({ r }) => r >= 0.5)

export function PatternHalftone(props: PatternProps) {
  return (
    <PatternFrame {...props}>
      {grains.map(({ cx, cy, r }) => (
        <circle
          key={`${cx}-${cy}`}
          cx={cx}
          cy={cy}
          r={r.toFixed(2)}
          fill="currentColor"
        />
      ))}
    </PatternFrame>
  )
}
