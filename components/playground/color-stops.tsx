"use client"

import { Reorder, useDragControls } from "framer-motion"
import { HugeiconsIcon } from "@hugeicons/react"
import { GripVerticalIcon } from "@hugeicons/core-free-icons"

import type { RGB } from "@/components/playground/gradient-engine"

export interface ColorStop {
  id: string
  rgb: RGB
}

export function rgbToHex([r, g, b]: RGB) {
  const to = (v: number) =>
    Math.round(Math.min(Math.max(v, 0), 1) * 255)
      .toString(16)
      .padStart(2, "0")
  return `#${to(r)}${to(g)}${to(b)}`
}

export function hexToRgb(hex: string): RGB {
  const n = parseInt(hex.slice(1), 16)
  return [((n >> 16) & 255) / 255, ((n >> 8) & 255) / 255, (n & 255) / 255]
}

function StopRow({
  stop,
  index,
  onColor,
}: {
  stop: ColorStop
  index: number
  onColor: (rgb: RGB) => void
}) {
  const controls = useDragControls()
  const hex = rgbToHex(stop.rgb)
  return (
    <Reorder.Item
      value={stop}
      dragListener={false}
      dragControls={controls}
      className="flex items-center gap-2 rounded-2xl border border-border/60 bg-background/40 p-2"
    >
      <button
        type="button"
        aria-label={`Reorder stop ${index + 1}`}
        onPointerDown={(e) => {
          e.preventDefault()
          controls.start(e)
        }}
        className="cursor-grab touch-none text-muted-foreground transition-colors hover:text-foreground active:cursor-grabbing"
      >
        <HugeiconsIcon icon={GripVerticalIcon} className="size-4" />
      </button>
      <label className="relative block">
        <input
          type="color"
          value={hex}
          onChange={(e) => onColor(hexToRgb(e.currentTarget.value))}
          aria-label={`Stop ${index + 1} color`}
          className="absolute inset-0 size-full cursor-pointer opacity-0"
        />
        <span
          aria-hidden
          style={{ background: hex }}
          className="block size-6 rounded-full border border-foreground/20"
        />
      </label>
      <span className="font-mono text-xs text-foreground/80 uppercase">
        {hex}
      </span>
      <span className="ml-auto font-mono text-[10px] text-muted-foreground">
        {index + 1}
      </span>
    </Reorder.Item>
  )
}

export function ColorStops({
  stops,
  onChange,
}: {
  stops: ColorStop[]
  onChange: (stops: ColorStop[]) => void
}) {
  return (
    <Reorder.Group
      axis="y"
      values={stops}
      onReorder={onChange}
      className="flex flex-col gap-1.5"
    >
      {stops.map((stop, i) => (
        <StopRow
          key={stop.id}
          stop={stop}
          index={i}
          onColor={(rgb) =>
            onChange(stops.map((s) => (s.id === stop.id ? { ...s, rgb } : s)))
          }
        />
      ))}
    </Reorder.Group>
  )
}
