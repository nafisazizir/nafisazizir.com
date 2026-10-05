import { ImageResponse } from "next/og"

import { OgCard, type OgCardProps } from "@/components/og/og-card"
import type { Post } from "@/lib/content"
import { loadOgFonts, loadOgLogo, ogSize, pickOgBackground } from "@/lib/og"
import { patternFor } from "@/lib/post-art"
import { darkInk, patternDataUri } from "@/lib/pattern-svg"

type OgImageOptions = Omit<OgCardProps, "background" | "logo"> & {
  seed: string
}

export async function ogImageResponse({ seed, ...card }: OgImageOptions) {
  const [background, logo, fonts] = await Promise.all([
    pickOgBackground(seed),
    loadOgLogo(),
    loadOgFonts(),
  ])
  return new ImageResponse(
    <OgCard background={background} logo={logo} {...card} />,
    { ...ogSize, fonts: [...fonts] }
  )
}

// The card a list shows, at 1200x630: the post's pattern with its title set
// inside it, bottom left, under the same 5% margin the pattern hangs from.
// The pattern is drawn to a standalone SVG because satori can't read the CSS
// variables the on-page one uses.
export async function ogPostResponse(post: Post) {
  const fonts = await loadOgFonts()
  const art = patternDataUri(patternFor(post).Component, {
    ...ogSize,
    anchor: "top",
    stroke: 1.5,
  })

  return new ImageResponse(
    <div
      style={{
        position: "relative",
        display: "flex",
        width: ogSize.width,
        height: ogSize.height,
        backgroundColor: darkInk.panel,
        color: "#ffffff",
        fontFamily: "Inter",
      }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={art}
        alt=""
        width={ogSize.width}
        height={ogSize.height}
        style={{ position: "absolute", top: 0, left: 0 }}
      />
      <div
        style={{
          position: "absolute",
          left: 60,
          right: 60,
          bottom: 60,
          display: "flex",
          fontSize: 56,
          fontWeight: 500,
          letterSpacing: "-0.04em",
          lineHeight: 1.1,
        }}
      >
        {post.frontmatter.title}
      </div>
    </div>,
    { ...ogSize, fonts: [...fonts] }
  )
}
