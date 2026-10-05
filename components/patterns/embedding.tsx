import { PatternFrame, type PatternProps } from "./frame"

export function PatternEmbedding(props: PatternProps) {
  return (
    <PatternFrame {...props}>
      <path d="M24.5 112.5V-2000" stroke="currentColor" />
      <path d="M24.5 112.5H2400" stroke="currentColor" />
      <circle
        cx="92"
        cy="46"
        r="28"
        stroke="currentColor"
        strokeDasharray="4 4"
      />
      <circle
        cx="324"
        cy="84"
        r="24"
        stroke="currentColor"
        strokeDasharray="4 4"
      />
      <circle
        cx="216"
        cy="52"
        r="44"
        fill="var(--ds-background-100)"
        stroke="currentColor"
        strokeDasharray="4 4"
      />
      <path d="M24.5 112.5L216 52" stroke="currentColor" />
      <path
        d="M78 32a2 2 0 1 0 4 0a2 2 0 1 0 -4 0M96 38a2 2 0 1 0 4 0a2 2 0 1 0 -4 0M82 52a2 2 0 1 0 4 0a2 2 0 1 0 -4 0M100 58a2 2 0 1 0 4 0a2 2 0 1 0 -4 0M188 36a2 2 0 1 0 4 0a2 2 0 1 0 -4 0M230 30a2 2 0 1 0 4 0a2 2 0 1 0 -4 0M238 64a2 2 0 1 0 4 0a2 2 0 1 0 -4 0M198 72a2 2 0 1 0 4 0a2 2 0 1 0 -4 0M220 74a2 2 0 1 0 4 0a2 2 0 1 0 -4 0M314 70a2 2 0 1 0 4 0a2 2 0 1 0 -4 0M332 84a2 2 0 1 0 4 0a2 2 0 1 0 -4 0M316 96a2 2 0 1 0 4 0a2 2 0 1 0 -4 0"
        fill="currentColor"
      />
      <circle
        cx="216"
        cy="52"
        r="4"
        fill="var(--ds-background-100)"
        stroke="currentColor"
      />
      <rect x="21.5" y="109.5" width="6" height="6" fill="currentColor" />
    </PatternFrame>
  )
}
