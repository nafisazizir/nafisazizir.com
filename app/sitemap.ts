import type { MetadataRoute } from "next"

import { getAllPosts } from "@/lib/content"
import { labs } from "@/lib/labs"
import { site } from "@/lib/site"

export default function sitemap(): MetadataRoute.Sitemap {
  const posts = getAllPosts()
  const latest = posts[0]?.frontmatter.date

  const pages: MetadataRoute.Sitemap = [
    { url: site.url, lastModified: latest },
    { url: `${site.url}/about` },
    { url: `${site.url}/blogs`, lastModified: latest },
    { url: `${site.url}/projects`, lastModified: latest },
    { url: `${site.url}/labs`, lastModified: labs[0]?.date },
    ...labs.map((l) => ({
      url: `${site.url}/labs/${l.slug}`,
      lastModified: l.date,
    })),
  ]

  const articles: MetadataRoute.Sitemap = posts.map((p) => ({
    url: `${site.url}/${p.frontmatter.type === "blog" ? "blogs" : "projects"}/${p.slug}`,
    lastModified: p.frontmatter.date,
  }))

  return [...pages, ...articles]
}
