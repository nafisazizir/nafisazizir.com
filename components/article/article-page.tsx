import { MDXContent } from "@/components/article/mdx-content"
import { Toc } from "@/components/article/toc"
import { Nav } from "@/components/nav"
import type { Post } from "@/lib/content"

export function ArticlePage({ post }: { post: Post }) {
  return (
    <div className="relative min-h-screen overflow-x-clip">
      <Nav />
      <div className="relative mx-auto w-full max-w-270 px-6 pt-28 pb-32 sm:pt-32">
        <Toc items={post.toc} />
        <main className="mx-auto max-w-160">
          <article className="typeset typeset-article">
            <MDXContent source={post.content} />
          </article>
        </main>
      </div>
    </div>
  )
}
