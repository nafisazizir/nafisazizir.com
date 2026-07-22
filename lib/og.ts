import { readFile } from "node:fs/promises"
import path from "node:path"

export const ogSize = { width: 1200, height: 630 }

const variants = ["cobalt", "filament", "horizon", "solar", "violet"] as const

export async function pickOgBackground(seed: string): Promise<string> {
  let hash = 0
  for (let i = 0; i < seed.length; i++) {
    hash = (hash * 31 + seed.charCodeAt(i)) | 0
  }
  const variant = variants[Math.abs(hash) % variants.length]
  const file = await readFile(
    path.join(process.cwd(), "public", "opengraph", `${variant}.jpg`)
  )
  return `data:image/jpeg;base64,${file.toString("base64")}`
}

export async function loadOgLogo(): Promise<string> {
  const file = await readFile(path.join(process.cwd(), "public", "logo.svg"))
  return `data:image/svg+xml;base64,${file.toString("base64")}`
}

export async function loadOgFonts() {
  const [regular, medium] = await Promise.all([
    readFile(path.join(process.cwd(), "assets", "fonts", "inter-400.ttf")),
    readFile(path.join(process.cwd(), "assets", "fonts", "inter-500.ttf")),
  ])
  return [
    { name: "Inter", data: regular, weight: 400, style: "normal" },
    { name: "Inter", data: medium, weight: 500, style: "normal" },
  ] as const
}
