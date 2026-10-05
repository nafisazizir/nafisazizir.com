import type { ReactNode } from "react"

import { PostList } from "@/components/article/post-list"
import { ContactFooter } from "@/components/contact-footer"
import { EdgeFade } from "@/components/edge-fade"
import { PatternStage } from "@/components/patterns"
import { getPostsByType, type PostType } from "@/lib/content"
import { patternFor } from "@/lib/post-art"

const BASE_PATHS: Record<PostType, string> = {
  blog: "/blogs",
  project: "/projects",
}

// A list page: a headline, then every post. The column is 1262px, wider
// than an article's 1120px, so three cards across each get the 410px of
// x.com's blog cards, the width a 24px title needs to clear its pattern.
// Patterns are staged here, on the server, so the client list never ships
// the whole set; it gets each post's art as a finished node.
export function ListPage({
  type,
  title,
  subtitle,
}: {
  type: PostType
  title: ReactNode
  subtitle: ReactNode
}) {
  const items = getPostsByType(type).map((post) => ({
    slug: post.slug,
    title: post.frontmatter.title,
    description: post.frontmatter.description,
    date: post.frontmatter.date,
    art: (
      <PatternStage
        pattern={patternFor(post).Component}
        anchor="top"
        className="size-full"
      />
    ),
  }))

  return (
    <div className="relative min-h-screen overflow-x-clip">
      <EdgeFade side="top" />
      <main className="mx-auto w-full max-w-327.5 px-5 pt-20 pb-32 md:px-6 lg:pt-24">
        <PostList
          items={items}
          basePath={BASE_PATHS[type]}
          title={title}
          subtitle={subtitle}
        />
        <ContactFooter className="mt-24" />
      </main>
      <EdgeFade side="bottom" />
    </div>
  )
}
