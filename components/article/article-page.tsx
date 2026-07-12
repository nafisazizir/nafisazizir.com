import { ArticleHeader } from "@/components/article/article-header"
import { MDXContent } from "@/components/article/mdx-content"
import { Toc } from "@/components/article/toc"
import { Reveal } from "@/components/motion/reveal"
import type { Post } from "@/lib/content"
import { formatDate } from "@/lib/utils"

export function ArticlePage({ post }: { post: Post }) {
  return (
    <div className="relative min-h-screen overflow-x-clip">
      <div className="relative mx-auto w-full max-w-270 px-6 pt-28 pb-32 sm:pt-32">
        <Toc items={post.toc} />
        <main className="mx-auto max-w-160">
          <article className="typeset typeset-article">
            <ArticleHeader
              title={post.frontmatter.title}
              date={post.frontmatter.date}
              displayDate={formatDate(post.frontmatter.date)}
            />
            <Reveal delay={0.16} y={10}>
              <MDXContent source={post.content} />
            </Reveal>
          </article>
        </main>
      </div>
    </div>
  )
}
