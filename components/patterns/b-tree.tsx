import { PatternFrame, type PatternProps } from "./frame"

export function PatternBTree(props: PatternProps) {
  return (
    <PatternFrame {...props}>
      <path d="M192.5 12.5V-2000" stroke="currentColor" />
      <path d="M24.5 84.5H-2000" stroke="currentColor" strokeDasharray="4 4" />
      <path d="M360.5 84.5H2400" stroke="currentColor" />
      <path d="M108.5 84.5H150.5M234.5 84.5H276.5" stroke="currentColor" />
      <path
        d="M164.5 36.5L66.5 72.5M220.5 36.5L318.5 72.5"
        stroke="currentColor"
        strokeDasharray="4 4"
      />
      <path d="M192.5 36.5V72.5" stroke="currentColor" />
      <rect
        x="164.5"
        y="12.5"
        width="56"
        height="24"
        fill="var(--ds-background-100)"
        stroke="currentColor"
      />
      <path d="M192.5 12.5V36.5" stroke="currentColor" />
      <rect
        x="24.5"
        y="72.5"
        width="84"
        height="24"
        fill="var(--ds-background-100)"
        stroke="currentColor"
      />
      <path d="M52.5 72.5V96.5M80.5 72.5V96.5" stroke="currentColor" />
      <rect
        x="150.5"
        y="72.5"
        width="84"
        height="24"
        fill="var(--ds-background-100)"
        stroke="currentColor"
      />
      <path d="M178.5 72.5V96.5M206.5 72.5V96.5" stroke="currentColor" />
      <rect
        x="276.5"
        y="72.5"
        width="84"
        height="24"
        fill="var(--ds-background-100)"
        stroke="currentColor"
      />
      <path d="M304.5 72.5V96.5M332.5 72.5V96.5" stroke="currentColor" />
      <rect
        x="178.5"
        y="72.5"
        width="28"
        height="24"
        fill="var(--ds-gray-300)"
        stroke="currentColor"
      />
    </PatternFrame>
  )
}
