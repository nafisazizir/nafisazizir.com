import { PatternFrame, type PatternProps } from "./frame"
import { swing } from "./motion"

// Noise resolving into a form: grains shrink and settle onto the grid as
// they near the subject, and scatter as they leave it. Moving, each grain
// drifts about its place by its noise level, so the field far out stirs
// and the grains near the form are still.
const grains = Array.from({ length: 32 * 10 }, (_, i) => {
  const cx = 6 + (i % 32) * 12
  const cy = 6 + Math.floor(i / 32) * 12
  const t = Math.min(1, Math.max(0, (Math.hypot(cx - 192, cy - 60) - 36) / 150))
  const random = (seed: number) => (Math.sin(seed) * 43758.5453) % 1
  const jitter = (seed: number) => random(seed) * 3 * t
  const angle = random(i * 4.1414) * Math.PI
  const clamp = (v: number, edge: number) =>
    Math.min(edge - 3.5, Math.max(3.5, v))
  return {
    cx: clamp(cx + jitter(i * 12.9898), 384),
    cy: clamp(cy + jitter(i * 78.233), 120),
    r: 1.8 * t * t * (3 - 2 * t),
    drift: swing(1.5 * t * Math.cos(angle), 1.5 * t * Math.sin(angle), {
      phase: Math.abs(random(i * 3.7)),
    }),
  }
}).filter(({ r }) => r >= 0.5)

export function PatternDiffusion(props: PatternProps) {
  return (
    <PatternFrame loop={8} {...props}>
      {grains.map(({ cx, cy, r, drift }, i) => (
        <circle
          key={i}
          cx={cx.toFixed(2)}
          cy={cy.toFixed(2)}
          r={r.toFixed(2)}
          fill="currentColor"
          {...drift}
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
