import { PatternFrame, type PatternProps } from "./frame"

export function PatternPrism(props: PatternProps) {
  return (
    <PatternFrame {...props}>
      <path d="M161.98 64H-2000" stroke="currentColor" />
      <path d="M228.95 76L2400 -488.47" stroke="currentColor" />
      <path
        d="M228.95 76L2400 32.58"
        stroke="currentColor"
        strokeDasharray="4 4"
      />
      <path
        d="M228.95 76L2400 423.37"
        stroke="currentColor"
        strokeDasharray="4 4"
      />
      <path
        d="M192 12L247.43 108H136.57Z"
        fill="var(--ds-background-100)"
        stroke="currentColor"
      />
      <path
        d="M161.98 64L228.95 76"
        stroke="currentColor"
        strokeDasharray="4 4"
      />
      <circle cx="161.98" cy="64" r="3" fill="currentColor" />
    </PatternFrame>
  )
}
