import fs from "node:fs"
import path from "node:path"

import GithubSlugger from "github-slugger"
import matter from "gray-matter"

const CONTENT_DIR = path.join(process.cwd(), "content")

export type PostType = "blog" | "project"

export interface PostFrontmatter {
  title: string
  description?: string
  date: string
  type: PostType
  tags: string[]
  cover?: string
}

export interface TocItem {
  id: string
  label: string
}

export interface Post {
  slug: string
  frontmatter: PostFrontmatter
  /** Raw MDX body, frontmatter stripped. */
  content: string
  /** Second-level headings, in document order (drives the reading TOC). */
  toc: TocItem[]
}

/** Frontmatter YAML parses bare dates to Date objects; normalize to ISO day. */
function toIsoDay(value: unknown): string {
  if (value instanceof Date) return value.toISOString().slice(0, 10)
  return String(value ?? "")
}

/**
 * Extract `## ` headings and slugify them exactly as rehype-slug does
 * (github-slugger), so TOC anchors line up with the ids rehype-slug writes.
 * Skips fenced code blocks so a `## ` comment inside a snippet isn't picked up.
 */
function extractToc(body: string): TocItem[] {
  const slugger = new GithubSlugger()
  const items: TocItem[] = []
  let inFence = false
  for (const line of body.split("\n")) {
    const fence = line.match(/^\s*(```|~~~)/)
    if (fence) {
      inFence = !inFence
      continue
    }
    if (inFence) continue
    const h2 = line.match(/^##\s+(.+?)\s*$/)
    if (!h2) continue
    const label = h2[1]
      .replace(/`([^`]+)`/g, "$1")
      .replace(/\*\*([^*]+)\*\*/g, "$1")
      .replace(/\*([^*]+)\*/g, "$1")
      .replace(/\[([^\]]+)\]\([^)]*\)/g, "$1")
      .trim()
    items.push({ id: slugger.slug(label), label })
  }
  return items
}

function parseFile(fileName: string): Post {
  const slug = fileName.replace(/\.mdx?$/, "")
  const raw = fs.readFileSync(path.join(CONTENT_DIR, fileName), "utf8")
  const { data, content } = matter(raw)
  const frontmatter: PostFrontmatter = {
    title: String(data.title ?? slug),
    description: data.description ? String(data.description) : undefined,
    date: toIsoDay(data.date),
    type: (data.type === "project" ? "project" : "blog") as PostType,
    tags: Array.isArray(data.tags) ? data.tags.map(String) : [],
    cover: data.cover ? String(data.cover) : undefined,
  }
  return { slug, frontmatter, content, toc: extractToc(content) }
}

let cache: Post[] | null = null

function loadAll(): Post[] {
  // Cache only in production; in dev, re-read so .mdx edits show up without a
  // server restart.
  if (cache && process.env.NODE_ENV === "production") return cache
  const files = fs.readdirSync(CONTENT_DIR).filter((f) => /\.mdx?$/.test(f))
  cache = files
    .map(parseFile)
    .sort((a, b) => b.frontmatter.date.localeCompare(a.frontmatter.date))
  return cache
}

export function getAllPosts(): Post[] {
  return loadAll()
}

export function getPostsByType(type: PostType): Post[] {
  return loadAll().filter((p) => p.frontmatter.type === type)
}

export function getPostBySlug(slug: string): Post | undefined {
  return loadAll().find((p) => p.slug === slug)
}
