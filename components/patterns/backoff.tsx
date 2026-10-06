import { PatternFrame, type PatternProps } from "./frame"
import { Flip, on, Run } from "./motion"

// One run at an even pace along M-40 96.5H40.5, the three arcs and out:
// each arc is twice the last, so each wait before a retry takes twice as
// long. Each attempt lights as the run leaves it.
const retry = { length: 767.86, w: 24 }
const attempt = (cx: number, at: number) => (
  <circle cx={cx} cy="96.5" r="4" fill="currentColor" {...on(retry, at, 4)} />
)

export function PatternBackoff(props: PatternProps) {
  return (
    <PatternFrame {...props}>
      <path d="M40.5 96.5H-2000" stroke="currentColor" strokeDasharray="4 4" />
      <Run d="M-40 96.5H40.5" {...retry} />
      <path d="M40.5 96.5H264.5" stroke="currentColor" strokeDasharray="4 4" />
      <Flip
        d="M40.5 96.5A16.0 16.0 0 0 1 72.5 96.5M72.5 96.5A32.0 32.0 0 0 1 136.5 96.5M136.5 96.5A64.0 64.0 0 0 1 264.5 96.5"
        start={80.5}
        {...retry}
      />
      <Flip d="M264.5 96.5H2400" start={432.36} {...retry} />
      <circle
        cx="40.5"
        cy="96.5"
        r="4"
        fill="var(--ds-background-100)"
        stroke="currentColor"
      />
      <circle
        cx="72.5"
        cy="96.5"
        r="4"
        fill="var(--ds-background-100)"
        stroke="currentColor"
      />
      <circle
        cx="136.5"
        cy="96.5"
        r="4"
        fill="var(--ds-background-100)"
        stroke="currentColor"
      />
      {attempt(40.5, 80.5)}
      {attempt(72.5, 130.77)}
      {attempt(136.5, 231.31)}
      <rect x="261.5" y="93.5" width="6" height="6" fill="currentColor" />
    </PatternFrame>
  )
}
