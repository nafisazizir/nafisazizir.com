import { ArticleHeader } from "@/components/article/article-header"
import { MDXContent } from "@/components/article/mdx-content"
import { Toc } from "@/components/article/toc"
import { ContactFooter } from "@/components/contact-footer"
import type { Post } from "@/lib/content"
import { site } from "@/lib/site"
import { formatDate } from "@/lib/utils"

function articleJsonLd(post: Post) {
  const { title, description, date, type, cover } = post.frontmatter
  const url = `${site.url}/${type === "blog" ? "blogs" : "projects"}/${post.slug}`
  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: title,
    description,
    datePublished: date,
    url,
    mainEntityOfPage: url,
    image: cover ? `${site.url}${cover}` : undefined,
    author: {
      "@type": "Person",
      name: site.name,
      url: site.url,
    },
  }
}

export function ArticlePage({ post }: { post: Post }) {
  return (
    <div className="relative min-h-screen overflow-x-clip">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(articleJsonLd(post)),
        }}
      />
      <div className="relative mx-auto w-full max-w-270 px-6 pt-28 pb-32 sm:pt-32">
        <Toc items={post.toc} />
        <main className="mx-auto max-w-160">
          <article className="typeset typeset-article">
            <ArticleHeader
              title={post.frontmatter.title}
              date={post.frontmatter.date}
              displayDate={formatDate(post.frontmatter.date)}
            />
            <MDXContent source={post.content} />
          </article>
          <ContactFooter />
        </main>
      </div>
    </div>
  )
}
