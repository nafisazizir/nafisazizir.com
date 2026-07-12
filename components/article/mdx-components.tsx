import type { MDXComponents } from "mdx/types"
import Link from "next/link"
import type { ComponentPropsWithoutRef } from "react"

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

export const mdxComponents: MDXComponents = {
  a: Anchor,
}
