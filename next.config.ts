import type { NextConfig } from "next"

import { POSTHOG_PROXY_PATH, postHogHosts } from "./lib/analytics/hosts"

const posthog = postHogHosts()

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: `${POSTHOG_PROXY_PATH}/static/:path*`,
        destination: `${posthog.assets}/static/:path*`,
      },
      {
        source: `${POSTHOG_PROXY_PATH}/array/:path*`,
        destination: `${posthog.assets}/array/:path*`,
      },
      {
        source: `${POSTHOG_PROXY_PATH}/:path*`,
        destination: `${posthog.api}/:path*`,
      },
    ]
  },
  // Without this, Next inserts a trailing-slash redirect in front of PostHog's
  // API paths and the requests never arrive.
  skipTrailingSlashRedirect: true,
}

export default nextConfig
