import { PatternFrame, type PatternProps } from "./frame"
import { Clip, during, turn, zoom } from "./motion"

// Self-similarity: one quarter turn about the spiral's pole and a scale of
// 1/φ carry each square onto the next. A ghost of the first square makes
// that move once a quarter loop, landing on the next square as the next
// ghost leaves the first, so the construction keeps folding inward.
const pole = [330.28, 86.61] as const

export function PatternGolden(props: PatternProps) {
  return (
    <PatternFrame {...props}>
      <path d="M190.95 0.5H-2000" stroke="currentColor" strokeDasharray="4 4" />
      <path
        d="M190.95 119.5H-2000"
        stroke="currentColor"
        strokeDasharray="4 4"
      />
      <rect
        x="190.95"
        y="0.5"
        width="192.55"
        height="119"
        fill="var(--ds-background-100)"
        stroke="currentColor"
      />
      <Clip x={190.95} y={0.5} width={192.55} height={119}>
        {[0, 1, 2, 3].map((quarter) => (
          <g key={quarter} {...during(quarter / 4, 1 / 4)}>
            <g {...turn(...pole)}>
              <g {...zoom(...pole, 0.618, { speed: 4 })}>
                <path
                  d="M190.95 0.5H309.95V119.5H190.95Z"
                  stroke="currentColor"
                  strokeDasharray="4 4"
                  transform={`rotate(${-90 * quarter} ${pole.join(" ")})`}
                />
              </g>
            </g>
          </g>
        ))}
      </Clip>
      <path
        d="M309.95 0.5V119.5M309.95 74.05H383.5M338.05 74.05V119.5M309.95 91.41H338.05M327.32 74.05V91.41"
        stroke="currentColor"
        strokeDasharray="4 4"
      />
      <path
        d="M190.95 119.5A119 119 0 0 1 309.95 0.5A73.55 73.55 0 0 1 383.5 74.05A45.45 45.45 0 0 1 338.05 119.5A28.09 28.09 0 0 1 309.95 91.41A17.36 17.36 0 0 1 327.32 74.05"
        stroke="currentColor"
      />
      <circle cx="327.32" cy="91.41" r="3" fill="currentColor" />
    </PatternFrame>
  )
}
