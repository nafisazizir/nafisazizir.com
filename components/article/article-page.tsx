import { MDXContent } from "@/components/article/mdx-content"
import { Toc } from "@/components/article/toc"
import type { Post } from "@/lib/content"
import { formatDate } from "@/lib/utils"

export function ArticlePage({ post }: { post: Post }) {
  return (
    <div className="relative min-h-screen overflow-x-clip">
      <div className="relative mx-auto w-full max-w-270 px-6 pt-28 pb-32 sm:pt-32">
        <Toc items={post.toc} />
        <main className="mx-auto max-w-160">
          <article className="typeset typeset-article">
            <header className="mb-10">
              <h1 style={{ marginBlockStart: 0 }}>
                {post.frontmatter.title}
              </h1>
              <time
                dateTime={post.frontmatter.date}
                className="text-muted-foreground text-sm"
              >
                {formatDate(post.frontmatter.date)}
              </time>
            </header>
            <MDXContent source={post.content} />
          </article>
        </main>
      </div>
    </div>
  )
}
