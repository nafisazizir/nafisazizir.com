import type { Metadata } from "next"

import { PostList } from "@/components/article/post-list"
import { getPostsByType } from "@/lib/content"

export const metadata: Metadata = {
  title: "Blogs",
  description: "Writing on software, product, and the things in between.",
}

export default function BlogsPage() {
  const items = getPostsByType("blog").map((p) => ({
    slug: p.slug,
    title: p.frontmatter.title,
    description: p.frontmatter.description,
    date: p.frontmatter.date,
    tags: p.frontmatter.tags,
  }))

  return <PostList items={items} basePath="/blogs" />
}
