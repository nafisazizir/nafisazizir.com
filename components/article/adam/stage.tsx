"use client"

import { useInView, useReducedMotion } from "framer-motion"
import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react"

import { cn } from "@/lib/utils"

interface StageState {
  /** On screen and motion allowed: timelines run. */
  playing: boolean
  /** Reduced motion: figures render their finished frame, still. */
  still: boolean
}

const StageContext = createContext<StageState>({ playing: false, still: false })

export const useStage = () => useContext(StageContext)

/**
 * The panel a figure sits in, after the x.ai post: a dark rounded stage with
 * the UI floating in it and a caption under it.
 */
export function Stage({
  caption,
  className,
  children,
}: {
  caption?: ReactNode
  className?: string
  children: ReactNode
}) {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { amount: 0.35 })
  const still = useReducedMotion() ?? false

  return (
    <figure>
      <div
        ref={ref}
        data-not-typeset
        className={cn(
          "relative isolate overflow-hidden bg-gray-100",
          className
        )}
      >
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 -z-10 opacity-[0.35]"
          style={{
            backgroundImage:
              "radial-gradient(rgb(255 255 255 / 0.10) 1px, transparent 1px)",
            backgroundSize: "18px 18px",
            maskImage:
              "radial-gradient(70% 70% at 50% 50%, black, transparent 85%)",
          }}
        />
        <StageContext.Provider value={{ playing: inView && !still, still }}>
          {children}
        </StageContext.Provider>
      </div>
      {caption ? <figcaption>{caption}</figcaption> : null}
    </figure>
  )
}

/**
 * A scripted sequence: `times` are the ms (from the start) at which each
 * step lands. Returns how many steps have landed. Runs while the stage is
 * playing, holds where it is when it scrolls away, and loops after `rest` ms
 * on the last frame. Reduced motion jumps straight to the end.
 */
export function useTimeline(times: readonly number[], rest = 3200) {
  const { playing, still } = useStage()
  const [step, setStep] = useState(0)
  const end = times.length

  useEffect(() => {
    if (!playing) return
    const delay =
      step < end ? times[step] - (step > 0 ? times[step - 1] : 0) : rest
    const id = setTimeout(() => setStep(step < end ? step + 1 : 0), delay)
    return () => clearTimeout(id)
  }, [playing, step, end, times, rest])

  return still ? end : step
}

/** Seconds counted up while `running`, from `from`. */
export function useCounter(running: boolean, from = 0) {
  const [n, setN] = useState(0)
  useEffect(() => {
    if (!running) return
    const t0 = Date.now()
    const id = setInterval(
      () => setN(Math.floor((Date.now() - t0) / 1000)),
      250
    )
    return () => {
      clearInterval(id)
      setN(0)
    }
  }, [running])
  return running ? from + n : from
}

export const clock = (s: number) =>
  `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`
