import type { Metadata } from "next"

import { ShaderPlayground } from "@/components/playground/shader-playground"

export const metadata: Metadata = {
  title: "Playground",
  description:
    "Live playground for the gradient shader from the home page — tweak, scrub, and export frames.",
}

export default function PlaygroundPage() {
  return <ShaderPlayground />
}
