/* eslint-disable @next/next/no-img-element */

export interface OgCardProps {
  background: string
  logo: string
  title: string
  variant?: "page" | "post"
  eyebrow?: string
}

const type = {
  page: { fontSize: 120, letterSpacing: "-0.03em", lineHeight: 1.02 },
  post: { fontSize: 76, letterSpacing: "-0.05em", lineHeight: 1.1 },
}

export function OgCard({
  background,
  logo,
  title,
  variant = "page",
  eyebrow,
}: OgCardProps) {
  return (
    <div
      style={{
        position: "relative",
        width: 1200,
        height: 630,
        display: "flex",
        overflow: "hidden",
        backgroundColor: "#000000",
        color: "#ffffff",
        fontFamily: "Inter",
      }}
    >
      <img
        src={background}
        alt=""
        width={1200}
        height={630}
        style={{ position: "absolute", top: 0, left: 0 }}
      />
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: 1200,
          height: 630,
          background:
            "linear-gradient(to top, rgba(0,0,0,0.72) 0%, rgba(0,0,0,0.25) 45%, rgba(0,0,0,0) 72%)",
        }}
      />
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: 1200,
          height: 630,
          background:
            "linear-gradient(to bottom, rgba(0,0,0,0.35) 0%, rgba(0,0,0,0) 22%)",
        }}
      />
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: 1200,
          height: 630,
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: 64,
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
          }}
        >
          <img src={logo} alt="" width={64} height={64} />
          <div
            style={{
              display: "flex",
              fontSize: 32,
              fontWeight: 500,
              letterSpacing: "-0.03em",
            }}
          >
            nafisazizir.com
          </div>
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          {eyebrow ? (
            <div
              style={{
                display: "flex",
                fontSize: 56,
                fontWeight: 400,
                letterSpacing: "-0.05em",
                color: "rgba(255,255,255,0.3)",
                marginBottom: 16,
              }}
            >
              {eyebrow}
            </div>
          ) : null}
          <div
            style={{
              display: "flex",
              maxWidth: 1000,
              fontWeight: 400,
              ...type[variant],
            }}
          >
            {title}
          </div>
        </div>
      </div>
    </div>
  )
}
