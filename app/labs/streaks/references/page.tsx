import type { Metadata } from "next"
import { notFound } from "next/navigation"

import { ReferenceBoard } from "@/components/labs/streaks/reference-board"

export const metadata: Metadata = {
  title: "Streak references · Labs",
  robots: { index: false },
}

// Each reference pick next to its recreation in the streak shader: the
// baseline the studio is tuned against. Dev only, since the references are
// a local, git-ignored library of someone else's art.
export default function StreakReferencesPage() {
  if (process.env.NODE_ENV === "production") notFound()
  return <ReferenceBoard />
}
