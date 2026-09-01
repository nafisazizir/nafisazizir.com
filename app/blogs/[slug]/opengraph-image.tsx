import { coverStill, getPostBySlug, getPostsByType } from "@/lib/content"
import { ogSize } from "@/lib/og"
import { ogCoverResponse, ogImageResponse } from "@/lib/og-image"
import { site } from "@/lib/site"

export const alt = `Blog · ${site.name}`
export const size = ogSize
export const contentType = "image/png"

export function generateStaticParams() {
  return getPostsByType("blog").map((p) => ({ slug: p.slug }))
}

export default async function Image({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const post = getPostBySlug(slug)
  // A video cover can't be an OG image; coverStill falls back to its poster frame.
  const cover = post ? coverStill(post.frontmatter) : undefined
  if (cover) {
    const image = await ogCoverResponse(cover)
    if (image) return image
  }
  return ogImageResponse({
    seed: slug,
    variant: "post",
    eyebrow: "blog/",
    title: post?.frontmatter.title ?? site.name,
  })
}
