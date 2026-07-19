"use client"

import { motion, useReducedMotion } from "framer-motion"

import { GradientShader } from "@/components/shaders/gradient-shader"
import { staggerContainer, staggerItem } from "@/lib/motion"

export function Hero() {
  const reduced = useReducedMotion() ?? false
  const item = reduced ? undefined : staggerItem()

  return (
    <section className="relative h-dvh w-full overflow-hidden bg-background">
      <motion.div
        initial={reduced ? false : { opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={
          reduced ? { duration: 0 } : { duration: 1.1, ease: "easeOut" }
        }
        className="absolute inset-0"
      >
        <GradientShader className="absolute inset-0" />
      </motion.div>

      <motion.div
        initial={reduced ? false : "hidden"}
        animate="visible"
        variants={reduced ? undefined : staggerContainer(0.12, 0.6)}
        className="pointer-events-none absolute inset-0 flex flex-col justify-end p-6 text-white sm:p-8 md:p-12"
      >
        <div className="mx-auto flex w-full max-w-[110rem] flex-col gap-5 sm:gap-6 lg:flex-row lg:items-end lg:justify-between lg:gap-16">
          <motion.h1
            variants={item}
            className="max-w-[20ch] text-4xl leading-[1.05] tracking-tighter text-balance sm:text-5xl sm:leading-[1.02] xl:text-6xl 2xl:text-7xl"
          >
            Curious about most things, building a few of them.
          </motion.h1>

          <motion.p
            variants={item}
            className="max-w-sm text-sm leading-snug tracking-tight text-white/90 sm:text-base lg:max-w-sm lg:text-right lg:text-lg"
          >
            Currently at Avenue Labs. Voice agents and the AI tooling around
            them are a few of the things I&apos;ve built. Off the clock I&apos;m
            usually tinkering and poking at whatever just shipped.
          </motion.p>
        </div>
      </motion.div>
    </section>
  )
}
