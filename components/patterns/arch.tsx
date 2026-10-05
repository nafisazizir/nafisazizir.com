import { PatternFrame, type PatternProps } from "./frame"

export function PatternArch(props: PatternProps) {
  return (
    <PatternFrame {...props}>
      <path d="M96.5 119.5H-2000" stroke="currentColor" strokeDasharray="4 4" />
      <path d="M287.5 119.5H2400" stroke="currentColor" strokeDasharray="4 4" />
      <path d="M192 24V-2000" stroke="currentColor" />
      <path
        d="M96.5 119.5A95.5 95.5 0 0 1 287.5 119.5Z"
        fill="var(--ds-background-100)"
        stroke="currentColor"
      />
      <path
        d="M136.5 119.5A55.5 55.5 0 0 1 247.5 119.5"
        stroke="currentColor"
        strokeDasharray="4 4"
      />
      <rect x="189" y="21" width="6" height="6" fill="currentColor" />
    </PatternFrame>
  )
}
