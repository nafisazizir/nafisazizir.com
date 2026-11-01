"use client"

import { useEffect, useRef } from "react"
import Link from "next/link"

import { EdgeFade } from "@/components/edge-fade"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"

import type { StreakParams } from "./presets"
import { RECREATIONS } from "./recreations"
import type { StreakRenderer } from "./renderer"
import { useStreakRenderer } from "./use-streak-renderer"

const img = (file: string) => `/labs/streaks/references/img/${file}`

/**
 * Every reference group: the primary pick on the left, the shader's attempt
 * at it on the right, both at the reference's aspect. One renderer for the
 * whole board (browsers cap live WebGL contexts), and each canvas draws only
 * once it scrolls near the viewport.
 */
export function ReferenceBoard() {
  const { renderer } = useStreakRenderer()
  const mean =
    RECREATIONS.reduce((s, r) => s + r.fidelity, 0) /
    Math.max(1, RECREATIONS.length)

  return (
    <div className="relative min-h-screen overflow-x-clip">
      <EdgeFade side="top" />
      <main className="mx-auto flex w-full max-w-327.5 flex-col gap-10 px-5 pt-20 pb-32 md:px-6 lg:pt-24">
        <header className="flex flex-col gap-4">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink render={<Link href="/labs" />}>
                  Labs
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink render={<Link href="/labs/streaks" />}>
                  Streaks
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>References</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
          <h1 className="text-heading-40 text-balance text-gray-1000 sm:text-heading-48">
            References
            <span className="block text-gray-900">
              {RECREATIONS.length} picks, recreated in the shader · mean
              fidelity {mean.toFixed(1)} / 5
            </span>
          </h1>
        </header>
        <ol className="flex flex-col gap-16">
          {RECREATIONS.map((r) => (
            <li key={r.id} className="flex flex-col gap-3">
              <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                <h2 className="text-heading-24 text-gray-1000">{r.name}</h2>
                <span className="text-label-13-mono text-gray-900 tabular-nums">
                  {r.id} · fidelity {r.fidelity}/5
                </span>
              </div>
              <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
                <figure className="flex flex-col gap-2">
                  {/* eslint-disable-next-line @next/next/no-img-element -- dev-only local file, no optimisation wanted */}
                  <img
                    src={img(r.ref)}
                    alt=""
                    loading="lazy"
                    className="block w-full rounded-md bg-gray-100 object-cover"
                    style={{ aspectRatio: r.aspect }}
                  />
                  <figcaption className="text-label-12 text-gray-900">
                    Reference
                  </figcaption>
                </figure>
                <figure className="flex flex-col gap-2">
                  <Recreation
                    renderer={renderer}
                    params={r.params}
                    aspect={r.aspect}
                  />
                  <figcaption className="text-label-12 text-gray-900">
                    Recreation
                  </figcaption>
                </figure>
              </div>
              {r.gaps ? (
                <p className="max-w-[75ch] text-copy-14 text-gray-900">
                  {r.gaps}
                </p>
              ) : null}
              {r.variants.length ? (
                <div className="flex flex-wrap gap-2">
                  {r.variants.map((v) => (
                    // eslint-disable-next-line @next/next/no-img-element -- as above
                    <img
                      key={v}
                      src={img(v)}
                      alt=""
                      title={v}
                      loading="lazy"
                      className="h-16 w-auto rounded-sm bg-gray-100"
                    />
                  ))}
                </div>
              ) : null}
            </li>
          ))}
        </ol>
      </main>
      <EdgeFade side="bottom" />
    </div>
  )
}

function Recreation({
  renderer,
  params,
  aspect,
}: {
  renderer: StreakRenderer | null
  params: StreakParams
  aspect: number
}) {
  const canvas = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const el = canvas.current
    if (!el || !renderer) return
    const draw = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      const w = Math.max(1, Math.round(el.getBoundingClientRect().width * dpr))
      const h = Math.max(1, Math.round(w / aspect))
      if (el.width === w && el.height === h) return
      el.width = w
      el.height = h
      renderer.render(el.getContext("2d")!, w, h, params, { samples: 40 })
    }
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return
        draw()
        io.disconnect()
      },
      { rootMargin: "400px" }
    )
    io.observe(el)
    return () => io.disconnect()
  }, [renderer, params, aspect])

  return (
    <canvas
      ref={canvas}
      aria-hidden
      className="block h-auto w-full rounded-md bg-gray-100"
      style={{ aspectRatio: aspect }}
    />
  )
}
