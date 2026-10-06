import type { Metadata } from "next"

import { ArticlePage } from "@/components/article/article-page"
import { getPostBySlug, getPostsByType } from "@/lib/content"

export function generateStaticParams() {
  return getPostsByType("blog").map((p) => ({ slug: p.slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const post = getPostBySlug(slug)
  if (!post || post.frontmatter.type !== "blog") return {}
  const { title, description, date, tags } = post.frontmatter
  return {
    title,
    description,
    openGraph: {
      type: "article",
      title,
      description,
      publishedTime: date,
      tags,
    },
  }
}

export default function BlogPost({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  return <ArticlePage type="blog" params={params} />
}
