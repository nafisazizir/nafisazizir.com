"use client"

import type { CSSProperties, ReactNode } from "react"

import { AdamAvatar } from "@/components/article/adam/avatar"
import {
  ChevronLeft,
  ChevronRight,
  Mic,
  Plus,
  VideoFill,
} from "@/components/article/adam/icons"
import { VISIBLE } from "@/components/article/adam/iphone"

type From = "me" | "adam"

export type ThreadItem = { id: string; shown: boolean } & (
  | { kind: "time"; day: string; time: string }
  | { kind: "text"; from: From; text: ReactNode }
  | { kind: "media"; from: From; width: number; children: ReactNode }
  | { kind: "typing" }
  | { kind: "status"; text: string }
)

const glass: CSSProperties = {
  background: "rgb(58 58 60 / 0.55)",
  backdropFilter: "blur(18px) saturate(160%)",
  WebkitBackdropFilter: "blur(18px) saturate(160%)",
  boxShadow:
    "inset 0 0.5px 0 rgb(255 255 255 / 0.22), inset 0 0 0 0.5px rgb(255 255 255 / 0.08)",
}

/**
 * Messages, dark mode, iOS 26: the floating glass header, the thread pinned
 * to the bottom, the glass compose bar. Laid out in the part of the screen
 * the stage shows, with the compose bar on the crop line the way Apple's
 * support pages do it. Items are all rendered up front and
 * open in place when `shown`, so a new bubble pushes the thread up the way
 * Messages does, without measuring anything.
 */
export function Messages({
  items,
  contact = "Adam",
}: {
  items: ThreadItem[]
  contact?: string
}) {
  const senderOf = (i: ThreadItem): From | null =>
    i.kind === "text" || i.kind === "media"
      ? i.from
      : i.kind === "typing"
        ? "adam"
        : null

  return (
    <div className="absolute inset-0 bg-black">
      {/* Thread */}
      <div
        className="absolute inset-x-0 top-0 flex flex-col justify-end overflow-hidden"
        style={{ height: VISIBLE, paddingBottom: 88, paddingInline: 18 }}
      >
        {items.map((item, i) => {
          const from = senderOf(item)
          // Tail on the last of a run of bubbles from one sender; a bubble
          // right under one from the same sender sits tight against it.
          const after = items.slice(i + 1).find((x) => x.shown)
          const before = items.slice(0, i).findLast((x) => x.shown)
          const tail = from !== null && !(after && senderOf(after) === from)
          const grouped = from !== null && before && senderOf(before) === from
          const gap =
            item.kind === "time"
              ? 18
              : item.kind === "status"
                ? 3
                : grouped
                  ? 2
                  : 10

          return (
            <Row key={item.id} shown={item.shown} gap={gap} from={from}>
              {item.kind === "time" ? (
                <p className="pb-1 text-center text-[12px] font-medium text-[#8e8e93]">
                  <span className="font-semibold">{item.day}</span> {item.time}
                </p>
              ) : item.kind === "status" ? (
                <p className="pr-1 text-right text-[12px] font-medium text-[#8e8e93]">
                  {item.text}
                </p>
              ) : item.kind === "typing" ? (
                <TypingBubble />
              ) : item.kind === "media" ? (
                <div
                  className="adam-bubble"
                  data-from={item.from}
                  data-media
                  style={{ width: item.width, maxWidth: item.width }}
                >
                  {item.children}
                </div>
              ) : (
                <div
                  className="adam-bubble"
                  data-from={item.from}
                  data-tail={tail ? "" : undefined}
                >
                  {item.text}
                </div>
              )}
            </Row>
          )
        })}
      </div>

      {/* Header: the thread blurs and darkens as it slides under the
          floating glass controls. */}
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-[190px]"
        style={{
          backdropFilter: "blur(14px)",
          WebkitBackdropFilter: "blur(14px)",
          maskImage: "linear-gradient(180deg, #000 55%, transparent 100%)",
          WebkitMaskImage:
            "linear-gradient(180deg, #000 55%, transparent 100%)",
        }}
      />
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-[190px]"
        style={{
          background:
            "linear-gradient(180deg, #000 0%, rgb(0 0 0 / 0.92) 40%, rgb(0 0 0 / 0.55) 70%, transparent 100%)",
        }}
      />
      <div className="absolute inset-x-0 top-[60px] flex items-start justify-between px-4">
        <span
          className="grid size-[44px] place-items-center rounded-full"
          style={glass}
        >
          <ChevronLeft size={22} className="-ml-0.5" />
        </span>
        <span className="flex flex-col items-center">
          <AdamAvatar size={56} />
          <span
            className="-mt-1.5 flex items-center gap-0.5 rounded-full px-2.5 py-[3px] text-[12px] font-semibold"
            style={glass}
          >
            {contact}
            <ChevronRight size={10} className="opacity-60" />
          </span>
        </span>
        <span
          className="grid size-[44px] place-items-center rounded-full"
          style={glass}
        >
          <VideoFill size={22} />
        </span>
      </div>

      {/* Compose bar */}
      <div
        className="absolute inset-x-0 flex items-center gap-2.5 px-4"
        style={{ top: VISIBLE - 30 - 40 }}
      >
        <span
          className="grid size-[40px] shrink-0 place-items-center rounded-full"
          style={glass}
        >
          <Plus size={22} />
        </span>
        <span
          className="flex h-[40px] flex-1 items-center justify-between rounded-full pr-3 pl-4 text-[17px] text-[#8e8e93]"
          style={glass}
        >
          iMessage
          <Mic size={21} />
        </span>
      </div>
    </div>
  )
}

/**
 * One line of the thread. It opens from zero height (a 0fr → 1fr grid row)
 * while the bubble inside pops from its tail corner.
 */
function Row({
  shown,
  gap,
  from,
  children,
}: {
  shown: boolean
  gap: number
  from: From | null
  children: ReactNode
}) {
  return (
    <div
      className="grid"
      style={{
        gridTemplateRows: shown ? "1fr" : "0fr",
        transition: "grid-template-rows 380ms cubic-bezier(0.25, 1, 0.4, 1)",
      }}
    >
      <div className="min-h-0 overflow-hidden" style={{ marginInline: -18 }}>
        <div
          className="flex flex-col"
          style={{
            paddingTop: gap,
            paddingInline: 18,
            opacity: shown ? 1 : 0,
            transform: shown ? "none" : "scale(0.88) translateY(10px)",
            transformOrigin:
              from === "me"
                ? "100% 100%"
                : from === "adam"
                  ? "0% 100%"
                  : "50% 100%",
            transition:
              "opacity 260ms ease-out, transform 460ms cubic-bezier(0.3, 1.4, 0.5, 1)",
          }}
        >
          {children}
        </div>
      </div>
    </div>
  )
}

function TypingBubble() {
  return (
    <div className="relative self-start">
      <div className="flex h-[38px] items-center gap-[5px] rounded-[19px] bg-[#262628] px-[14px]">
        <span className="adam-typing-dot" />
        <span className="adam-typing-dot" />
        <span className="adam-typing-dot" />
      </div>
      <span className="absolute -bottom-[1px] -left-[1px] size-[11px] rounded-full bg-[#262628]" />
      <span className="absolute -bottom-[7px] -left-[6px] size-[6px] rounded-full bg-[#262628]" />
    </div>
  )
}

/**
 * A link, the way Messages unfurls one: image on top, then title and domain
 * on a light footer. Without an image it's the compact card, with the
 * site's icon on the right (or a chevron when there's none).
 */
export function LinkCard({
  image,
  icon,
  title,
  domain,
}: {
  image?: ReactNode
  icon?: ReactNode
  title: string
  domain: string
}) {
  return (
    <div className="flex flex-col">
      {image}
      <div className="flex items-center gap-3 bg-[#e3e3e8] px-3.5 pt-2.5 pb-3 text-black">
        <span className="flex min-w-0 flex-1 flex-col gap-0.5">
          <span className="line-clamp-3 text-[15px] leading-[19px] font-semibold">
            {title}
          </span>
          <span className="text-[13px] text-[#6c6c70]">{domain}</span>
        </span>
        {image ? null : icon ? (
          <span className="grid size-[42px] shrink-0 place-items-center rounded-[9px] bg-white">
            {icon}
          </span>
        ) : (
          <ChevronRight size={14} className="shrink-0 text-[#6c6c70]" />
        )}
      </div>
    </div>
  )
}
