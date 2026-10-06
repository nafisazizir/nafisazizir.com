import { cacheLife } from "next/cache"

import { getAllPosts } from "@/lib/content"
import { site } from "@/lib/site"

function escapeXml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;")
}

// Cached for good: posts only change with a deploy.
async function getFeed() {
  "use cache"
  cacheLife("max")

  const items = getAllPosts()
    .map((post) => {
      const { title, description, date, type } = post.frontmatter
      const url = `${site.url}/${type === "blog" ? "blogs" : "projects"}/${post.slug}`
      return `    <item>
      <title>${escapeXml(title)}</title>
      <link>${url}</link>
      <guid isPermaLink="true">${url}</guid>
      <pubDate>${new Date(date).toUTCString()}</pubDate>${
        description
          ? `\n      <description>${escapeXml(description)}</description>`
          : ""
      }
    </item>`
    })
    .join("\n")

  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${escapeXml(site.name)}</title>
    <link>${site.url}</link>
    <description>${escapeXml(site.description)}</description>
    <language>en</language>
    <atom:link href="${site.url}/feed.xml" rel="self" type="application/rss+xml"/>
${items}
  </channel>
</rss>
`
}

export async function GET() {
  return new Response(await getFeed(), {
    headers: { "Content-Type": "application/rss+xml; charset=utf-8" },
  })
}
