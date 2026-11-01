"use client"

import {
  Fragment,
  useCallback,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react"
import Link from "next/link"
import {
  IconDice5,
  IconDownload,
  IconPlayerPause,
  IconPlayerPlay,
  IconRotate,
} from "@tabler/icons-react"

import { useIsMobile } from "@/hooks/use-mobile"
import { EdgeFade } from "@/components/edge-fade"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Button } from "@/components/ui/button"
import { Field, FieldLabel, FieldLegend, FieldSet } from "@/components/ui/field"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Slider } from "@/components/ui/slider"
import { Toggle } from "@/components/ui/toggle"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { cn } from "@/lib/utils"

import {
  ASPECTS,
  STREAK_PARAM_GROUPS,
  STREAK_PRESETS,
  type Aspect,
  type NumericParam,
  type ParamSpec,
  type StreakParams,
  type Stops,
} from "./presets"
import { ColorPicker } from "./color-picker"
import { RECREATIONS } from "./recreations"
import type { StreakRenderer } from "./renderer"
import { useStreakRenderer } from "./use-streak-renderer"

// Sample counts per job. Interaction draws a fast half-resolution frame first
// and the full frame once the controls have been still for IDLE ms.
const SAMPLES = { draft: 20, preview: 40, thumb: 28, export: 56 }
const IDLE = 140
// Exports are 4K on the long edge, whichever way the aspect runs.
const EXPORT_EDGE = 3840

// The references are a local, git-ignored library of someone else's art, so
// only dev can show them. The clones are our own params and ship.
const SHOW_REFERENCES = process.env.NODE_ENV !== "production"
const refImg = (file: string) => `/labs/streaks/references/img/${file}`

// What the controls start from: a clone of a reference pick, or one of the
// hand-tuned presets. Reset goes back to it.
type Source = { kind: "preset" | "recreation"; index: number }
const FIRST: Source = { kind: "recreation", index: 0 }

const fromSource = ({ kind, index }: Source): StreakParams => {
  if (kind === "recreation") return structuredClone(RECREATIONS[index].params)
  // The name is the preset's, not the params'.
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { name, ...params } = STREAK_PRESETS[index]
  return structuredClone(params)
}

const sourceName = ({ kind, index }: Source) =>
  kind === "recreation" ? RECREATIONS[index].name : STREAK_PRESETS[index].name

// The colours outside the palette, shown at the top of their group.
const GROUP_COLORS: Record<
  string,
  {
    key: "accent" | "accent2" | "heroColor" | "detailColor"
    label: string
  }[]
> = {
  Accent: [{ key: "accent", label: "Colour" }],
  "Accent 2": [{ key: "accent2", label: "Colour" }],
  Strikes: [{ key: "heroColor", label: "Hero colour" }],
  Dabs: [{ key: "detailColor", label: "Tint colour" }],
}

const decimals = (step: number) =>
  step >= 1 ? 0 : step >= 0.01 ? 2 : String(step).split(".")[1].length

/**
 * The streak playground, laid out like a slide editor over the whole
 * viewport: the clones and presets as a filmstrip on the left, the live
 * preview as the slide in the middle with a floating toolbar, the references
 * the selected clone was built from in a strip under it (dev only), and every
 * control the shader takes in a scrolling panel on the right. Export is in
 * the toolbar.
 * One renderer (one GL context) draws all of it.
 */
export function StreakStudio({ title }: { title: string }) {
  const { renderer, supported } = useStreakRenderer()
  const [source, setSource] = useState<Source>(FIRST)
  const [params, setParams] = useState<StreakParams>(() => fromSource(FIRST))
  // The aspect is the frame's, not the look's: picking one leaves it be.
  const [aspect, setAspect] = useState<Aspect>("16:9")
  const [playing, setPlaying] = useState(false)
  const [busy, setBusy] = useState(false)
  // The reference pinned over the preview, picked from the strip below it.
  const [original, setOriginal] = useState<string | null>(null)
  const recreation =
    source.kind === "recreation" ? RECREATIONS[source.index] : null

  const set = useCallback(
    <K extends keyof StreakParams>(key: K, value: StreakParams[K]) =>
      setParams((p) => ({ ...p, [key]: value })),
    []
  )

  const choose = (next: Source) => {
    setSource(next)
    setParams(fromSource(next))
    setOriginal(null)
  }

  const exportPng = async () => {
    if (!renderer) return
    setBusy(true)
    // Let the button's busy state paint before the GPU work blocks the thread.
    await new Promise((r) => setTimeout(r, 30))
    const r = ASPECTS[aspect]
    const w = r >= 1 ? EXPORT_EDGE : Math.round(EXPORT_EDGE * r)
    const h = r >= 1 ? Math.round(EXPORT_EDGE / r) : EXPORT_EDGE
    const out = document.createElement("canvas")
    out.width = w
    out.height = h
    renderer.render(out.getContext("2d")!, w, h, params, {
      samples: SAMPLES.export,
    })
    out.toBlob((blob) => {
      setBusy(false)
      if (!blob) return
      const name = sourceName(source).toLowerCase().replace(/\s+/g, "-")
      const a = document.createElement("a")
      a.href = URL.createObjectURL(blob)
      a.download = `streak-${name}-${params.seed}-${w}x${h}.png`
      a.click()
      setTimeout(() => URL.revokeObjectURL(a.href), 2000)
    }, "image/png")
  }

  return (
    <div className="flex min-h-svh flex-col md:h-svh md:flex-row md:overflow-hidden">
      <section
        aria-label="Clones and presets"
        className="order-2 flex flex-col md:order-none md:w-72 md:shrink-0 md:border-e md:border-gray-alpha-400"
      >
        <header className="flex h-(--nav-band) shrink-0 items-center px-5 md:px-4">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink render={<Link href="/labs" />}>
                  Labs
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <h1>
                  <BreadcrumbPage>{title}</BreadcrumbPage>
                </h1>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </header>
        <Panel>
          <PresetRail
            renderer={renderer}
            aspect={aspect}
            selected={source}
            onSelect={choose}
          />
        </Panel>
      </section>

      <main className="order-1 flex flex-col md:order-none md:min-w-0 md:flex-1">
        <div className="relative flex h-[60svh] shrink-0 flex-col md:h-auto md:min-h-0 md:flex-1">
          {/* Clear of the nav above and the toolbar below; the slide takes the
            largest box of its aspect that fits what's left. The stage needs a
            definite height for that, hence h-[60svh] rather than a min. */}
          <div className="[container-type:size] grid flex-1 place-items-center px-5 pt-(--nav-band) pb-20 md:px-8">
            <Preview
              renderer={renderer}
              supported={supported}
              params={params}
              aspect={aspect}
              playing={playing}
              original={original ? refImg(original) : undefined}
            />
          </div>

          <div className="absolute inset-x-0 bottom-5 z-30 mx-auto flex w-fit items-center gap-1 material-menu rounded-full p-1">
            <Select
              size="sm"
              variant="ghost"
              shape="rounded"
              value={aspect}
              onValueChange={(v) => v && setAspect(v)}
            >
              {/* Ghost fields don't step on hover; the toolbar's toggles do. */}
              <SelectTrigger
                aria-label="Aspect ratio"
                className="hover:bg-gray-alpha-100 data-popup-open:bg-gray-alpha-200"
              >
                <SelectValue>
                  {(v: Aspect) => <AspectLabel aspect={v} />}
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                {(Object.keys(ASPECTS) as Aspect[]).map((k) => (
                  <SelectItem key={k} value={k}>
                    <AspectLabel aspect={k} />
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Toggle
              size="sm"
              shape="rounded"
              pressed={playing}
              onPressedChange={setPlaying}
              aria-label="Animate"
            >
              {playing ? (
                <IconPlayerPause data-icon="inline-start" />
              ) : (
                <IconPlayerPlay data-icon="inline-start" />
              )}
              <span className="max-sm:sr-only">Animate</span>
            </Toggle>
            <Button
              variant="ghost"
              size="sm"
              shape="rounded"
              onClick={() => set("seed", Math.floor(Math.random() * 101))}
              aria-label="New seed"
            >
              <IconDice5 data-icon="inline-start" />
              <span className="max-sm:sr-only">Seed</span>
            </Button>
            <Button
              variant="ghost"
              size="sm"
              shape="rounded"
              onClick={() => choose(source)}
              aria-label="Reset"
            >
              <IconRotate data-icon="inline-start" />
              <span className="max-sm:sr-only">Reset</span>
            </Button>
            <Button
              variant="ghost"
              size="sm"
              shape="rounded"
              onClick={exportPng}
              disabled={!renderer || busy}
            >
              <IconDownload data-icon="inline-start" />
              <span className="max-sm:sr-only">
                {busy ? "Rendering…" : "Export"}
              </span>
            </Button>
          </div>
        </div>

        {SHOW_REFERENCES && recreation ? (
          <section
            aria-label="References"
            className="shrink-0 border-t border-gray-alpha-400"
          >
            <ReferenceStrip
              files={[recreation.ref, ...recreation.variants]}
              pinned={original}
              onPin={setOriginal}
            />
          </section>
        ) : null}
      </main>

      <aside
        aria-label="Settings"
        className="order-3 flex flex-col border-t border-gray-alpha-400 md:order-none md:w-80 md:shrink-0 md:border-s md:border-t-0"
      >
        <Panel>
          <div className="flex flex-col gap-5 p-5">
            <FieldSet className="gap-3">
              <FieldLegend variant="label">Palette</FieldLegend>
              <div className="grid grid-cols-5 gap-2">
                {params.stops.map((hex, i) => (
                  <ColorTile
                    key={i}
                    value={hex}
                    label={`Stop ${i + 1}`}
                    className="aspect-square w-full"
                    onChange={(c) => {
                      const stops = [...params.stops] as Stops
                      stops[i] = c
                      set("stops", stops)
                    }}
                  />
                ))}
              </div>
            </FieldSet>
            {STREAK_PARAM_GROUPS.map((group) => (
              // A legend always draws at the top of its fieldset, so the
              // divider sits outside it.
              <Fragment key={group.title}>
                <Separator />
                <FieldSet className="gap-3">
                  <FieldLegend variant="label">{group.title}</FieldLegend>
                  {GROUP_COLORS[group.title]?.map(({ key, label }) => (
                    <Field
                      key={key}
                      orientation="horizontal"
                      className="grid grid-cols-[5.5rem_minmax(0,1fr)]"
                    >
                      <FieldLabel className="text-gray-900">{label}</FieldLabel>
                      <ColorTile
                        value={params[key]}
                        label={`${group.title} ${label.toLowerCase()}`}
                        className="h-7 w-full"
                        onChange={(c) => set(key, c)}
                      />
                    </Field>
                  ))}
                  {group.params.map((spec) => (
                    <ParamSlider
                      key={spec.key}
                      spec={spec}
                      value={params[spec.key]}
                      onChange={set}
                    />
                  ))}
                </FieldSet>
              </Fragment>
            ))}
          </div>
        </Panel>
      </aside>
    </div>
  )
}

/** An aspect as a little frame of that shape, then its ratio. */
function AspectLabel({ aspect }: { aspect: Aspect }) {
  const r = ASPECTS[aspect]
  const box = 14
  return (
    <span className="flex items-center gap-2">
      <span aria-hidden className="grid size-3.5 place-items-center">
        <span
          className="rounded-xs border border-current"
          style={{
            width: r >= 1 ? box : box * r,
            height: r >= 1 ? box / r : box,
          }}
        />
      </span>
      <span className="text-label-13-mono">{aspect}</span>
    </span>
  )
}

/**
 * A panel's scrolling body. On md and up it fills what its column leaves and
 * scrolls on its own, with no scrollbar, frosted at whichever end has more to
 * show; below md the page scrolls instead and it just holds its content.
 */
function Panel({ children }: { children: ReactNode }) {
  return (
    <ScrollArea className="group/panel **:data-[slot=scroll-area-scrollbar]:hidden md:min-h-0 md:flex-1">
      <EdgeFade
        side="top"
        depth="panel"
        className="hidden opacity-0 transition-opacity duration-200 group-data-overflow-y-start/panel:opacity-100 md:block"
      />
      {children}
      <EdgeFade
        side="bottom"
        depth="panel"
        className="hidden opacity-0 transition-opacity duration-200 group-data-overflow-y-end/panel:opacity-100 md:block"
      />
    </ScrollArea>
  )
}

const RAIL: {
  title: string
  kind: Source["kind"]
  items: { name: string; params: StreakParams }[]
}[] = [
  { title: "Clones", kind: "recreation", items: RECREATIONS },
  {
    title: "Presets",
    kind: "preset",
    // A preset is its own params, name and all.
    items: STREAK_PRESETS.map((p) => ({ name: p.name, params: p })),
  },
]

/**
 * The clones, then the hand-tuned presets, as a filmstrip: a column of
 * thumbnails on md and up, a strip that scrolls sideways below the stage on
 * small screens. Each section is a toggle group, so the arrow keys walk it in
 * whichever direction it runs.
 */
function PresetRail({
  renderer,
  aspect,
  selected,
  onSelect,
}: {
  renderer: StreakRenderer | null
  aspect: Aspect
  selected: Source
  onSelect: (source: Source) => void
}) {
  const mobile = useIsMobile()
  const rail = useRef<HTMLDivElement>(null)

  // A new aspect resizes every thumb, which can carry the selected one out of
  // the column. Below md the page scrolls, and this would scroll it too.
  useEffect(() => {
    if (mobile) return
    rail.current
      ?.querySelector("[data-slot=toggle-group-item][aria-pressed=true]")
      ?.scrollIntoView({ block: "nearest" })
  }, [aspect, selected, mobile])

  return (
    <div
      ref={rail}
      className="flex w-max gap-6 px-5 pt-1 pb-5 md:w-full md:flex-col md:px-4"
    >
      {RAIL.map(({ title, kind, items }) => (
        <div key={kind} className="flex flex-col gap-3">
          <h2 className="text-label-12 text-gray-900">{title}</h2>
          <ToggleGroup
            orientation={mobile ? "horizontal" : "vertical"}
            spacing={3}
            value={selected.kind === kind ? [String(selected.index)] : []}
            onValueChange={(v) =>
              v[0] && onSelect({ kind, index: Number(v[0]) })
            }
            // Room around each thumb for its outline.
            className="items-start md:w-full"
          >
            {items.map((p, i) => (
              // The thumbnail is the look; its name is the label, shown on
              // hover.
              <Tooltip key={p.name}>
                <TooltipTrigger
                  render={
                    <ToggleGroupItem
                      value={String(i)}
                      aria-label={p.name}
                      className="group/thumb h-auto w-48 p-0 hover:bg-transparent active:bg-transparent aria-pressed:bg-transparent aria-pressed:hover:bg-transparent md:w-full md:scroll-my-12"
                    />
                  }
                >
                  <Thumb
                    renderer={renderer}
                    params={p.params}
                    ratio={ASPECTS[aspect]}
                    className="rounded-sm outline-2 outline-offset-2 outline-transparent transition-[outline-color] group-hover/thumb:outline-gray-alpha-500 group-aria-pressed/thumb:outline-gray-1000"
                  />
                </TooltipTrigger>
                <TooltipContent side={mobile ? "top" : "right"}>
                  {p.name}
                </TooltipContent>
              </Tooltip>
            ))}
          </ToggleGroup>
        </div>
      ))}
    </div>
  )
}

/**
 * The reference images the selected clone was built from, as a strip under
 * the stage at their own aspects. Picking one pins it over the corner of the
 * preview to compare against; picking it again takes it off.
 */
function ReferenceStrip({
  files,
  pinned,
  onPin,
}: {
  files: string[]
  pinned: string | null
  onPin: (file: string | null) => void
}) {
  return (
    <ScrollArea className="**:data-[slot=scroll-area-scrollbar]:hidden">
      <ToggleGroup
        orientation="horizontal"
        spacing={3}
        value={pinned ? [pinned] : []}
        onValueChange={(v) => onPin(v[0] ?? null)}
        // Room around each image for its outline.
        className="w-max items-start px-5 py-4 md:px-8"
      >
        {files.map((file, i) => (
          <Tooltip key={file}>
            <TooltipTrigger
              render={
                <ToggleGroupItem
                  value={file}
                  aria-label={i ? `Variant ${i}` : "Reference"}
                  className="group/thumb h-auto w-auto p-0 hover:bg-transparent active:bg-transparent aria-pressed:bg-transparent aria-pressed:hover:bg-transparent"
                />
              }
            >
              {/* eslint-disable-next-line @next/next/no-img-element -- dev-only local file, no optimisation wanted */}
              <img
                src={refImg(file)}
                alt=""
                className="block h-20 w-auto rounded-sm bg-gray-100 outline-2 outline-offset-2 outline-transparent transition-[outline-color] group-hover/thumb:outline-gray-alpha-500 group-aria-pressed/thumb:outline-gray-1000"
              />
            </TooltipTrigger>
            <TooltipContent side="top">{file}</TooltipContent>
          </Tooltip>
        ))}
      </ToggleGroup>
    </ScrollArea>
  )
}

/** A colour swatch that opens the picker. */
function ColorTile({
  value,
  label,
  className,
  onChange,
}: {
  value: string
  label: string
  className?: string
  onChange: (hex: string) => void
}) {
  return (
    <Popover>
      {/* Squircle tiles: the theme's corner-shape turns rounded-* into a
          squircle where it's supported. The open one keeps an outline so you
          can see which colour the picker edits. */}
      <PopoverTrigger
        aria-label={label}
        className={cn(
          "rounded-md ring-1 ring-gray-alpha-400 outline-2 outline-offset-2 outline-transparent transition-[outline-color] outline-solid ring-inset hover:outline-gray-alpha-500 focus-visible:outline-gray-600 data-popup-open:outline-gray-1000",
          className
        )}
        style={{ backgroundColor: value }}
      />
      <PopoverContent className="w-64 p-3">
        <ColorPicker value={value} label={label} onChange={onChange} />
      </PopoverContent>
    </Popover>
  )
}

function ParamSlider({
  spec,
  value,
  onChange,
}: {
  spec: ParamSpec
  value: number
  onChange: (key: NumericParam, value: number) => void
}) {
  const id = `streak-${spec.key}`
  // Base UI hands the root's aria-labelledby down to the thumb's input. The
  // value is an array: a bare number makes the wrapper draw two thumbs.
  return (
    <Field
      orientation="horizontal"
      className="grid grid-cols-[5.5rem_minmax(0,1fr)_2.75rem]"
    >
      <FieldLabel id={`${id}-label`} className="text-gray-900">
        {spec.label}
      </FieldLabel>
      <Slider
        aria-labelledby={`${id}-label`}
        min={spec.min}
        max={spec.max}
        step={spec.step}
        value={[value]}
        onValueChange={(v) =>
          onChange(spec.key, typeof v === "number" ? v : v[0])
        }
      />
      <output
        aria-live="off"
        className="text-end text-label-12-mono text-gray-900 tabular-nums"
      >
        {value.toFixed(decimals(spec.step))}
      </output>
    </Field>
  )
}

function Preview({
  renderer,
  supported,
  params,
  aspect,
  playing,
  original,
}: {
  renderer: StreakRenderer | null
  supported: boolean
  params: StreakParams
  aspect: Aspect
  playing: boolean
  /** A reference image to show over the corner, for comparing. */
  original?: string
}) {
  const canvas = useRef<HTMLCanvasElement>(null)
  const draft = useRef<HTMLCanvasElement | null>(null)
  // The loop reads the latest params from here, so changing a slider while
  // animating doesn't restart the clock.
  const live = useRef(params)
  const [size, setSize] = useState({ w: 0, h: 0 })

  useEffect(() => {
    live.current = params
  }, [params])

  useEffect(() => {
    const el = canvas.current
    if (!el) return
    const ro = new ResizeObserver(([entry]) => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      const { width, height } = entry.contentRect
      setSize({ w: Math.round(width * dpr), h: Math.round(height * dpr) })
    })
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  // Half resolution, few samples, upscaled into the visible canvas.
  const drawDraft = useCallback(
    (p: StreakParams, time: number) => {
      const el = canvas.current
      if (!el || !renderer) return
      const d = (draft.current ??= document.createElement("canvas"))
      d.width = Math.max(1, Math.round(el.width / 2))
      d.height = Math.max(1, Math.round(el.height / 2))
      renderer.render(d.getContext("2d")!, d.width, d.height, p, {
        time,
        samples: SAMPLES.draft,
      })
      el.getContext("2d")!.drawImage(d, 0, 0, el.width, el.height)
    },
    [renderer]
  )

  // Still: a draft right away, the full frame once things settle.
  useEffect(() => {
    const el = canvas.current
    if (!el || !renderer || playing || !size.w) return
    if (el.width !== size.w || el.height !== size.h) {
      el.width = size.w
      el.height = size.h
    }
    const raf = requestAnimationFrame(() => drawDraft(params, 0))
    const full = setTimeout(() => {
      renderer.render(el.getContext("2d")!, el.width, el.height, params, {
        samples: SAMPLES.preview,
      })
    }, IDLE)
    return () => {
      cancelAnimationFrame(raf)
      clearTimeout(full)
    }
  }, [renderer, params, size, playing, drawDraft])

  // Animating: drafts every frame, paused while the tab is hidden by rAF.
  useEffect(() => {
    const el = canvas.current
    if (!el || !renderer || !playing || !size.w) return
    if (el.width !== size.w || el.height !== size.h) {
      el.width = size.w
      el.height = size.h
    }
    const start = performance.now()
    let raf = 0
    const tick = (now: number) => {
      drawDraft(live.current, (now - start) / 1000)
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [renderer, playing, size, drawDraft])

  return (
    <div
      className="relative overflow-hidden rounded-md bg-gray-100"
      style={{
        aspectRatio: ASPECTS[aspect],
        // The stage is a size container: as wide as it allows, unless that
        // would make the slide taller than the stage.
        width: `min(100cqw, ${ASPECTS[aspect]} * 100cqh)`,
      }}
    >
      <canvas
        ref={canvas}
        role="img"
        aria-label="Streak preview"
        className="absolute inset-0 block size-full"
      />
      {original ? (
        // eslint-disable-next-line @next/next/no-img-element -- dev-only local file, no optimisation wanted
        <img
          src={original}
          alt="Reference"
          className="absolute top-3 left-3 w-1/3 rounded-sm shadow-lg ring-1 ring-gray-alpha-400"
        />
      ) : null}
      {!supported ? (
        <p className="absolute inset-0 grid place-items-center p-6 text-center text-copy-14 text-gray-900">
          This playground needs WebGL2, which this browser doesn’t have.
        </p>
      ) : null}
    </div>
  )
}

function Thumb({
  renderer,
  params,
  ratio,
  width = 512,
  className,
}: {
  renderer: StreakRenderer | null
  params: StreakParams
  /** Width / height. */
  ratio: number
  /** Backing width in pixels. */
  width?: number
  className?: string
}) {
  const canvas = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const el = canvas.current
    if (!el || !renderer) return
    const w = width
    const h = Math.round(w / ratio)
    el.width = w
    el.height = h
    renderer.render(el.getContext("2d")!, w, h, params, {
      samples: SAMPLES.thumb,
    })
  }, [renderer, params, ratio, width])

  return (
    <canvas
      ref={canvas}
      aria-hidden
      className={cn("block h-auto w-full bg-gray-100", className)}
      style={{ aspectRatio: ratio }}
    />
  )
}
