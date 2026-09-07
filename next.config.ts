import type { NextConfig } from "next"

import { POSTHOG_PROXY_PATH, postHogHosts } from "./lib/analytics/hosts"

const posthog = postHogHosts()

const nextConfig: NextConfig = {
  // Short, presentable links for profile/bio fields that render the raw URL
  // (GitHub, X) — they redirect onto the UTM-tagged destination. Temporary so
  // the campaign values stay editable; a 308 would be cached by browsers.
  async redirects() {
    return [
      {
        source: "/x",
        destination: "/?utm_source=x&utm_medium=bio",
        permanent: false,
      },
      {
        source: "/gh",
        destination: "/?utm_source=github&utm_medium=profile",
        permanent: false,
      },
      {
        source: "/li",
        destination: "/?utm_source=linkedin&utm_medium=profile",
        permanent: false,
      },
      {
        source: "/mail",
        destination: "/?utm_source=email&utm_medium=signature",
        permanent: false,
      },
      {
        source: "/cv",
        destination: "/about?utm_source=resume&utm_medium=pdf",
        permanent: false,
      },
    ]
  },

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
