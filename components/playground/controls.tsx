"use client"

import { cn } from "@/lib/utils"

export const RANGE_CLASS = cn(
  "h-1 w-full cursor-ew-resize appearance-none rounded-full bg-foreground/15 outline-none",
  "focus-visible:ring-[3px] focus-visible:ring-ring/50",
  "[&::-webkit-slider-thumb]:size-3 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-foreground [&::-webkit-slider-thumb]:transition-transform [&::-webkit-slider-thumb]:hover:scale-125",
  "[&::-moz-range-thumb]:size-3 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-0 [&::-moz-range-thumb]:bg-foreground"
)

export function Section({
  title,
  children,
}: {
  title: string
  children: React.ReactNode
}) {
  return (
    <section className="flex flex-col gap-3">
      <h3 className="font-mono text-[10px] tracking-[0.2em] text-muted-foreground uppercase">
        {title}
      </h3>
      {children}
    </section>
  )
}

export function ParamSlider({
  label,
  value,
  min,
  max,
  step,
  onChange,
}: {
  label: string
  value: number
  min: number
  max: number
  step: number
  onChange: (value: number) => void
}) {
  const decimals = step >= 1 ? 0 : step >= 0.01 ? 2 : step >= 0.001 ? 3 : 4
  return (
    <label className="flex flex-col gap-1.5">
      <span className="flex items-baseline justify-between text-xs">
        <span className="text-muted-foreground">{label}</span>
        <span className="font-mono text-[11px] text-foreground/70 tabular-nums">
          {value.toFixed(decimals)}
        </span>
      </span>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(parseFloat(e.currentTarget.value))}
        className={RANGE_CLASS}
      />
    </label>
  )
}

export function Segmented<T extends string | number>({
  options,
  value,
  onChange,
  ariaLabel,
}: {
  options: { value: T; label: string }[]
  value: T
  onChange: (value: T) => void
  ariaLabel: string
}) {
  return (
    <div
      role="radiogroup"
      aria-label={ariaLabel}
      className="flex flex-wrap gap-1"
    >
      {options.map((opt) => (
        <button
          key={String(opt.value)}
          type="button"
          role="radio"
          aria-checked={opt.value === value}
          onClick={() => onChange(opt.value)}
          className={cn(
            "rounded-full px-2.5 py-1 text-xs transition-colors outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50",
            opt.value === value
              ? "bg-foreground font-medium text-background"
              : "bg-foreground/8 text-muted-foreground hover:bg-foreground/15 hover:text-foreground"
          )}
        >
          {opt.label}
        </button>
      ))}
    </div>
  )
}

export function ToggleRow({
  label,
  checked,
  onChange,
}: {
  label: string
  checked: boolean
  onChange: (checked: boolean) => void
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className="flex items-center justify-between gap-2 text-xs outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50"
    >
      <span className="text-muted-foreground">{label}</span>
      <span
        aria-hidden
        className={cn(
          "relative h-4.5 w-8 rounded-full transition-colors",
          checked ? "bg-foreground" : "bg-foreground/20"
        )}
      >
        <span
          className={cn(
            "absolute top-0.5 left-0.5 size-3.5 rounded-full bg-background transition-transform",
            checked && "translate-x-3.5"
          )}
        />
      </span>
    </button>
  )
}
