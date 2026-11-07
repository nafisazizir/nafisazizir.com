"use client"

import { useEffect, useLayoutEffect, useRef, useState } from "react"

import {
  eyePoints,
  HALF,
  solid,
  type Point as Flat,
} from "@/components/article/adam/mini"
import { Stage, useStage } from "@/components/article/adam/stage"
import { cn } from "@/lib/utils"

/**
 * Everything is a trigger, as a map: what wakes Adam on one side, how a run ends
 * on the other, joined by soft hairlines. The diagram holds still and only he
 * moves, looking at a trigger, then at what he does about it.
 */

type Id =
  "me" | "reminder" | "workout" | "email" | "meeting" | "text" | "silent"

const TRIGGERS: { id: Id; title: string; note: string }[] = [
  { id: "me", title: "A text from me", note: "“call me in 5 min”" },
  { id: "reminder", title: "A reminder", note: "One he set himself" },
  { id: "workout", title: "A workout finishing", note: "Webhook events" },
  { id: "email", title: "A new email", note: "Pushed from Gmail" },
  { id: "meeting", title: "A moved meeting", note: "Pushed from Calendar" },
]

const ENDINGS: { id: Id; title: string; note: string }[] = [
  { id: "text", title: "Texts or calls me", note: "Only what needs me" },
  { id: "silent", title: "Stays silent", note: "Everything else" },
]

// What he looks at, in order: a trigger, then what he does about it. Mostly
// nothing, as in the post.
const GAZE: Id[] = [
  "email",
  "silent",
  "workout",
  "silent",
  "meeting",
  "text",
  "reminder",
  "silent",
  "me",
  "text",
]
const TURN = 700
const HOLD = 1300
const STEP = TURN + HOLD
const LOOP = GAZE.length * STEP
// mabot's blink: 150 ms, the lids closing to 0.08 of the eye's height.
const BLINK = 150
// How far he turns: about his contact picture's pose.
const REACH = 0.58
const REST = { x: 0, y: 0.1 }

const ease = (v: number) => {
  const x = Math.min(1, Math.max(0, v))
  return x * x * x * (x * (x * 6 - 15) + 10)
}
const mix = (a: number, b: number, k: number) => a + (b - a) * k

type Point = { x: number; y: number }
type Box = Point & { w: number; h: number }

/** All in the panel's own pixels, so hairlines and type stay their real size. */
function layout(w: number, h: number) {
  if (h > w) return portrait(w, h)

  const size = 124 * Math.min(w / 720, h / 540)
  const adam = { x: w / 2, y: h / 2 }
  const margin = 24 * (w / 720)
  const width = Math.max(168, w * 0.278)
  const rows = h * 0.135
  const height = Math.min(60, rows - 8)
  // The lines meet inside him, so his silhouette covers their ends as he turns.
  const inside = size * 0.3
  const edge = size / 2
  const across = (x: number, y: number, ex: number, ey: number, m: number) =>
    `M${x} ${y}C${m} ${y} ${m} ${ey} ${ex} ${ey}`

  const boxes = new Map<Id, Box>()
  TRIGGERS.forEach(({ id }, i) =>
    boxes.set(id, {
      x: margin,
      y: adam.y + (i - 2) * rows - height / 2,
      w: width,
      h: height,
    })
  )
  ENDINGS.forEach(({ id }, i) =>
    boxes.set(id, {
      x: w - margin - width,
      y: adam.y + (i === 0 ? -1 : 1) * rows * 0.9 - height / 2,
      w: width,
      h: height,
    })
  )

  return {
    size,
    adam,
    boxes,
    notes: true,
    lines: [
      ...TRIGGERS.map(({ id }) => {
        const b = boxes.get(id)!
        const x = b.x + b.w
        const m = (x + adam.x - edge) / 2
        return across(x, b.y + b.h / 2, adam.x - inside, adam.y, m)
      }),
      ...ENDINGS.map(({ id }) => {
        const b = boxes.get(id)!
        const m = (adam.x + edge + b.x) / 2
        return across(adam.x + inside, adam.y, b.x, b.y + b.h / 2, m)
      }),
    ],
  }
}

/** Phones: no room across, so the lines turn down into him and out below. */
function portrait(w: number, h: number) {
  const pad = 16
  const gap = 8
  const cell = (w - pad * 2 - gap) / 2
  const labels = 142
  const row = h * 0.057
  const size = w * 0.27
  const adam = { x: w * 0.6, y: h * 0.47 }
  const inside = size * 0.3
  const below = adam.y + size / 2
  // The narrowest phones have no room for the endings' notes either.
  const endH = w < 320 ? 48 : 64
  const endY = below + 48

  const boxes = new Map<Id, Box>()
  TRIGGERS.forEach(({ id }, i) =>
    boxes.set(id, {
      x: 0,
      y: h * 0.06 + (i - 0.5) * row,
      w: labels,
      h: row,
    })
  )
  ENDINGS.forEach(({ id }, i) =>
    boxes.set(id, {
      x: pad + i * (cell + gap),
      y: endY,
      w: cell,
      h: endH,
    })
  )

  return {
    size,
    adam,
    boxes,
    notes: false,
    lines: [
      ...TRIGGERS.map(({ id }) => {
        const b = boxes.get(id)!
        const y = b.y + b.h / 2
        return `M${b.x + b.w} ${y}C${adam.x} ${y} ${adam.x} ${y} ${adam.x} ${adam.y - inside}`
      }),
      ...ENDINGS.map(({ id }) => {
        const b = boxes.get(id)!
        const x = b.x + b.w / 2
        return `M${adam.x} ${adam.y + inside}L${adam.x} ${below}C${adam.x} ${below + 26} ${x} ${endY - 26} ${x} ${endY}`
      }),
    ],
  }
}

/** The real Adam: white, solid, mabot's eyes. `lid` is 1 open, 0.08 mid-blink. */
function Mascot({
  at,
  size,
  look,
  lid,
}: {
  at: Point
  size: number
  look: Point
  lid: number
}) {
  const { outline, eyes } = solid({
    yaw: look.x * 0.7,
    pitch: -look.y * 0.5,
    tilt: 0.35 * look.x * look.y,
    // A touch less than the head, so his eyes keep clear of the rim.
    eyeX: look.x * 0.8,
    eyeY: look.y * 0.8,
  })
  const unit = size / (2 * HALF)
  const path = (points: Flat[]) =>
    `M${points
      .map(
        ([x, y]) =>
          `${(at.x + x * unit).toFixed(2)} ${(at.y + y * unit).toFixed(2)}`
      )
      .join("L")}Z`
  return (
    <>
      <path d={path(outline)} fill="#fff" />
      <path
        d={eyes.map((eye) => path(eyePoints(eye, lid))).join("")}
        fill="#000"
      />
    </>
  )
}

function useClock(playing: boolean) {
  const [t, setT] = useState(0)
  useEffect(() => {
    if (!playing) return
    let last = performance.now()
    let id = requestAnimationFrame(function tick(now) {
      const dt = Math.max(0, now - last)
      last = now
      setT((v) => (v + dt) % LOOP)
      id = requestAnimationFrame(tick)
    })
    return () => cancelAnimationFrame(id)
  }, [playing])
  return t
}

function Scene({ w, h }: { w: number; h: number }) {
  const { playing, still } = useStage()
  const t = useClock(playing)
  const l = layout(w, h)

  const toward = (id: Id): Point => {
    const b = l.boxes.get(id)!
    const [dx, dy] = [b.x + b.w / 2 - l.adam.x, b.y + b.h / 2 - l.adam.y]
    const far = Math.max(Math.abs(dx), Math.abs(dy)) || 1
    return { x: (dx / far) * REACH, y: (dy / far) * REACH }
  }

  // One gaze eases into the next. He blinks as he turns back to a new trigger.
  const step = Math.floor(t / STEP)
  const ms = t - step * STEP
  const before = toward(GAZE[(step + GAZE.length - 1) % GAZE.length])
  const after = toward(GAZE[step % GAZE.length])
  const turned = ease(ms / TURN)
  const look = still
    ? REST
    : {
        x: mix(before.x, after.x, turned),
        y: mix(before.y, after.y, turned),
      }
  const blinking = !still && step % 2 === 0 && ms < BLINK
  const lid = blinking
    ? Math.max(0.08, 1 - Math.sin((ms / BLINK) * Math.PI))
    : 1

  return (
    <>
      <svg
        width={w}
        height={h}
        aria-hidden
        className="absolute inset-0 text-gray-1000"
      >
        {l.lines.map((d) => (
          <path
            key={d}
            d={d}
            fill="none"
            stroke="currentColor"
            strokeOpacity={0.16}
          />
        ))}
        <Mascot at={l.adam} size={l.size} look={look} lid={lid} />
      </svg>

      {[...TRIGGERS, ...ENDINGS].map(({ id, title, note }) => {
        const b = l.boxes.get(id)!
        const isTrigger = TRIGGERS.some((trigger) => trigger.id === id)
        return (
          <div
            key={id}
            className={cn(
              "absolute flex flex-col justify-center gap-0.5 px-3",
              isTrigger && "items-end text-right",
              !isTrigger && h > w && "items-center text-center",
              // Phones: every pixel left of the label, so it stays on one line.
              isTrigger && h > w && "pl-0"
            )}
            style={{ left: b.x, top: b.y, width: b.w, height: b.h }}
          >
            <span className="text-label-13 text-gray-1000">{title}</span>
            {l.notes || b.h > 50 ? (
              <span className="text-label-12 text-gray-900">{note}</span>
            ) : null}
          </div>
        )
      })}
    </>
  )
}

function Panel() {
  const ref = useRef<HTMLDivElement>(null)
  const [box, setBox] = useState<{ w: number; h: number } | null>(null)

  useLayoutEffect(() => {
    const el = ref.current
    if (!el) return
    const measure = () => setBox({ w: el.clientWidth, h: el.clientHeight })
    measure()
    const ro = new ResizeObserver(measure)
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  return (
    <div
      ref={ref}
      role="img"
      aria-label="Five triggers, a text from me, a reminder, a workout finishing, a new email and a moved meeting, all point at Adam. Adam points at two endings: he texts or calls me when something needs me, and stays silent for everything else."
      className="relative aspect-4/5 w-full overflow-hidden sm:aspect-4/3"
    >
      {box ? <Scene w={box.w} h={box.h} /> : null}
    </div>
  )
}

export function AdamTriggerMap({ caption }: { caption?: React.ReactNode }) {
  return (
    <Stage caption={caption}>
      <Panel />
    </Stage>
  )
}
