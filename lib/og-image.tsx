import { ImageResponse } from "next/og"

import { OgCard, type OgCardProps } from "@/components/og/og-card"
import {
  loadOgCover,
  loadOgFonts,
  loadOgLogo,
  ogSize,
  pickOgBackground,
} from "@/lib/og"

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

/**
 * A post cover flattened onto pure black. Most covers are transparent PNGs, so
 * serving them raw leaves the art invisible on light-background embeds.
 * Returns null when the cover can't be read, so callers can fall back to the card.
 */
export async function ogCoverResponse(cover: string) {
  const image = await loadOgCover(cover)
  if (!image) return null
  return new ImageResponse(
    (
      <div
        style={{
          display: "flex",
          width: ogSize.width,
          height: ogSize.height,
          backgroundColor: "#000000",
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={image}
          alt=""
          width={ogSize.width}
          height={ogSize.height}
          style={{ objectFit: "cover" }}
        />
      </div>
    ),
    ogSize
  )
}
