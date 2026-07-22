import { ogSize } from "@/lib/og"
import { ogImageResponse } from "@/lib/og-image"
import { site } from "@/lib/site"

export const alt = `About · ${site.name}`
export const size = ogSize
export const contentType = "image/png"

export default function Image() {
  return ogImageResponse({ seed: "about", title: "About" })
}
