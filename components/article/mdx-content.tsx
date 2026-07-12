import rehypeShiki from "@shikijs/rehype"
import { MDXRemote } from "next-mdx-remote/rsc"
import rehypeSlug from "rehype-slug"
import remarkGfm from "remark-gfm"

import { mdxComponents } from "@/components/article/mdx-components"

export function MDXContent({ source }: { source: string }) {
  return (
    <MDXRemote
      source={source}
      components={mdxComponents}
      options={{
        mdxOptions: {
          remarkPlugins: [remarkGfm],
          rehypePlugins: [
            rehypeSlug,
            [
              rehypeShiki,
              {
                themes: { light: "github-light", dark: "github-dark" },
                defaultColor: false,
              },
            ],
          ],
        },
      }}
    />
  )
}
