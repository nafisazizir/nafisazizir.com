import { PatternFrame, type PatternProps } from "./frame"
import { Flip, Run } from "./motion"

// Every ray carries the same wave out from the vertex: solid on a dashed
// ray, dashed on a solid one.
const wave = { w: 40, p: 160, speed: 3 }

export function PatternSpread(props: PatternProps) {
  return (
    <PatternFrame {...props}>
      <path d="M195 110.3L2876 -1513.7H195Z" fill="var(--ds-background-100)" />
      <path
        d="M192 116.5L-2489 -1507.5"
        stroke="currentColor"
        strokeDasharray="4 4"
      />
      <Run d="M192 116.5L-2489 -1507.5" length={3134.6} {...wave} />
      <Flip d="M192 116.5V-2000" length={2116.5} {...wave} />
      <Flip d="M192 116.5L2873 -1507.5" length={3134.6} {...wave} />
      <path
        d="M192 116.5L2873 -845.3"
        stroke="currentColor"
        strokeDasharray="4 4"
      />
      <Run d="M192 116.5L2873 -845.3" length={2848.3} {...wave} />
      <path d="M192 116.5H2400" stroke="currentColor" strokeDasharray="4 4" />
      <Run d="M192 116.5H2400" length={2208} {...wave} />
      <rect x="189" y="113.5" width="6" height="6" fill="currentColor" />
    </PatternFrame>
  )
}
