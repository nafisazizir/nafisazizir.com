import type { Metadata } from "next"

import { PostList } from "@/components/article/post-list"
import { getPostsByType } from "@/lib/content"

export const metadata: Metadata = {
  title: "Projects",
  description: "Things I've built — tools, apps, and experiments.",
}

export default function ProjectsPage() {
  const items = getPostsByType("project").map((p) => ({
    slug: p.slug,
    title: p.frontmatter.title,
    description: p.frontmatter.description,
    date: p.frontmatter.date,
    tags: p.frontmatter.tags,
  }))

  return <PostList items={items} basePath="/projects" heading="Projects" />
}
