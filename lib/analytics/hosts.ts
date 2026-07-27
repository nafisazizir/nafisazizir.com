// Deliberately meaningless: content blockers match "/analytics", "/ingest" and
// friends as literal path strings, which would defeat the proxy.
export const POSTHOG_PROXY_PATH = "/nfs"

const REGIONS = {
  us: {
    api: "https://us.i.posthog.com",
    assets: "https://us-assets.i.posthog.com",
    ui: "https://us.posthog.com",
  },
  eu: {
    api: "https://eu.i.posthog.com",
    assets: "https://eu-assets.i.posthog.com",
    ui: "https://eu.posthog.com",
  },
} as const

export type PostHogRegion = keyof typeof REGIONS

export function postHogHosts() {
  const region: PostHogRegion =
    process.env.NEXT_PUBLIC_POSTHOG_REGION === "eu" ? "eu" : "us"
  return REGIONS[region]
}
