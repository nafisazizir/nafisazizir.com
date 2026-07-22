"use client"

import { useEffect, useRef, useState } from "react"
import { HugeiconsIcon } from "@hugeicons/react"
import {
  Cancel01Icon,
  Download01Icon,
  PauseIcon,
  PlayIcon,
  SlidersHorizontalIcon,
} from "@hugeicons/core-free-icons"

import { ColorStops, type ColorStop } from "@/components/playground/color-stops"
import {
  ParamSlider,
  RANGE_CLASS,
  Section,
  Segmented,
  ToggleRow,
} from "@/components/playground/controls"
import {
  GradientEngine,
  TIMELINE_SECONDS,
  type ExportFormat,
  type PlaygroundParams,
  type RGB,
} from "@/components/playground/gradient-engine"
import { DEFAULT_GRADIENT_CONFIG } from "@/components/shaders/gradient-shader"
import {
  ARCHIVE_PRESETS,
  type PresetRecord,
} from "@/components/shaders/gradient-presets"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

const DEFAULT_PARAMS: PlaygroundParams = {
  colorSize: DEFAULT_GRADIENT_CONFIG.colorSize,
  colorSpacing: DEFAULT_GRADIENT_CONFIG.colorSpacing,
  colorSpread: DEFAULT_GRADIENT_CONFIG.colorSpread,
  colorRotation: DEFAULT_GRADIENT_CONFIG.colorRotation,
  displacement: DEFAULT_GRADIENT_CONFIG.displacement,
  noiseSize: DEFAULT_GRADIENT_CONFIG.noiseSize,
  noiseIntensity: DEFAULT_GRADIENT_CONFIG.noiseIntensity,
  offsetX: DEFAULT_GRADIENT_CONFIG.offsetX,
  offsetY: DEFAULT_GRADIENT_CONFIG.offsetY,
  speed: DEFAULT_GRADIENT_CONFIG.speed,
  pull: DEFAULT_GRADIENT_CONFIG.pull,
  pullRadius: DEFAULT_GRADIENT_CONFIG.pullRadius,
  glow: DEFAULT_GRADIENT_CONFIG.glow,
  glowRadius: DEFAULT_GRADIENT_CONFIG.glowRadius,
  style: DEFAULT_GRADIENT_CONFIG.style,
  halftoneScale: DEFAULT_GRADIENT_CONFIG.halftoneScale,
  posterLevels: DEFAULT_GRADIENT_CONFIG.posterLevels,
  grainScale: DEFAULT_GRADIENT_CONFIG.grainScale,
  grainAmount: DEFAULT_GRADIENT_CONFIG.grainAmount,
  grainSoft: DEFAULT_GRADIENT_CONFIG.grainSoft,
  grainSparkle: DEFAULT_GRADIENT_CONFIG.grainSparkle,
  mouseLerp: DEFAULT_GRADIENT_CONFIG.mouseLerp,
  interactive: DEFAULT_GRADIENT_CONFIG.interactive,
}

const DEFAULT_PRESET = ARCHIVE_PRESETS.find((p) => p.name === "Solar")!

const STYLE_OPTIONS = [
  { value: 4, label: "Grain" },
  { value: 1, label: "Halftone" },
  { value: 2, label: "Poster" },
  { value: 3, label: "Dither" },
  { value: 0, label: "Smooth" },
]

const FORMAT_OPTIONS: { value: ExportFormat; label: string }[] = [
  { value: "png", label: "PNG" },
  { value: "jpeg", label: "JPEG" },
  { value: "webp", label: "WebP" },
]

const SCALE_OPTIONS = [
  { value: 1, label: "1×" },
  { value: 2, label: "2×" },
  { value: 4, label: "4×" },
]

function makeStops(colors: readonly (readonly number[])[]): ColorStop[] {
  return colors.map((c, i) => ({
    id: `stop-${i}`,
    rgb: [...c] as RGB,
  }))
}

function formatTime(seconds: number) {
  const s = Math.floor(seconds)
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`
}

function matchesPreset(stops: ColorStop[], preset: PresetRecord) {
  return preset.colors.every((c, i) =>
    c.every((v, j) => Math.abs(v - stops[i].rgb[j]) < 1 / 510)
  )
}

export function ShaderPlayground() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const engineRef = useRef<GradientEngine | null>(null)
  const timeInputRef = useRef<HTMLInputElement>(null)
  const timeLabelRef = useRef<HTMLSpanElement>(null)
  const scrubbing = useRef(false)

  const [params, setParams] = useState<PlaygroundParams>(DEFAULT_PARAMS)
  const [stops, setStops] = useState<ColorStop[]>(() =>
    makeStops(DEFAULT_PRESET.colors)
  )
  const [playing, setPlaying] = useState(true)
  const [format, setFormat] = useState<ExportFormat>("png")
  const [scale, setScale] = useState(2)
  const [panelOpen, setPanelOpen] = useState(true)
  const [supported, setSupported] = useState(true)
  const [copied, setCopied] = useState(false)

  const set = <K extends keyof PlaygroundParams>(
    key: K,
    value: PlaygroundParams[K]
  ) => setParams((p) => ({ ...p, [key]: value }))

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    // The sync effects below run right after mount, so the engine can start
    // from defaults and immediately receive the current state.
    const engine = new GradientEngine(
      canvas,
      DEFAULT_PRESET.colors.map((c) => [...c] as RGB),
      DEFAULT_PARAMS
    )
    engineRef.current = engine
    if (!engine.ok) setSupported(false)
    engine.onTick = (t) => {
      if (scrubbing.current) return
      if (timeInputRef.current) timeInputRef.current.value = String(t)
      if (timeLabelRef.current) timeLabelRef.current.textContent = formatTime(t)
    }
    return () => {
      engineRef.current = null
      engine.destroy()
    }
  }, [])

  useEffect(() => {
    engineRef.current?.setParams(params)
  }, [params])

  useEffect(() => {
    engineRef.current?.setColors(stops.map((s) => s.rgb))
  }, [stops])

  useEffect(() => {
    if (engineRef.current) engineRef.current.playing = playing
  }, [playing])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.code !== "Space") return
      const target = e.target as HTMLElement | null
      if (target?.closest("input, button, textarea, select, [contenteditable]"))
        return
      e.preventDefault()
      setPlaying((p) => !p)
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [])

  const onScrub = (value: number) => {
    engineRef.current?.seek(value)
    if (timeLabelRef.current)
      timeLabelRef.current.textContent = formatTime(value)
  }

  const onCopyConfig = async () => {
    const config = {
      ...params,
      colors: stops.map((s) => s.rgb.map((v) => Number(v.toFixed(4)))),
    }
    await navigator.clipboard.writeText(JSON.stringify(config, null, 2))
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }

  return (
    <div className="h-dvh">
      <div className="fixed inset-0">
        <canvas ref={canvasRef} aria-hidden className="block h-full w-full" />
      </div>

      {!supported && (
        <p className="fixed inset-x-0 top-1/2 z-10 -translate-y-1/2 text-center text-sm text-muted-foreground">
          WebGL2 isn&apos;t available in this browser, so the playground
          can&apos;t render.
        </p>
      )}

      {/* Player controller */}
      <div className="pointer-events-none fixed inset-x-0 bottom-5 z-40 flex justify-center px-4">
        <div className="pointer-events-auto flex w-full max-w-xl items-center gap-3 rounded-3xl border border-border bg-card/20 px-3 py-2 shadow-[0_16px_40px_-12px_color-mix(in_oklab,var(--background)_50%,transparent)] backdrop-blur-sm backdrop-saturate-150">
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={() => setPlaying((p) => !p)}
            aria-label={playing ? "Pause" : "Play"}
            className="shrink-0 hover:bg-foreground/8 dark:hover:bg-foreground/8"
          >
            <HugeiconsIcon icon={playing ? PauseIcon : PlayIcon} />
          </Button>
          <span
            ref={timeLabelRef}
            className="w-9 shrink-0 text-center font-mono text-[11px] text-muted-foreground tabular-nums"
          >
            0:00
          </span>
          <input
            ref={timeInputRef}
            type="range"
            min={0}
            max={TIMELINE_SECONDS}
            step={0.01}
            defaultValue={0}
            aria-label="Timeline"
            onPointerDown={() => (scrubbing.current = true)}
            onPointerUp={() => (scrubbing.current = false)}
            onChange={(e) => onScrub(parseFloat(e.currentTarget.value))}
            className={cn(RANGE_CLASS, "flex-1")}
          />
          <span className="shrink-0 font-mono text-[11px] text-muted-foreground tabular-nums">
            {formatTime(TIMELINE_SECONDS)}
          </span>
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={() => engineRef.current?.exportFrame(format, scale)}
            aria-label="Export frame"
            className="shrink-0 hover:bg-foreground/8 dark:hover:bg-foreground/8"
          >
            <HugeiconsIcon icon={Download01Icon} />
          </Button>
        </div>
      </div>

      {/* Controls toggle (sits under the panel when it's open) */}
      <Button
        variant="outline"
        size="icon-sm"
        onClick={() => setPanelOpen(true)}
        aria-label="Open controls"
        className="fixed top-4 right-4 z-30 backdrop-blur-sm"
      >
        <HugeiconsIcon icon={SlidersHorizontalIcon} />
      </Button>

      {/* Control panel */}
      <aside
        inert={!panelOpen}
        className={cn(
          "fixed inset-y-4 right-4 z-40 flex w-[min(21rem,calc(100vw-2rem))] flex-col overflow-hidden rounded-3xl border border-border bg-card/30 shadow-[0_16px_40px_-12px_color-mix(in_oklab,var(--background)_50%,transparent)] backdrop-blur-xl backdrop-saturate-150 transition-[transform,opacity] duration-300 ease-out",
          panelOpen
            ? "translate-x-0 opacity-100"
            : "pointer-events-none translate-x-[calc(100%+1.5rem)] opacity-0"
        )}
      >
        <header className="flex items-center justify-between py-2 pr-2 pl-5">
          <h2 className="font-mono text-[10px] tracking-[0.2em] text-muted-foreground uppercase">
            Playground
          </h2>
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={() => setPanelOpen(false)}
            aria-label="Close controls"
            className="hover:bg-foreground/8 dark:hover:bg-foreground/8"
          >
            <HugeiconsIcon icon={Cancel01Icon} />
          </Button>
        </header>

        <div className="flex flex-1 flex-col gap-7 overflow-y-auto px-5 pt-1 pb-6">
          <Section title="Presets">
            <div className="grid grid-cols-2 gap-1.5">
              {ARCHIVE_PRESETS.map((preset) => {
                const active = matchesPreset(stops, preset)
                return (
                  <button
                    key={preset.name}
                    type="button"
                    onClick={() =>
                      setStops((prev) =>
                        prev.map((s, i) => ({
                          ...s,
                          rgb: [...preset.colors[i]] as RGB,
                        }))
                      )
                    }
                    className={cn(
                      "group flex flex-col gap-1.5 rounded-2xl border p-2 text-left transition-colors outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50",
                      active
                        ? "border-foreground/40 bg-foreground/10"
                        : "border-border/60 hover:border-foreground/25"
                    )}
                  >
                    <span className="flex h-4 w-full overflow-hidden rounded-lg">
                      {preset.colors.map((c, i) => (
                        <span
                          key={i}
                          style={{
                            background: `rgb(${c.map((v) => Math.round(v * 255)).join(" ")})`,
                          }}
                          className="flex-1"
                        />
                      ))}
                    </span>
                    <span
                      className={cn(
                        "text-[11px] transition-colors",
                        active
                          ? "text-foreground"
                          : "text-muted-foreground group-hover:text-foreground"
                      )}
                    >
                      {preset.name}
                    </span>
                  </button>
                )
              })}
            </div>
          </Section>

          <Section title="Colors · top to bottom">
            <ColorStops stops={stops} onChange={setStops} />
          </Section>

          <Section title="Style">
            <Segmented
              ariaLabel="Render style"
              options={STYLE_OPTIONS}
              value={params.style}
              onChange={(v) => set("style", v)}
            />
            {params.style === 4 && (
              <>
                <ParamSlider
                  label="Grain scale"
                  value={params.grainScale}
                  min={0.1}
                  max={3}
                  step={0.01}
                  onChange={(v) => set("grainScale", v)}
                />
                <ParamSlider
                  label="Grain amount"
                  value={params.grainAmount}
                  min={0}
                  max={2}
                  step={0.01}
                  onChange={(v) => set("grainAmount", v)}
                />
                <ParamSlider
                  label="Softness"
                  value={params.grainSoft}
                  min={0.05}
                  max={1}
                  step={0.01}
                  onChange={(v) => set("grainSoft", v)}
                />
                <ParamSlider
                  label="Sparkle"
                  value={params.grainSparkle}
                  min={0}
                  max={1}
                  step={0.01}
                  onChange={(v) => set("grainSparkle", v)}
                />
              </>
            )}
            {params.style === 1 && (
              <ParamSlider
                label="Dot scale"
                value={params.halftoneScale}
                min={2}
                max={24}
                step={0.5}
                onChange={(v) => set("halftoneScale", v)}
              />
            )}
            {(params.style === 2 || params.style === 3) && (
              <ParamSlider
                label="Levels"
                value={params.posterLevels}
                min={2}
                max={16}
                step={1}
                onChange={(v) => set("posterLevels", v)}
              />
            )}
          </Section>

          <Section title="Shape">
            <ParamSlider
              label="Scale"
              value={params.colorSize}
              min={0.1}
              max={3}
              step={0.01}
              onChange={(v) => set("colorSize", v)}
            />
            <ParamSlider
              label="Spacing"
              value={params.colorSpacing}
              min={0}
              max={2}
              step={0.01}
              onChange={(v) => set("colorSpacing", v)}
            />
            <ParamSlider
              label="Spread"
              value={params.colorSpread}
              min={0.05}
              max={4}
              step={0.01}
              onChange={(v) => set("colorSpread", v)}
            />
            <ParamSlider
              label="Rotation"
              value={params.colorRotation}
              min={-3.14}
              max={3.14}
              step={0.01}
              onChange={(v) => set("colorRotation", v)}
            />
            <ParamSlider
              label="Offset X"
              value={params.offsetX}
              min={-2}
              max={2}
              step={0.01}
              onChange={(v) => set("offsetX", v)}
            />
            <ParamSlider
              label="Offset Y"
              value={params.offsetY}
              min={-2}
              max={2}
              step={0.01}
              onChange={(v) => set("offsetY", v)}
            />
          </Section>

          <Section title="Noise">
            <ParamSlider
              label="Displacement"
              value={params.displacement}
              min={0}
              max={4}
              step={0.01}
              onChange={(v) => set("displacement", v)}
            />
            <ParamSlider
              label="Noise scale"
              value={params.noiseSize}
              min={0.05}
              max={3}
              step={0.01}
              onChange={(v) => set("noiseSize", v)}
            />
            <ParamSlider
              label="Film grain"
              value={params.noiseIntensity}
              min={0}
              max={0.2}
              step={0.001}
              onChange={(v) => set("noiseIntensity", v)}
            />
          </Section>

          <Section title="Motion">
            <ParamSlider
              label="Speed"
              value={params.speed}
              min={0}
              max={0.005}
              step={0.0001}
              onChange={(v) => set("speed", v)}
            />
            <ToggleRow
              label="Follow cursor"
              checked={params.interactive}
              onChange={(v) => set("interactive", v)}
            />
            {params.interactive && (
              <>
                <ParamSlider
                  label="Cursor ease"
                  value={params.mouseLerp}
                  min={0.01}
                  max={1}
                  step={0.01}
                  onChange={(v) => set("mouseLerp", v)}
                />
                <ParamSlider
                  label="Pull"
                  value={params.pull}
                  min={0}
                  max={1}
                  step={0.01}
                  onChange={(v) => set("pull", v)}
                />
                <ParamSlider
                  label="Pull radius"
                  value={params.pullRadius}
                  min={0}
                  max={6}
                  step={0.05}
                  onChange={(v) => set("pullRadius", v)}
                />
                <ParamSlider
                  label="Glow"
                  value={params.glow}
                  min={0}
                  max={1}
                  step={0.01}
                  onChange={(v) => set("glow", v)}
                />
                <ParamSlider
                  label="Glow radius"
                  value={params.glowRadius}
                  min={0}
                  max={6}
                  step={0.05}
                  onChange={(v) => set("glowRadius", v)}
                />
              </>
            )}
          </Section>

          <Section title="Export">
            <Segmented
              ariaLabel="Export format"
              options={FORMAT_OPTIONS}
              value={format}
              onChange={setFormat}
            />
            <Segmented
              ariaLabel="Export resolution"
              options={SCALE_OPTIONS}
              value={scale}
              onChange={setScale}
            />
            <div className="mt-1 flex flex-col gap-1.5">
              <Button
                size="sm"
                onClick={() => engineRef.current?.exportFrame(format, scale)}
              >
                <HugeiconsIcon icon={Download01Icon} data-icon="inline-start" />
                Export frame
              </Button>
              <Button variant="secondary" size="sm" onClick={onCopyConfig}>
                {copied ? "Copied" : "Copy config"}
              </Button>
            </div>
          </Section>
        </div>
      </aside>
    </div>
  )
}
