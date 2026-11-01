import type { Metadata } from "next"

import { StreakStudio } from "@/components/labs/streaks/streak-studio"
import { getLab } from "@/lib/labs"

const lab = getLab("streaks")!

export const metadata: Metadata = {
  title: `${lab.title} · Labs`,
  description: lab.description,
}

// The studio is the whole page: it fills the viewport and brings its own
// header, so there is no page wrapper or edge fade here.
export default function StreaksPage() {
  return <StreakStudio title={lab.title} />
}
