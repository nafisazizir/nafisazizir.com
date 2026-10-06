import { notFound } from "next/navigation"
import { Suspense } from "react"

import { ArticleAnalytics } from "@/components/analytics/article-analytics"
import {
  ArticleHeader,
  ArticleHeadline,
} from "@/components/article/article-header"
import { BODY } from "@/components/article/article-layout"
import {
  ArticleBodySkeleton,
  ArticleHeadlineSkeleton,
} from "@/components/article/article-skeleton"
import { MDXContent } from "@/components/article/mdx-content"
import { Toc } from "@/components/article/toc"
import { ContactFooter } from "@/components/contact-footer"
import { EdgeFade } from "@/components/edge-fade"
import { PatternStage } from "@/components/patterns"
import { getPostBySlug, type Post, type PostType } from "@/lib/content"
import { formatDate } from "@/lib/format"
import { patternFor } from "@/lib/post-art"
import { site } from "@/lib/site"

const SECTIONS: Record<PostType, { href: string; label: string }> = {
  blog: { href: "/blogs", label: "Blogs" },
  project: { href: "/projects", label: "Projects" },
}

type Params = Promise<{ slug: string }>

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

async function getPost(type: PostType, params: Params) {
  const { slug } = await params
  const post = getPostBySlug(slug)
  if (!post || post.frontmatter.type !== type) notFound()
  return post
}

async function Headline({ type, params }: { type: PostType; params: Params }) {
  const post = await getPost(type, params)
  const { title, date } = post.frontmatter

  return (
    <ArticleHeadline
      title={title}
      date={date}
      displayDate={formatDate(date)}
      art={
        <PatternStage
          pattern={patternFor(post).Component}
          className="size-full"
        />
      }
    />
  )
}

async function Body({ type, params }: { type: PostType; params: Params }) {
  const post = await getPost(type, params)

  return (
    <div className="relative">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(articleJsonLd(post)),
        }}
      />
      <ArticleAnalytics slug={post.slug} kind={type} />
      <Toc slug={post.slug} items={post.toc} />
      <div className={BODY}>
        <MDXContent source={post.content} />
      </div>
    </div>
  )
}

// The page takes its frame from the ziiz X clone's post: a 1120px column (the
// cap is 1168px less the 24px gutters), the header across all of it, then the
// 720px prose column centred under the rule with the contents beside it. The
// top and bottom of the viewport are frosted rather than cut.
//
// Everything that doesn't depend on which post this is (the frame, the way
// back, the rule, the footer) is the route's shell, prefetched once for every
// post. The two pieces that need the slug suspend separately, each on a
// skeleton of its own boxes, so a navigation lands on the finished frame and
// only the text and art fill in.
export function ArticlePage({
  type,
  params,
}: {
  type: PostType
  params: Params
}) {
  return (
    <div className="relative min-h-screen overflow-x-clip">
      <EdgeFade side="top" />
      <main className="mx-auto w-full max-w-292 px-5 pt-20 pb-32 md:px-6 lg:pt-24">
        <article className="flex flex-col">
          <ArticleHeader section={SECTIONS[type]}>
            <Suspense fallback={<ArticleHeadlineSkeleton />}>
              <Headline type={type} params={params} />
            </Suspense>
          </ArticleHeader>
          <Suspense fallback={<ArticleBodySkeleton />}>
            <Body type={type} params={params} />
          </Suspense>
        </article>
        <ContactFooter className="mt-24" />
      </main>
      <EdgeFade side="bottom" />
    </div>
  )
}
