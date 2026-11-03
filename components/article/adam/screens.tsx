"use client"

import type { ReactNode } from "react"

import { AdamAvatar } from "@/components/article/adam/avatar"
import { MessageFill } from "@/components/article/adam/icons"
import { SCREEN, VISIBLE } from "@/components/article/adam/iphone"

/**
 * The lock screen: date, the big clock, and notifications stacked at the
 * bottom of what the stage shows. `awake` lifts the screen from its dimmed
 * always-on state, which is what a notification does when it lands.
 */
export function LockScreen({
  date,
  time,
  awake,
  children,
}: {
  date: string
  time: string
  awake: boolean
  children?: ReactNode
}) {
  return (
    <div className="absolute inset-0 overflow-hidden">
      {/* Wallpaper: my own shot, Hooker Valley under Aoraki. Cropped to what
          the stage shows: half the sky trimmed so the peaks sit high, and the
          river running down to the notification. Scaled up a touch so it
          still reaches the crop line. */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/articles/raising-adam/wallpaper.jpg"
        alt=""
        className="absolute max-w-none"
        style={{
          width: 458,
          height: "auto",
          left: -28,
          top: -46,
          // Black and white, like the wallpaper on my actual phone.
          filter: "grayscale(1)",
        }}
      />
      {/* The legibility wash iOS lays behind the clock on a bright wallpaper. */}
      <div
        className="absolute inset-x-0 top-0 h-[360px]"
        style={{
          background:
            "linear-gradient(180deg, rgb(0 0 0 / 0.42) 0%, rgb(0 0 0 / 0.28) 45%, transparent 100%)",
        }}
      />

      <div className="absolute inset-x-0 top-[86px] flex flex-col items-center">
        <span className="text-[21px] font-semibold text-white/85">{date}</span>
        <span
          className="-mt-1 text-[104px] leading-[1.05] font-semibold text-white/95 tabular-nums"
          style={{
            letterSpacing: "-0.04em",
            textShadow: "0 2px 18px rgb(0 0 0 / 0.25)",
          }}
        >
          {time}
        </span>
      </div>

      <div
        className="absolute inset-x-[10px] flex flex-col gap-2"
        style={{ bottom: SCREEN.h - VISIBLE + 22 }}
      >
        {children}
      </div>

      {/* Always-on dim, lifted when the screen wakes. */}
      <div
        className="pointer-events-none absolute inset-0 bg-black transition-opacity duration-700"
        style={{ opacity: awake ? 0 : 0.6 }}
      />
    </div>
  )
}

/** A Messages notification: the sender's picture with the app badged on. */
export function Notification({
  from = "Adam",
  when = "now",
  shown,
  children,
}: {
  from?: string
  when?: string
  shown: boolean
  children: ReactNode
}) {
  return (
    <div
      className="flex gap-3 rounded-[24px] px-3.5 py-3"
      style={{
        background: "rgb(28 28 30 / 0.55)",
        backdropFilter: "blur(30px) saturate(180%)",
        WebkitBackdropFilter: "blur(30px) saturate(180%)",
        boxShadow: "inset 0 0.5px 0 rgb(255 255 255 / 0.18)",
        opacity: shown ? 1 : 0,
        transform: shown ? "none" : "translateY(40px) scale(0.94)",
        transition:
          "opacity 320ms ease-out, transform 620ms cubic-bezier(0.25, 1.3, 0.45, 1)",
      }}
    >
      <span className="relative mt-0.5 h-fit">
        <AdamAvatar size={38} />
        <span className="absolute -right-1 -bottom-1 grid size-[18px] place-items-center rounded-[5px] bg-[#34c759] ring-2 ring-[#1c1c1e]">
          <MessageFill size={12} />
        </span>
      </span>
      <span className="flex min-w-0 flex-1 flex-col">
        <span className="flex items-baseline justify-between">
          <span className="text-[15px] font-semibold">{from}</span>
          <span className="text-[13px] text-white/55">{when}</span>
        </span>
        <span className="line-clamp-4 text-[15px] leading-[20px] text-white/95">
          {children}
        </span>
      </span>
    </div>
  )
}
