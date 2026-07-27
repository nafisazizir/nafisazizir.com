"use client"

import { useEffect } from "react"
import posthog from "posthog-js"
import { PostHogProvider as Provider } from "posthog-js/react"

import { POSTHOG_PROXY_PATH, postHogHosts } from "@/lib/analytics/hosts"

const KEY = process.env.NEXT_PUBLIC_POSTHOG_KEY

const ENABLED =
  Boolean(KEY) &&
  (process.env.NODE_ENV === "production" ||
    process.env.NEXT_PUBLIC_POSTHOG_DEBUG === "1")

export function PostHogProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    if (!ENABLED || posthog.__loaded) return

    posthog.init(KEY!, {
      api_host: POSTHOG_PROXY_PATH,
      ui_host: postHogHosts().ui,
      defaults: "2026-06-25",
      // Anonymous events bill at a fraction of identified ones, and nobody
      // ever logs in here.
      person_profiles: "identified_only",
      capture_performance: { web_vitals: true },
      session_recording: {
        maskAllInputs: true,
        maskTextSelector: "[data-ph-mask]",
      },
      loaded: (ph) => {
        if (process.env.NEXT_PUBLIC_POSTHOG_DEBUG === "1") ph.debug()
      },
    })
  }, [])

  if (!ENABLED) return children

  return <Provider client={posthog}>{children}</Provider>
}
