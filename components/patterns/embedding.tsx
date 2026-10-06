import { PatternFrame, type PatternProps } from "./frame"
import { Flip, on, Run } from "./motion"

// The query is embedded: it runs out along its vector from the origin,
// lands, and its nearest cluster is traced once round from where the
// vector crosses it, the query filled while it is assigned. Positions run
// along the vector (200.83), then round the cluster (276.46).
const embed = { length: 477.29, w: 24 }

export function PatternEmbedding(props: PatternProps) {
  return (
    <PatternFrame {...props}>
      <path d="M24.5 116.5V-2000" stroke="currentColor" />
      <path d="M24.5 116.5H2400" stroke="currentColor" />
      <circle
        cx="92"
        cy="50"
        r="28"
        stroke="currentColor"
        strokeDasharray="4 4"
      />
      <circle
        cx="324"
        cy="88"
        r="24"
        stroke="currentColor"
        strokeDasharray="4 4"
      />
      <circle
        cx="216"
        cy="56"
        r="44"
        fill="var(--ds-background-100)"
        stroke="currentColor"
        strokeDasharray="4 4"
      />
      <Run
        d="M174.04 69.26A44 44 0 0 1 257.96 42.74A44 44 0 0 1 174.04 69.26"
        start={200.83}
        {...embed}
      />
      <Flip d="M24.5 116.5L216 56" {...embed} />
      <path
        d="M78 36a2 2 0 1 0 4 0a2 2 0 1 0 -4 0M96 42a2 2 0 1 0 4 0a2 2 0 1 0 -4 0M82 56a2 2 0 1 0 4 0a2 2 0 1 0 -4 0M100 62a2 2 0 1 0 4 0a2 2 0 1 0 -4 0M188 40a2 2 0 1 0 4 0a2 2 0 1 0 -4 0M230 34a2 2 0 1 0 4 0a2 2 0 1 0 -4 0M238 68a2 2 0 1 0 4 0a2 2 0 1 0 -4 0M198 76a2 2 0 1 0 4 0a2 2 0 1 0 -4 0M220 78a2 2 0 1 0 4 0a2 2 0 1 0 -4 0M314 74a2 2 0 1 0 4 0a2 2 0 1 0 -4 0M332 88a2 2 0 1 0 4 0a2 2 0 1 0 -4 0M316 100a2 2 0 1 0 4 0a2 2 0 1 0 -4 0"
        fill="currentColor"
      />
      <circle
        cx="216"
        cy="56"
        r="4"
        fill="var(--ds-background-100)"
        stroke="currentColor"
      />
      <circle
        cx="216"
        cy="56"
        r="4"
        fill="currentColor"
        stroke="currentColor"
        {...on(embed, 339.06, 138.23)}
      />
      <rect x="21.5" y="113.5" width="6" height="6" fill="currentColor" />
    </PatternFrame>
  )
}
