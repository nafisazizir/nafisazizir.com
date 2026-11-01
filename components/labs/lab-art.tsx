"use client"

import type { ReactNode } from "react"

import { StreakStill } from "@/components/labs/streaks/streak-still"

// Card art for each lab, by slug. A lab without an entry gets a blank panel.
const ART: Record<string, () => ReactNode> = {
  streaks: () => <StreakStill />,
}

export function LabArt({ slug }: { slug: string }) {
  return ART[slug]?.() ?? <div className="size-full bg-gray-100" />
}
