import { ImageResponse } from "next/og"

import { site } from "@/lib/site"

export const alt = site.name
export const size = { width: 1200, height: 630 }
export const contentType = "image/png"

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-end",
          padding: 80,
          background: "#000000",
          color: "#ffffff",
        }}
      >
        <div style={{ fontSize: 88, letterSpacing: "-0.04em" }}>
          {site.name}
        </div>
        <div
          style={{
            marginTop: 24,
            maxWidth: 800,
            fontSize: 34,
            lineHeight: 1.35,
            letterSpacing: "-0.02em",
            color: "rgba(255, 255, 255, 0.65)",
          }}
        >
          {site.description}
        </div>
      </div>
    ),
    { ...size }
  )
}
