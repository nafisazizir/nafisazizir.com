import { Fragment, isValidElement, type ReactNode } from "react"

import type { PatternProps } from "@/components/patterns/frame"

type Pattern = (props: PatternProps) => ReactNode

/** Literal colours for the three tokens a pattern draws with. */
export interface PatternInk {
  /** The panel behind the art (`bg-gray-100` on the site). */
  panel: string
  /** `currentColor`: edges, guides, dots. */
  line: string
  /** `var(--ds-background-100)`: the cut-out. */
  cutout: string
  /** `var(--ds-gray-300)`: the one shadow face. */
  tone: string
}

// The site is dark-only, so these are the dark values of the ziiz ramp.
export const darkInk: PatternInk = {
  panel: "#1a1a1a",
  line: "#ffffff",
  cutout: "#000000",
  tone: "#292929",
}

const FRAME = { width: 384, height: 120 }

const attrNames: Record<string, string> = {
  strokeDasharray: "stroke-dasharray",
  strokeWidth: "stroke-width",
  fillRule: "fill-rule",
}

function paint(value: string, ink: PatternInk) {
  return value
    .replace("currentColor", ink.line)
    .replace("var(--ds-background-100)", ink.cutout)
    .replace("var(--ds-gray-300)", ink.tone)
}

// Walks the element tree a pattern returns, calling components (the pattern,
// then PatternFrame) until only SVG elements are left. Patterns are server
// components of literal shapes, so there are no hooks to honour.
function serialize(node: ReactNode, ink: PatternInk): string {
  if (node == null || typeof node === "boolean") return ""
  if (Array.isArray(node)) return node.map((n) => serialize(n, ink)).join("")
  if (!isValidElement<Record<string, unknown>>(node)) return ""

  const { type, props } = node
  if (type === Fragment) return serialize(props.children as ReactNode, ink)
  if (typeof type === "function") {
    return serialize((type as Pattern)(props as PatternProps), ink)
  }
  if (typeof type !== "string") return ""

  let attrs = ""
  for (const [key, value] of Object.entries(props)) {
    if (key === "children" || key === "className" || value == null) continue
    const name = attrNames[key] ?? key
    attrs += ` ${name}="${paint(String(value), ink)}"`
  }
  return `<${type}${attrs}>${serialize(props.children as ReactNode, ink)}</${type}>`
}

/**
 * A pattern as a standalone SVG of `width` by `height`, placed the way
 * PatternStage places it: the frame takes 90% of the width, capped at half
 * the height, centred or pinned to the top under a 5% margin. The viewBox is
 * widened to the whole container so lines that leave the frame reach its
 * edges, and the stroke is scaled down to stay `stroke` pixels wide.
 * For satori and other renderers that cannot resolve CSS variables.
 */
export function patternSvg(
  pattern: Pattern,
  {
    width,
    height,
    anchor = "center",
    ink = darkInk,
    stroke = 1,
  }: {
    width: number
    height: number
    anchor?: "center" | "top"
    ink?: PatternInk
    stroke?: number
  }
) {
  const frameWidth = Math.min(0.9 * width, 1.6 * height)
  const scale = frameWidth / FRAME.width
  const left = (width - frameWidth) / 2
  const top =
    anchor === "top"
      ? 0.05 * width
      : (height - (frameWidth * FRAME.height) / FRAME.width) / 2

  const box = [-left / scale, -top / scale, width / scale, height / scale]
  // The pattern's own <svg> nests inside, so its viewBox and overflow apply
  // to the frame; the outer one clips at the container.
  const art = serialize(pattern({ width: 384, height: 120 }), ink)

  return (
    `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="${box.join(" ")}" stroke-width="${stroke / scale}">` +
    `<rect x="${box[0]}" y="${box[1]}" width="${box[2]}" height="${box[3]}" fill="${ink.panel}"/>` +
    art +
    `</svg>`
  )
}

export function patternDataUri(...args: Parameters<typeof patternSvg>) {
  return `data:image/svg+xml;base64,${Buffer.from(patternSvg(...args)).toString("base64")}`
}
