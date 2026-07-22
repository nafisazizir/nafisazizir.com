import { getPostBySlug } from "@/lib/content"
import { ogSize } from "@/lib/og"
import { ogImageResponse } from "@/lib/og-image"
import { site } from "@/lib/site"

export const alt = `Project · ${site.name}`
export const size = ogSize
export const contentType = "image/png"

export default async function Image({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const post = getPostBySlug(slug)
  return ogImageResponse({
    seed: slug,
    variant: "post",
    eyebrow: "projects/",
    title: post?.frontmatter.title ?? site.name,
  })
}
