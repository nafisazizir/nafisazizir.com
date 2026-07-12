"use client"

import { motion, useReducedMotion } from "framer-motion"

import { GradientShader } from "@/components/shaders/gradient-shader"

export function Hero() {
  const reduced = useReducedMotion() ?? false

  return (
    <section className="relative h-dvh w-full overflow-hidden bg-background">
      <motion.div
        initial={reduced ? false : { opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={reduced ? { duration: 0 } : { duration: 1.1, ease: "easeOut" }}
        className="absolute inset-0"
      >
        <GradientShader className="absolute inset-0" />
      </motion.div>
    </section>
  )
}
