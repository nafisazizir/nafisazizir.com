"use client"

import { motion, useReducedMotion } from "framer-motion"

import { track } from "@/lib/analytics/events"
import { GradientShader } from "@/components/shaders/gradient-shader"
import { staggerContainer, staggerItem } from "@/lib/motion"
import { socialLinks } from "@/lib/site"

export function Hero() {
  const reduced = useReducedMotion() ?? false
  const item = reduced ? undefined : staggerItem()

  return (
    <section className="relative h-dvh w-full overflow-hidden bg-background-100">
      <motion.div
        initial={reduced ? false : { opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={
          reduced ? { duration: 0 } : { duration: 1.1, ease: "easeOut" }
        }
        className="absolute inset-0 z-0"
      >
        <GradientShader className="pointer-events-none absolute inset-0" />
      </motion.div>

      <motion.div
        initial={reduced ? false : "hidden"}
        animate="visible"
        variants={reduced ? undefined : staggerContainer(0.12, 0.6)}
        className="absolute inset-0 z-10 flex flex-col justify-end p-6 text-gray-1000 sm:p-8 md:p-12"
      >
        <div className="flex w-full flex-col gap-5 sm:gap-6 lg:flex-row lg:items-end lg:justify-between lg:gap-16">
          <motion.h1
            variants={item}
            className="max-w-[20ch] text-heading-40 text-balance sm:text-heading-48 xl:text-heading-56 2xl:text-heading-72"
          >
            My curiosity usually goes nowhere. Sometimes it becomes software.
          </motion.h1>

          <div className="flex flex-col gap-4 sm:gap-5 lg:items-end">
            <motion.p
              variants={item}
              className="max-w-sm text-copy-14 text-gray-1000 sm:text-copy-16 lg:max-w-lg lg:text-right lg:text-copy-18"
            >
              Currently at{" "}
              <a
                href="https://www.avenue2.au/"
                target="_blank"
                rel="noreferrer"
                onClick={() =>
                  track("outbound link clicked", {
                    href: "https://www.avenue2.au/",
                    label: "Avenue Labs",
                    path: "/",
                  })
                }
                className="underline decoration-gray-900 underline-offset-4 transition-[color,text-decoration-color,text-underline-offset] duration-200 hover:text-gray-1000 hover:decoration-gray-1000 hover:underline-offset-[5px]"
              >
                Avenue Labs
              </a>
              . Voice agents and the AI tooling around them are a few of the
              things I&apos;ve built. Off the clock, always on a side quest,
              chasing the wrong turns.
            </motion.p>

            <motion.ul
              variants={item}
              className="flex flex-wrap items-center gap-x-6 gap-y-2 lg:justify-end"
            >
              {socialLinks.map(({ href, label }) => (
                <li key={href}>
                  <a
                    href={href}
                    target={href.startsWith("mailto:") ? undefined : "_blank"}
                    rel="noreferrer"
                    onClick={() =>
                      track("outbound link clicked", { href, label, path: "/" })
                    }
                    className="text-label-14 text-gray-900 underline decoration-gray-900 underline-offset-4 transition-[color,text-decoration-color,text-underline-offset] duration-200 hover:text-gray-1000 hover:decoration-gray-1000 hover:underline-offset-[5px] sm:text-label-16"
                  >
                    {label}
                  </a>
                </li>
              ))}
            </motion.ul>
          </div>
        </div>
      </motion.div>
    </section>
  )
}
