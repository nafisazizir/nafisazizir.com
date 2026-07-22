import { ImageResponse } from "next/og"

import { OgCard, type OgCardProps } from "@/components/og/og-card"
import { loadOgFonts, loadOgLogo, ogSize, pickOgBackground } from "@/lib/og"

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
