import { PatternFrame, type PatternProps } from "./frame"

// Noise resolving into a form: grains shrink and settle onto the grid as
// they near the subject, and scatter as they leave it.
const grains = Array.from({ length: 32 * 10 }, (_, i) => {
  const cx = 6 + (i % 32) * 12
  const cy = 6 + Math.floor(i / 32) * 12
  const t = Math.min(1, Math.max(0, (Math.hypot(cx - 192, cy - 60) - 36) / 150))
  const jitter = (seed: number) => ((Math.sin(seed) * 43758.5453) % 1) * 3 * t
  return {
    cx: cx + jitter(i * 12.9898),
    cy: Math.min(117, Math.max(3, cy + jitter(i * 78.233))),
    r: 1.8 * t * t * (3 - 2 * t),
  }
}).filter(({ r }) => r >= 0.5)

export function PatternDiffusion(props: PatternProps) {
  return (
    <PatternFrame {...props}>
      {grains.map(({ cx, cy, r }, i) => (
        <circle
          key={i}
          cx={cx.toFixed(2)}
          cy={cy.toFixed(2)}
          r={r.toFixed(2)}
          fill="currentColor"
        />
      ))}
      <circle
        cx="192"
        cy="60"
        r="44"
        stroke="currentColor"
        strokeDasharray="4 4"
      />
      <circle
        cx="192"
        cy="60"
        r="24"
        fill="var(--ds-background-100)"
        stroke="currentColor"
      />
      <circle cx="192" cy="60" r="3" fill="currentColor" />
    </PatternFrame>
  )
}
