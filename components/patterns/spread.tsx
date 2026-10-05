import { PatternFrame, type PatternProps } from "./frame"

export function PatternSpread(props: PatternProps) {
  return (
    <PatternFrame {...props}>
      <path d="M195 110.3L2876 -1513.7H195Z" fill="var(--ds-background-100)" />
      <path
        d="M192 116.5L-2489 -1507.5"
        stroke="currentColor"
        strokeDasharray="4 4"
      />
      <path d="M192 116.5V-2000" stroke="currentColor" />
      <path d="M192 116.5L2873 -1507.5" stroke="currentColor" />
      <path
        d="M192 116.5L2873 -845.3"
        stroke="currentColor"
        strokeDasharray="4 4"
      />
      <path d="M192 116.5H2400" stroke="currentColor" strokeDasharray="4 4" />
      <rect x="189" y="113.5" width="6" height="6" fill="currentColor" />
    </PatternFrame>
  )
}
