import { ziizShikiOptions } from "@nafisazizir/ziiz/shiki"
import rehypeShiki from "@shikijs/rehype"
import { cacheLife } from "next/cache"
import { MDXRemote } from "next-mdx-remote/rsc"
import rehypeSlug from "rehype-slug"
import remarkGfm from "remark-gfm"

import { mdxComponents } from "@/components/article/mdx-components"

// Keyed on the source, so an edited post recompiles in dev; in production it
// only changes with a deploy.
export async function MDXContent({ source }: { source: string }) {
  "use cache"
  cacheLife("max")

  return (
    <MDXRemote
      source={source}
      components={mdxComponents}
      options={{
        mdxOptions: {
          remarkPlugins: [remarkGfm],
          rehypePlugins: [
            rehypeSlug,
            // The ziiz Shiki theme resolves every token to the ramp's CSS
            // variables, so highlighted code follows the page theme with no
            // light/dark class dance.
            [rehypeShiki, ziizShikiOptions],
          ],
        },
      }}
    />
  )
}
