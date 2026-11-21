"use client"

import { TOC_VARIANTS } from "./registry"
import { useTocVariant } from "./store"
import { TocSwitcher } from "./switcher"
import type { TocVariantProps } from "./types"

// The article's contents, as whichever variant is picked in the switcher.
// Nothing renders until the client has read the pick, so the server HTML and
// the first client render agree.
export function Toc(props: TocVariantProps) {
  const id = useTocVariant()
  if (id === null) return null
  const variant = TOC_VARIANTS.find((v) => v.id === id) ?? TOC_VARIANTS[0]
  return (
    <>
      <variant.Component key={variant.id} {...props} />
      <TocSwitcher activeId={variant.id} />
    </>
  )
}
