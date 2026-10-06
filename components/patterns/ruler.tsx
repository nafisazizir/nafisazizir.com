import { PatternFrame, type PatternProps } from "./frame"
import { Clip, slide } from "./motion"

// A tick every 8, a long one every 32, from one long period left of the
// frame. The scale slides one long period per cycle under the fixed span,
// which always reads the same three periods; the clip keeps the ticks to
// the frame's 8 to 376.
const ticks = Array.from({ length: 51 }, (_, i) => {
  const x = -24 + i * 8
  return `M${x + 0.5} 88.5v${(x + 32) % 32 === 0 ? -14 : -6}`
}).join("")

export function PatternRuler(props: PatternProps) {
  return (
    <PatternFrame {...props}>
      <path d="M160.5 88.5V-2000H256.5V88.5Z" fill="var(--ds-background-100)" />
      <path
        d="M160.5 88.5V-2000M256.5 88.5V-2000"
        stroke="currentColor"
        strokeDasharray="4 4"
      />
      <path d="M-2000 88.5H2400" stroke="currentColor" />
      <Clip x={4} y={60} width={376} height={32}>
        <path d={ticks} stroke="currentColor" {...slide(32, 0, { speed: 2 })} />
      </Clip>
      <rect x="157.5" y="85.5" width="6" height="6" fill="currentColor" />
      <rect x="253.5" y="85.5" width="6" height="6" fill="currentColor" />
    </PatternFrame>
  )
}
