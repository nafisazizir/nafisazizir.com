import { getPostBySlug, getPostsByType } from "@/lib/content"
import { ogSize } from "@/lib/og"
import { ogImageResponse, ogPostResponse } from "@/lib/og-image"
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
  // The card the list shows; the shader card only for a slug that's gone.
  if (post) return ogPostResponse(post)
  return ogImageResponse({
    seed: slug,
    variant: "post",
    eyebrow: "blog/",
    title: site.name,
  })
}
