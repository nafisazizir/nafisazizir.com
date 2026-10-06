import { PatternFrame, type PatternProps } from "./frame"
import { Flip, on } from "./motion"

// A search from the root to a leaf along M192.5 -200V32.5H296.5V82.5
// H328.5V104.5: down the root pointer, into the child whose range holds
// the key, which is toned while the search is in it, and down to the leaf,
// which fills. The siblings are never visited.
const search = { length: 440.5, w: 24 }

export function PatternTree(props: PatternProps) {
  return (
    <PatternFrame loop={8} {...props}>
      <Flip d="M192.5 -2000V8.5" start={-1800} {...search} />
      <Flip d="M192.5 8.5V32.5" start={208.5} {...search} />
      <path d="M88.5 46.5V32.5H192.5" stroke="currentColor" />
      <Flip d="M192.5 32.5H296.5V46.5" start={232.5} {...search} />
      <path
        d="M88.5 66.5V82.5M56.5 104.5V82.5H120.5V104.5M264.5 104.5V82.5H296.5"
        stroke="currentColor"
      />
      <Flip d="M296.5 66.5V82.5H328.5V104.5" start={370.5} {...search} />
      <path
        d="M192.5 32.5V46.5M192.5 66.5V104.5"
        stroke="currentColor"
        strokeDasharray="4 4"
      />
      <rect
        x="56.5"
        y="46.5"
        width="64"
        height="20"
        rx="10"
        fill="var(--ds-background-100)"
        stroke="currentColor"
      />
      <rect
        x="160.5"
        y="46.5"
        width="64"
        height="20"
        rx="10"
        fill="var(--ds-background-100)"
        stroke="currentColor"
        strokeDasharray="4 4"
      />
      <rect
        x="264.5"
        y="46.5"
        width="64"
        height="20"
        rx="10"
        fill="var(--ds-background-100)"
        stroke="currentColor"
      />
      <rect
        x="264.5"
        y="46.5"
        width="64"
        height="20"
        rx="10"
        fill="var(--ds-gray-300)"
        stroke="currentColor"
        {...on(search, 360.5, 10)}
      />
      <circle
        cx="56.5"
        cy="104.5"
        r="4"
        fill="var(--ds-background-100)"
        stroke="currentColor"
      />
      <circle
        cx="120.5"
        cy="104.5"
        r="4"
        fill="var(--ds-background-100)"
        stroke="currentColor"
      />
      <circle
        cx="264.5"
        cy="104.5"
        r="4"
        fill="var(--ds-background-100)"
        stroke="currentColor"
      />
      <circle
        cx="328.5"
        cy="104.5"
        r="4"
        fill="var(--ds-background-100)"
        stroke="currentColor"
      />
      <circle
        cx="328.5"
        cy="104.5"
        r="4"
        fill="currentColor"
        stroke="currentColor"
        {...on(search, 440.5, 4)}
      />
      <circle
        cx="192.5"
        cy="104.5"
        r="4"
        fill="var(--ds-background-100)"
        stroke="currentColor"
      />
      <rect x="189.5" y="5.5" width="6" height="6" fill="currentColor" />
    </PatternFrame>
  )
}
