import { PatternFrame, type PatternProps } from "./frame"

export function PatternStack(props: PatternProps) {
  return (
    <PatternFrame {...props}>
      <path d="M192 8V-2000" stroke="currentColor" />
      <path
        d="M80 22V98M304 22V98M192 36V112"
        stroke="currentColor"
        strokeDasharray="4 4"
      />
      <path
        d="M80 98L192 84L304 98L192 112Z"
        fill="var(--ds-background-100)"
        stroke="currentColor"
        strokeDasharray="4 4"
      />
      <path
        d="M80 60L192 46L304 60L192 74Z"
        fill="var(--ds-background-100)"
        stroke="currentColor"
        strokeDasharray="4 4"
      />
      <path
        d="M80 22L192 8L304 22L192 36Z"
        fill="var(--ds-background-100)"
        stroke="currentColor"
      />
      <rect x="189" y="5" width="6" height="6" fill="currentColor" />
    </PatternFrame>
  )
}
