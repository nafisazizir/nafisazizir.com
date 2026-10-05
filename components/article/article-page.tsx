import { ArticleAnalytics } from "@/components/analytics/article-analytics"
import { ArticleHeader } from "@/components/article/article-header"
import { MDXContent } from "@/components/article/mdx-content"
import { Toc } from "@/components/article/toc"
import { ContactFooter } from "@/components/contact-footer"
import { EdgeFade } from "@/components/edge-fade"
import { PatternStage } from "@/components/patterns"
import type { Post, PostType } from "@/lib/content"
import { site } from "@/lib/site"
import { formatDate } from "@/lib/format"
import { patternFor } from "@/lib/post-art"

const SECTIONS: Record<PostType, { href: string; label: string }> = {
  blog: { href: "/blogs", label: "Blogs" },
  project: { href: "/projects", label: "Projects" },
}

function articleJsonLd(post: Post) {
  const { title, description, date, type } = post.frontmatter
  const url = `${site.url}/${type === "blog" ? "blogs" : "projects"}/${post.slug}`
  // The OG route: the post's pattern with its title, as the list shows it.
  const image = `${url}/opengraph-image`
  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: title,
    description,
    datePublished: date,
    url,
    mainEntityOfPage: url,
    image,
    author: {
      "@type": "Person",
      name: site.name,
      url: site.url,
    },
  }
}

// The page takes its frame from the ziiz X clone's post: a 1120px column (the
// cap is 1168px less the 24px gutters), the header across all of it, then the
// 720px prose column centred under the rule with the contents beside it. The
// top and bottom of the viewport are frosted rather than cut.
export function ArticlePage({ post }: { post: Post }) {
  const { title, date, type } = post.frontmatter

  return (
    <div className="relative min-h-screen overflow-x-clip">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(articleJsonLd(post)),
        }}
      />
      <ArticleAnalytics slug={post.slug} kind={type} />
      <EdgeFade side="top" />
      <main className="mx-auto w-full max-w-292 px-5 pt-20 pb-32 md:px-6 lg:pt-24">
        <article className="flex flex-col">
          <ArticleHeader
            title={title}
            date={date}
            displayDate={formatDate(date)}
            section={SECTIONS[type]}
            art={
              <PatternStage
                pattern={patternFor(post).Component}
                className="size-full"
              />
            }
          />
          <div className="relative">
            <Toc items={post.toc} />
            <div className="typeset mx-auto w-full max-w-180 pt-12">
              <MDXContent source={post.content} />
            </div>
          </div>
        </article>
        <ContactFooter className="mt-24" />
      </main>
      <EdgeFade side="bottom" />
    </div>
  )
}
