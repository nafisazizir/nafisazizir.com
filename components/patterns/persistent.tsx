import { PatternFrame, type PatternProps } from "./frame"
import { Flip, on, Run } from "./motion"

// The same read through both versions at once: down each root's pointer
// and edge, the two meet at the node the versions share and go on as one
// down the shared subtree, which is toned while the read is in it.
const read = { length: 324.03, w: 24 }

export function PatternPersistent(props: PatternProps) {
  return (
    <PatternFrame loop={8} {...props}>
      <path d="M144 12.5V-2000" stroke="currentColor" strokeDasharray="4 4" />
      <Run d="M144 -200V12.5" {...read} />
      <Flip d="M240 -2000V12.5" start={-1800} {...read} />
      <path
        d="M144 12.5L96 60M144 12.5L192 60M96 60L96 104"
        stroke="currentColor"
        strokeDasharray="4 4"
      />
      <Run d="M144 12.5L192 60" start={212.5} {...read} />
      <Flip d="M240 12.5L192 60" start={212.5} {...read} />
      <path d="M240 12.5L288 60M288 60L288 104" stroke="currentColor" />
      <Flip d="M192 60L192 104" start={280.03} {...read} />
      <circle
        cx="96"
        cy="60"
        r="8"
        fill="var(--ds-background-100)"
        stroke="currentColor"
        strokeDasharray="4 4"
      />
      <circle
        cx="96"
        cy="104"
        r="8"
        fill="var(--ds-background-100)"
        stroke="currentColor"
        strokeDasharray="4 4"
      />
      <circle
        cx="192"
        cy="60"
        r="10"
        fill="var(--ds-background-100)"
        stroke="currentColor"
      />
      <circle
        cx="192"
        cy="60"
        r="10"
        fill="var(--ds-gray-300)"
        stroke="currentColor"
        {...on(read, 280.03, 10)}
      />
      <circle
        cx="192"
        cy="104"
        r="10"
        fill="var(--ds-background-100)"
        stroke="currentColor"
      />
      <circle
        cx="192"
        cy="104"
        r="10"
        fill="var(--ds-gray-300)"
        stroke="currentColor"
        {...on(read, 324.03, 10)}
      />
      <circle cx="288" cy="60" r="8" fill="currentColor" />
      <circle cx="288" cy="104" r="8" fill="currentColor" />
      <rect
        x="141"
        y="9.5"
        width="6"
        height="6"
        fill="var(--ds-background-100)"
        stroke="currentColor"
      />
      <rect x="237" y="9.5" width="6" height="6" fill="currentColor" />
    </PatternFrame>
  )
}
