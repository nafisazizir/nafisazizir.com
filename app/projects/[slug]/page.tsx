import type { Metadata } from "next"
import { notFound } from "next/navigation"

import { ArticlePage } from "@/components/article/article-page"
import { getPostBySlug, getPostsByType } from "@/lib/content"

export function generateStaticParams() {
  return getPostsByType("project").map((p) => ({ slug: p.slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const post = getPostBySlug(slug)
  if (!post || post.frontmatter.type !== "project") return {}
  const { title, description, cover, date, tags } = post.frontmatter
  return {
    title,
    description,
    openGraph: {
      type: "article",
      title,
      description,
      publishedTime: date,
      tags,
      images: cover ? [{ url: cover }] : undefined,
    },
  }
}

export default async function ProjectPost({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const post = getPostBySlug(slug)
  if (!post || post.frontmatter.type !== "project") notFound()

  return <ArticlePage post={post} />
}
