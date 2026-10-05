import { PatternFrame, type PatternProps } from "./frame"

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
