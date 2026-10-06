import { PatternFrame, type PatternProps } from "./frame"
import { Flip } from "./motion"

// A lookup, then a range scan, along M192.5 -200V84.5H600: down the root
// pointer, through the root and down the one child pointer the key
// selects, into the leaf holding it, then on along the leaf links.
const lookup = { length: 692, w: 28 }

export function PatternBTree(props: PatternProps) {
  return (
    <PatternFrame loop={10} {...props}>
      <Flip d="M192.5 -2000V12.5" start={-1800} {...lookup} />
      <path d="M24.5 84.5H-2000" stroke="currentColor" strokeDasharray="4 4" />
      <Flip d="M360.5 84.5H2400" start={452.5} {...lookup} />
      <path d="M108.5 84.5H150.5" stroke="currentColor" />
      <Flip d="M234.5 84.5H276.5" start={326.5} {...lookup} />
      <path
        d="M164.5 36.5L66.5 72.5M220.5 36.5L318.5 72.5"
        stroke="currentColor"
        strokeDasharray="4 4"
      />
      <Flip d="M192.5 36.5V72.5" start={236.5} {...lookup} />
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
