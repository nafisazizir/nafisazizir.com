import posthog from "posthog-js"

// Mirrors `PostType` in `lib/content.ts`, which can't be imported here — it
// pulls in `node:fs` and these events fire from client components.
export type PostKind = "blog" | "project"

export interface SiteEvents {
  "nav opened": { path: string }
  "nav closed": { path: string }
  "nav link clicked": { from: string; to: string; label: string }
  "post opened": {
    slug: string
    kind: PostKind
    from: string
    position: number
  }
  "toc link clicked": { slug: string; heading: string }
  "article progress": { slug: string; kind: PostKind; percent: number }
  "article finished": { slug: string; kind: PostKind; seconds: number }
  "outbound link clicked": { href: string; label: string; path: string }
}

export function track<K extends keyof SiteEvents>(
  event: K,
  properties: SiteEvents[K]
) {
  if (!posthog.__loaded) return
  posthog.capture(event, properties)
}
