import type { MDXComponents } from "mdx/types"
import Link from "next/link"
import type { ComponentPropsWithoutRef } from "react"

import { TweetEmbed } from "@/components/article/tweet-embed"
import { CodeBlock } from "@/components/docs/code-block"
import { revealBlocks } from "@/components/motion/reveal-block"

/*
 *  - External (http/protocol-relative) → open in a new tab.
 *  - Internal route (absolute path, no file extension) → next/link, for
 *    client-side navigation + prefetch.
 *  - Static file assets (/foo.pdf), hash anchors (#x), mailto:/tel: → plain
 */
function Anchor({ href = "", ...props }: ComponentPropsWithoutRef<"a">) {
  if (/^(https?:)?\/\//.test(href)) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" {...props} />
    )
  }
  const path = href.split(/[?#]/)[0]
  const isInternalRoute = href.startsWith("/") && !/\.[a-z0-9]+$/i.test(path)
  if (isInternalRoute) {
    return <Link href={href} {...props} />
  }
  return <a href={href} {...props} />
}

// Behavior only. Typography is the prose layer's job (@nafisazizir/ziiz's
// typeset), so nothing here sets a type role on a markdown element.

// The ziiz code block: the chrome (copy button, optional title) around the
// pre that rehype-shiki emits. The prose layer sizes and colors the pre.
function Pre(props: ComponentPropsWithoutRef<"pre">) {
  return (
    <CodeBlock>
      <pre
        {...props}
        role="region"
        tabIndex={0}
        aria-label={props["aria-label"] ?? "Scrollable code block"}
      />
    </CodeBlock>
  )
}

// A wide table scrolls inside the prose column instead of breaking it.
function Table(props: ComponentPropsWithoutRef<"table">) {
  return (
    <div
      className="typeset-scroll"
      role="region"
      tabIndex={0}
      aria-label="Scrollable table"
    >
      <table {...props} />
    </div>
  )
}

export const mdxComponents: MDXComponents = {
  ...revealBlocks,
  a: Anchor,
  pre: Pre,
  table: Table,
  Tweet: TweetEmbed,
}
