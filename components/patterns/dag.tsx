import { PatternFrame, type PatternProps } from "./frame"
import { during, Flip, Run } from "./motion"

// The source fans out to both tasks at once. The done task hands on
// straight away; the pending one is still working (its window circles it)
// and hands on later. The sink waits, toned, until both inputs are in,
// then fires. Positions are along M-40 60.5H600 through either branch.
const run = { length: 833.72, w: 28 }
const P = run.length + run.w
const head = (at: number) => (at - run.w) / P

export function PatternDag(props: PatternProps) {
  return (
    <PatternFrame {...props}>
      <path d="M56.5 60.5H-2000" stroke="currentColor" strokeDasharray="4 4" />
      <Run d="M-40 60.5H56.5" {...run} />
      <Flip d="M328.5 60.5H2400" start={562.22} {...run} />
      <Flip
        d="M112.5 60.5C136.5 60.5 136.5 28.5 160.5 28.5"
        start={152.5}
        {...run}
      />
      <Flip
        d="M224.5 28.5C248.5 28.5 248.5 60.5 272.5 60.5"
        start={276.81}
        {...run}
      />
      <path
        d="M112.5 60.5C136.5 60.5 136.5 92.5 160.5 92.5M224.5 92.5C248.5 92.5 248.5 60.5 272.5 60.5"
        stroke="currentColor"
        strokeDasharray="4 4"
      />
      <Run
        d="M112.5 60.5C136.5 60.5 136.5 92.5 160.5 92.5"
        start={152.5}
        {...run}
      />
      <Run
        d="M224.5 92.5C248.5 92.5 248.5 60.5 272.5 60.5"
        start={445.91}
        {...run}
      />
      <rect
        x="56.5"
        y="48.5"
        width="56"
        height="24"
        rx="12"
        fill="var(--ds-background-100)"
        stroke="currentColor"
      />
      <rect
        x="160.5"
        y="16.5"
        width="64"
        height="24"
        rx="12"
        fill="var(--ds-background-100)"
        stroke="currentColor"
      />
      <rect
        x="160.5"
        y="80.5"
        width="64"
        height="24"
        rx="12"
        stroke="currentColor"
        strokeDasharray="4 4"
      />
      <Run
        d="M160.5 92.5A12 12 0 0 1 172.5 80.5H212.5A12 12 0 0 1 224.5 92.5A12 12 0 0 1 212.5 104.5H172.5A12 12 0 0 1 160.5 92.5A12 12 0 0 1 172.5 80.5H212.5A12 12 0 0 1 224.5 92.5"
        start={212.81}
        {...run}
      />
      <rect
        x="272.5"
        y="48.5"
        width="56"
        height="24"
        rx="12"
        fill="var(--ds-background-100)"
        stroke="currentColor"
      />
      <rect
        x="272.5"
        y="48.5"
        width="56"
        height="24"
        rx="12"
        fill="var(--ds-gray-300)"
        stroke="currentColor"
        {...during(head(337.12), (506.22 - 337.12) / P)}
      />
    </PatternFrame>
  )
}
