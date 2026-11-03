"use client"

import { IconBrandGithub } from "@tabler/icons-react"
import {
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type ReactNode,
} from "react"

import {
  DEVICE,
  DEVICE_SHOWN,
  IPhone,
  type Island,
} from "@/components/article/adam/iphone"
import {
  LinkCard,
  Messages,
  type ThreadItem,
} from "@/components/article/adam/messages"
import { LockScreen, Notification } from "@/components/article/adam/screens"
import {
  clock,
  Stage,
  useCounter,
  useStage,
  useTimeline,
} from "@/components/article/adam/stage"

/**
 * The panel is landscape 4:3 (portrait 4:5 on phones). The phone sits
 * centred, as large as fits with a little air above it, and runs off the
 * bottom: the crop line, where the compose bar sits, is the panel's edge.
 */
function PhoneStage({
  time,
  island,
  children,
}: {
  time: string | null
  island?: Island
  children: ReactNode
}) {
  const ref = useRef<HTMLDivElement>(null)
  const [box, setBox] = useState<{ w: number; h: number } | null>(null)

  useIsoLayoutEffect(() => {
    const el = ref.current
    if (!el) return
    const measure = () => setBox({ w: el.clientWidth, h: el.clientHeight })
    measure()
    const ro = new ResizeObserver(measure)
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  const scale = box
    ? Math.min((box.h * 0.92) / DEVICE_SHOWN, (box.w * 0.9) / DEVICE.w)
    : 0

  return (
    <div
      ref={ref}
      className="relative aspect-4/5 w-full overflow-hidden sm:aspect-4/3"
    >
      {box ? (
        <div
          className="absolute"
          style={{
            left: (box.w - DEVICE.w * scale) / 2,
            top: box.h - DEVICE_SHOWN * scale,
            transform: `scale(${scale})`,
            transformOrigin: "top left",
          }}
        >
          <IPhone time={time} island={island}>
            {children}
          </IPhone>
        </div>
      ) : null}
    </div>
  )
}

const useIsoLayoutEffect =
  typeof window === "undefined" ? useEffect : useLayoutEffect

const at = (step: number, n: number) => step >= n

/* ------------------------------------------------------------------------ */

// 1 text · 2 delivered · 3 typing · 4 reply · 5 reply · 6 five minutes on, the
// island grows into his call · 7 accept pressed · 8 on the call
// The first beat leaves a moment to read the earlier nudge.
const PARTY = [1600, 2300, 3100, 4700, 5500, 7600, 10400, 10700] as const

function PartyCallPhone() {
  const step = useTimeline(PARTY, 3800)
  const onCall = at(step, 8)
  const elapsed = useCounter(onCall)

  const items: ThreadItem[] = [
    // Earlier that evening, Adam off the calendar, unprompted.
    { id: "t0", kind: "time", day: "Today", time: "6:30 PM", shown: true },
    {
      id: "h0",
      kind: "text",
      from: "adam",
      text: "yo, heads up, you’ve got the party tonight. try not to have too much fun",
      shown: true,
    },
    {
      id: "h1",
      kind: "text",
      from: "me",
      text: "lol no promises",
      shown: true,
    },
    {
      id: "t1",
      kind: "time",
      day: "Today",
      time: "11:42 PM",
      shown: at(step, 1),
    },
    {
      id: "m1",
      kind: "text",
      from: "me",
      text: "call me in 5 min",
      shown: at(step, 1),
    },
    {
      id: "d1",
      kind: "status",
      text: "Delivered",
      shown: at(step, 2) && !at(step, 4),
    },
    { id: "y1", kind: "typing", shown: step === 3 },
    {
      id: "a1",
      kind: "text",
      from: "adam",
      text: "Ringing you at 11:47.",
      shown: at(step, 4),
    },
    {
      id: "a2",
      kind: "text",
      from: "adam",
      text: "Act surprised.",
      shown: at(step, 5),
    },
  ]

  const island: Island = onCall
    ? { kind: "call", elapsed: clock(elapsed) }
    : at(step, 6)
      ? { kind: "incoming", name: "Adam", pressed: step === 7 }
      : { kind: "idle" }

  return (
    <PhoneStage time={at(step, 6) ? "11:47" : "11:42"} island={island}>
      <Messages items={items} />
    </PhoneStage>
  )
}

export function AdamPartyCall({ caption }: { caption?: ReactNode }) {
  return (
    <Stage caption={caption}>
      <PartyCallPhone />
    </Stage>
  )
}

/* ------------------------------------------------------------------------ */

function DebriefPhone() {
  const step = useTimeline([900], 4600)
  const woke = at(step, 1)
  return (
    <PhoneStage time={null}>
      <LockScreen date="Wednesday, 28 October" time="7:12" awake={woke}>
        <Notification shown={woke}>
          Easy 8k ran 15 s/km slow. You slept 4h 40m and HRV is 18% under
          baseline, so it’s fatigue, not fitness. Moved Thursday’s intervals to
          Saturday.
        </Notification>
      </LockScreen>
    </PhoneStage>
  )
}

export function AdamDebrief({ caption }: { caption?: ReactNode }) {
  return (
    <Stage caption={caption}>
      <DebriefPhone />
    </Stage>
  )
}

/* ------------------------------------------------------------------------ */

// 1 typing · 2 the three photos · 3 his read on the fabrics. I answer on
// the call, so the thread is all Adam.
const SHIRT = [1100, 2700, 3700] as const

// The three linen(ish) shirts he found, as the stores photograph them.
const SHIRTS = [
  {
    src: "/articles/raising-adam/shirt-venroy.jpg",
    alt: "Venroy linen camp collar shirt",
    focus: "50% 38%",
  },
  {
    src: "/articles/raising-adam/shirt-assembly-label.jpg",
    alt: "Assembly Label Laine short sleeve shirt",
    focus: "50% 36%",
  },
  {
    src: "/articles/raising-adam/shirt-industrie.jpg",
    alt: "Industrie Lusso linen short sleeve shirt",
    focus: "50% 40%",
  },
] as const

function ShirtPhone() {
  const { playing } = useStage()
  const step = useTimeline(SHIRT, 4200)
  const elapsed = useCounter(playing, 74)

  const items: ThreadItem[] = [
    { id: "t0", kind: "time", day: "Today", time: "8:12 AM", shown: true },
    { id: "y1", kind: "typing", shown: step === 1 },
    {
      id: "p1",
      kind: "media",
      from: "adam",
      width: 270,
      shown: at(step, 2),
      children: (
        <div className="grid h-[150px] grid-cols-3 gap-[2px] bg-black">
          {SHIRTS.map((shirt) => (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              key={shirt.src}
              src={shirt.src}
              alt={shirt.alt}
              className="size-full object-cover"
              style={{ objectPosition: shirt.focus }}
            />
          ))}
        </div>
      ),
    },
    {
      id: "a1",
      kind: "text",
      from: "adam",
      text: "left to right: Venroy, Assembly Label, Industrie. heads up, Assembly’s isn’t linen, it’s a blend.",
      shown: at(step, 3),
    },
  ]

  return (
    <PhoneStage time="8:13" island={{ kind: "call", elapsed: clock(elapsed) }}>
      <Messages items={items} />
    </PhoneStage>
  )
}

export function AdamShirtCall({ caption }: { caption?: ReactNode }) {
  return (
    <Stage caption={caption}>
      <ShirtPhone />
    </Stage>
  )
}

/* ------------------------------------------------------------------------ */

// A real thread, tidied: a Google account won't connect, Devin fixes it, I
// merge it from the thread, and the same ask works.
// 1 typing · 2 it fails · 3 me: get Devin · 4 typing · 5 on it · 6 session
// link · 7 later: found it · 8 the PR · 9 merge it · 10 typing · 11 merged
// · 12 me again · 13 typing · 14 it works · 15 link
const FIX = [
  700, 1900, 3300, 3900, 5100, 5600, 7400, 8000, 9400, 9900, 11000, 12400,
  13000, 14000, 14500,
] as const

function FixPhone() {
  const step = useTimeline(FIX, 4200)
  const items: ThreadItem[] = [
    { id: "t0", kind: "time", day: "Today", time: "7:51 PM", shown: true },
    {
      id: "m0",
      kind: "text",
      from: "me",
      text: "connect my junk gmail",
      shown: true,
    },
    { id: "y0", kind: "typing", shown: step === 1 },
    {
      id: "a0",
      kind: "text",
      from: "adam",
      text: "couldn’t generate the sign-in link. the connection failed on my end.",
      shown: at(step, 2),
    },
    {
      id: "m1",
      kind: "text",
      from: "me",
      text: "can u spin up devin to fix it pls",
      shown: at(step, 3),
    },
    { id: "y1", kind: "typing", shown: step === 4 },
    {
      id: "a1",
      kind: "text",
      from: "adam",
      text: "spun Devin up to track down the missing Google connector.",
      shown: at(step, 5),
    },
    {
      id: "l1",
      kind: "media",
      from: "adam",
      width: 240,
      shown: at(step, 6),
      children: (
        <LinkCard
          icon={<DevinMark size={26} />}
          title="The AI Software Engineer"
          domain="app.devin.ai"
        />
      ),
    },
    {
      id: "t1",
      kind: "time",
      day: "Today",
      time: "7:58 PM",
      shown: at(step, 7),
    },
    {
      id: "a2",
      kind: "text",
      from: "adam",
      text: "found it, the Google connector was misconfigured. live setup’s fixed, and the code fix is up for review:",
      shown: at(step, 7),
    },
    {
      id: "l2",
      kind: "media",
      from: "adam",
      width: 276,
      shown: at(step, 8),
      children: (
        <LinkCard
          image={<PullRequestCard />}
          title="fix: point GOOGLE_CONNECTOR at a connector id or UID, and drop a new Google name when no link can be made"
          domain="github.com"
        />
      ),
    },
    {
      id: "m2",
      kind: "text",
      from: "me",
      text: "can u merge it",
      shown: at(step, 9),
    },
    { id: "y2", kind: "typing", shown: step === 10 },
    {
      id: "a4",
      kind: "text",
      from: "adam",
      text: "merged. live in a sec.",
      shown: at(step, 11),
    },
    {
      id: "m4",
      kind: "text",
      from: "me",
      text: "connect my junk gmail",
      shown: at(step, 12),
    },
    { id: "y4", kind: "typing", shown: step === 13 },
    {
      id: "a5",
      kind: "text",
      from: "adam",
      text: "here you go",
      shown: at(step, 14),
    },
    {
      id: "l5",
      kind: "media",
      from: "adam",
      width: 250,
      shown: at(step, 15),
      children: (
        <LinkCard
          title="Sign in – Google Accounts"
          domain="accounts.google.com"
        />
      ),
    },
  ]

  return (
    <PhoneStage time={at(step, 7) ? "7:58" : "7:51"}>
      <Messages items={items} />
    </PhoneStage>
  )
}

export function AdamFix({ caption }: { caption?: ReactNode }) {
  return (
    <Stage caption={caption}>
      <FixPhone />
    </Stage>
  )
}

/** Devin's mark, roughly: three hexagons in a cluster. */
function DevinMark({ size = 24 }: { size?: number }) {
  const hex = (cx: number, cy: number) => {
    const r = 4.6
    const pts = Array.from({ length: 6 }, (_, k) => {
      const a = (Math.PI / 3) * k
      return `${(cx + r * Math.cos(a)).toFixed(2)},${(cy + r * Math.sin(a)).toFixed(2)}`
    })
    return (
      <polygon
        key={`${cx}-${cy}`}
        points={pts.join(" ")}
        strokeLinejoin="round"
      />
    )
  }
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="#000"
      stroke="#000"
      strokeWidth={1.4}
      aria-hidden
    >
      {hex(7.6, 6.6)}
      {hex(16, 11.6)}
      {hex(7.6, 16.8)}
    </svg>
  )
}

/** The social card GitHub renders for this pull request. */
function PullRequestCard() {
  return (
    <div className="flex flex-col bg-white text-[#1f2328]">
      <div className="flex flex-col gap-2 px-4 pt-3.5 pb-3">
        <div className="flex items-start justify-between gap-3">
          <div className="flex min-w-0 flex-col gap-1">
            <span className="text-[9.5px] text-[#59636e]">
              nafisazizir/adam
            </span>
            <span
              className="line-clamp-3 text-[16px] leading-[19px] font-bold"
              style={{ letterSpacing: "-0.01em" }}
            >
              <span className="font-normal text-[#59636e]">#40</span> fix: point
              GOOGLE_CONNECTOR at a connector id or UID, and drop a new Google
              name when no link can be made
            </span>
          </div>
          <span className="shrink-0">
            <DevinMark size={30} />
          </span>
        </div>
        <div className="flex items-center gap-2 text-[8.5px] text-[#59636e]">
          <span>2 comments</span>
          <span>0 reviews</span>
          <span>6 files</span>
          <span className="font-semibold">
            <span className="text-[#1a7f37]">+49</span>{" "}
            <span className="text-[#d1242f]">−10</span>
          </span>
          <span className="flex gap-[1.5px]">
            {[
              "#1a7f37",
              "#1a7f37",
              "#1a7f37",
              "#1a7f37",
              "#d1242f",
              "#d0d7de",
            ].map((c, i) => (
              <span key={i} className="size-[5px]" style={{ background: c }} />
            ))}
          </span>
        </div>
        <div className="flex items-center gap-1.5 text-[8.5px] whitespace-nowrap text-[#59636e]">
          <span className="shrink-0">
            <DevinMark size={10} />
          </span>
          <span className="shrink-0 font-semibold text-[#1f2328]">
            devin-ai-integration
          </span>
          <span className="min-w-0 truncate">
            • October 18, 2026 · 1 commit
          </span>
          <IconBrandGithub
            size={13}
            className="ml-auto shrink-0 text-[#59636e]"
          />
        </div>
      </div>
      <div className="h-[5px] bg-[#4a7fd1]" />
    </div>
  )
}

/* ------------------------------------------------------------------------ */
