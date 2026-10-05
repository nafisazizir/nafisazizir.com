import type { Metadata } from "next"

import { ListPage } from "@/components/article/list-page"

export const metadata: Metadata = {
  title: "Projects",
  description: "Things I've built — tools, apps, and experiments.",
}

export default function ProjectsPage() {
  return (
    <ListPage
      type="project"
      title="Things I've built:"
      subtitle="tools, apps, and experiments"
    />
  )
}
