"use client"

import { AdamAvatar } from "@/components/article/adam/avatar"
import { PhoneDownFill, PhoneFill } from "@/components/article/adam/icons"
import type { ReactNode } from "react"

import { cn } from "@/lib/utils"

/** iPhone 17 Pro, in points. */
export const SCREEN = { w: 402, h: 874, radius: 58 } as const
const BEZEL = 11
const BAND = 3
export const DEVICE = {
  w: SCREEN.w + 2 * (BEZEL + BAND),
  h: SCREEN.h + 2 * (BEZEL + BAND),
} as const

/**
 * How much of the screen a figure shows. The stage crops the phone at the
 * bottom, like Apple's own support pages, so screens lay their content out
 * inside the top 506pt and leave the rest black.
 */
export const VISIBLE = 506
/** Height of the device the stage shows: band, bezel, visible screen. */
export const DEVICE_SHOWN = BAND + BEZEL + VISIBLE

export type Island =
  | { kind: "idle" }
  /** An incoming call: the island grows into a capsule with the caller. */
  | { kind: "incoming"; name: string; label?: string; pressed?: boolean }
  /** A call running in the background: green handset + timer, waveform. */
  | { kind: "call"; elapsed: string }

/**
 * A dark-mode iPhone in a silver band: side buttons, black bezel, the
 * Dynamic Island and a status bar. Screens render as children at 402x874.
 */
export function IPhone({
  time,
  island = { kind: "idle" },
  className,
  children,
}: {
  /** Status bar clock; null hides it (the lock screen draws its own). */
  time: string | null
  island?: Island
  className?: string
  children: ReactNode
}) {
  return (
    <div
      className={cn("adam-device relative", className)}
      style={{ width: DEVICE.w, height: DEVICE.h }}
    >
      {/* Side buttons sit behind the band so only their edge shows. */}
      <SideButton side="left" top={196} height={34} />
      <SideButton side="left" top={262} height={62} />
      <SideButton side="left" top={338} height={62} />
      <SideButton side="right" top={300} height={98} />
      <SideButton side="right" top={600} height={66} flush />

      {/* The band: polished silver, lit from the top left, with the dark
          seam where it meets the glass. */}
      <div
        className="absolute inset-0"
        style={{
          borderRadius: SCREEN.radius + BEZEL + BAND + 2,
          background:
            "linear-gradient(150deg, #fbfbfc 0%, #d4d4d8 14%, #a7a7ad 36%, #e6e6e9 58%, #b9b9be 80%, #f2f2f4 100%)",
          boxShadow: [
            "0 30px 60px -28px rgb(0 0 0 / 0.55)",
            "inset 0 0 0 0.5px rgb(0 0 0 / 0.35)",
            "inset 0 1px 0.5px rgb(255 255 255 / 0.9)",
          ].join(","),
        }}
      />
      {/* Bezel */}
      <div
        className="absolute bg-black"
        style={{
          inset: BAND,
          borderRadius: SCREEN.radius + BEZEL,
          boxShadow:
            "0 0 0 0.75px rgb(0 0 0 / 0.55), inset 0 0 0 1.5px rgb(255 255 255 / 0.05)",
        }}
      />
      {/* Screen */}
      <div
        className="absolute overflow-hidden bg-black"
        style={{
          left: BAND + BEZEL,
          top: BAND + BEZEL,
          width: SCREEN.w,
          height: SCREEN.h,
          borderRadius: SCREEN.radius,
        }}
      >
        <div className="absolute inset-0">{children}</div>
        <StatusBar time={time} compact={island.kind === "call"} />
        <DynamicIsland state={island} />
        <div
          className="absolute bottom-2 left-1/2 z-30 h-[5px] w-[139px] -translate-x-1/2 rounded-full bg-white"
          aria-hidden
        />
        {/* A faint sheen over the glass. */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 z-40"
          style={{
            background:
              "linear-gradient(115deg, rgb(255 255 255 / 0.07) 0%, transparent 32%, transparent 70%, rgb(255 255 255 / 0.03) 100%)",
          }}
        />
      </div>
    </div>
  )
}

function SideButton({
  side,
  top,
  height,
  flush,
}: {
  side: "left" | "right"
  top: number
  height: number
  flush?: boolean
}) {
  return (
    <div
      aria-hidden
      className="absolute"
      style={{
        top,
        height,
        width: flush ? 3 : 5,
        [side]: flush ? -1 : -3,
        borderRadius: 2,
        background:
          side === "left"
            ? "linear-gradient(90deg, #9c9ca2, #f3f3f5 55%, #c4c4c9)"
            : "linear-gradient(90deg, #c4c4c9, #f3f3f5 45%, #9c9ca2)",
      }}
    />
  )
}

/**
 * `compact` is the status bar beside a wide island (a call in progress): the
 * clock tucks into the corner and only the battery stays on the right.
 */
function StatusBar({
  time,
  compact,
}: {
  time: string | null
  compact?: boolean
}) {
  return (
    <div
      className="absolute inset-x-0 top-0 z-30 flex h-[54px] items-center justify-between text-white"
      style={{
        paddingInline: compact ? "22px 24px" : "40px 30px",
        paddingTop: 6,
        transition: "padding 480ms cubic-bezier(0.32, 1.22, 0.42, 1)",
      }}
    >
      <span
        className="w-[64px] text-[17px] font-semibold tabular-nums"
        style={{
          letterSpacing: "-0.02em",
          textAlign: compact ? "left" : "center",
        }}
      >
        {time}
      </span>
      <span className="flex items-center gap-[6px]">
        {compact ? null : (
          <>
            <Signal />
            <Wifi />
          </>
        )}
        <Battery />
      </span>
    </div>
  )
}

function Signal() {
  return (
    <svg width="19" height="12" viewBox="0 0 19 12" fill="currentColor">
      <rect x="0" y="7.5" width="3.2" height="4.5" rx="1" />
      <rect x="5" y="5" width="3.2" height="7" rx="1" />
      <rect x="10" y="2.5" width="3.2" height="9.5" rx="1" />
      <rect x="15" y="0" width="3.2" height="12" rx="1" />
    </svg>
  )
}

function Wifi() {
  return (
    <svg width="17" height="12" viewBox="0 0 17 12" fill="currentColor">
      <path d="M8.5 2.3c2.4 0 4.6.9 6.3 2.5.2.2.5.2.6 0l1.1-1.1c.2-.2.2-.5 0-.6A11.4 11.4 0 0 0 .5 3.1c-.2.2-.2.5 0 .6l1.1 1.1c.2.2.5.2.6 0a9 9 0 0 1 6.3-2.5Z" />
      <path d="M8.5 5.9c1.4 0 2.6.5 3.6 1.4.2.2.5.2.7 0l1.1-1.1c.2-.2.2-.5 0-.6a7.8 7.8 0 0 0-10.8 0c-.2.2-.2.5 0 .6L4.2 7.3c.2.2.5.2.7 0 1-.9 2.2-1.4 3.6-1.4Z" />
      <path d="M10.6 9.2c.2-.2.2-.5 0-.6a3.1 3.1 0 0 0-4.2 0c-.2.2-.2.5 0 .6l1.8 1.8c.2.2.5.2.6 0l1.8-1.8Z" />
    </svg>
  )
}

function Battery() {
  return (
    <svg width="28" height="13" viewBox="0 0 28 13" fill="none">
      <rect
        x="0.5"
        y="0.5"
        width="24"
        height="12"
        rx="3.8"
        stroke="currentColor"
        strokeOpacity="0.4"
      />
      <rect x="2" y="2" width="17" height="9" rx="2.5" fill="currentColor" />
      <path
        d="M26 4.5v4c.8-.3 1.4-1.1 1.4-2s-.6-1.7-1.4-2Z"
        fill="currentColor"
        fillOpacity="0.45"
      />
    </svg>
  )
}

/** The island's footprint per state, in points. */
const ISLAND = {
  idle: { w: 126, h: 37, top: 11 },
  call: { w: 244, h: 37, top: 11 },
  incoming: { w: 386, h: 86, top: 8 },
} as const

function DynamicIsland({ state }: { state: Island }) {
  const box = ISLAND[state.kind]
  const spring = "cubic-bezier(0.32, 1.22, 0.42, 1)"
  return (
    <>
      <div
        className="absolute left-1/2 z-40 -translate-x-1/2 overflow-hidden bg-black"
        style={{
          top: box.top,
          width: box.w,
          height: box.h,
          borderRadius: box.h / 2,
          boxShadow:
            state.kind === "incoming"
              ? "0 10px 30px rgb(0 0 0 / 0.55)"
              : "none",
          transition: `width 560ms ${spring}, height 560ms ${spring}, top 560ms ${spring}, border-radius 560ms ${spring}, box-shadow 400ms`,
        }}
      >
        {/* Incoming call */}
        <div
          className="absolute inset-0 flex items-center gap-3 pr-[14px] pl-[13px]"
          style={{
            opacity: state.kind === "incoming" ? 1 : 0,
            transition: `opacity ${state.kind === "incoming" ? "320ms 180ms" : "160ms"} ease-out`,
          }}
        >
          {state.kind === "incoming" ? (
            <>
              <AdamAvatar size={60} />
              <span className="flex min-w-0 flex-1 flex-col">
                <span className="text-[14px] leading-[18px] text-[#8e8e93]">
                  {state.label ?? "mobile"}
                </span>
                <span
                  className="truncate text-[20px] leading-[24px] font-medium"
                  style={{ letterSpacing: "-0.02em" }}
                >
                  {state.name}
                </span>
              </span>
              <span className="grid size-[54px] shrink-0 place-items-center rounded-full bg-[#ff3b30]">
                <PhoneDownFill size={27} />
              </span>
              <span
                className="grid size-[54px] shrink-0 place-items-center rounded-full bg-[#30d158] transition-[transform,filter] duration-150"
                style={
                  state.pressed
                    ? { transform: "scale(0.88)", filter: "brightness(1.2)" }
                    : undefined
                }
              >
                <PhoneFill size={25} />
              </span>
            </>
          ) : null}
        </div>

        {/* Call in progress */}
        <div
          className="absolute inset-0 flex items-center justify-between pr-[15px] pl-[14px]"
          style={{
            opacity: state.kind === "call" ? 1 : 0,
            transition: `opacity ${state.kind === "call" ? "300ms 200ms" : "150ms"} ease-out`,
          }}
        >
          <span className="flex items-center gap-[6px] text-[15px] font-medium text-[#30d158] tabular-nums">
            <PhoneFill size={14} />
            {state.kind === "call" ? state.elapsed : null}
          </span>
          {/* Live audio: a run of thin bars, loudest in the middle. */}
          <span className="flex h-[16px] items-center gap-[2px]" aria-hidden>
            {[
              0.25, 0.4, 0.55, 0.85, 0.6, 1, 0.75, 0.5, 0.9, 0.45, 0.3, 0.2,
            ].map((h, i) => (
              <span
                key={i}
                className="adam-wave-bar"
                style={{
                  height: 16 * h,
                  animationDelay: `${(i * 0.11) % 0.9}s`,
                  animationDuration: `${0.6 + ((i * 7) % 5) * 0.12}s`,
                }}
              />
            ))}
          </span>
        </div>
      </div>

      {/* The front camera, which the island grows around. */}
      <span
        aria-hidden
        className="absolute z-50 size-[12px] rounded-full"
        style={{
          top: 23.5,
          left: SCREEN.w / 2 + 39,
          background:
            "radial-gradient(circle at 40% 38%, #18203a 0%, #0a0c14 45%, #030305 75%)",
          boxShadow: "inset 0 0 0 1px rgb(255 255 255 / 0.04)",
        }}
      />
    </>
  )
}
