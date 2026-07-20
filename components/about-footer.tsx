"use client"

import { motion, useReducedMotion } from "framer-motion"

import { staggerContainer, staggerItem } from "@/lib/motion"

const links = [
  { href: "https://github.com/nafisazizir", label: "GitHub" },
  { href: "https://x.com/nafisazizir", label: "X / Twitter" },
  { href: "mailto:hello@nafisazizir.com", label: "Email" },
]

export function AboutFooter() {
  const reduced = useReducedMotion() ?? false
  const item = reduced ? undefined : staggerItem(8)

  return (
    <motion.footer
      initial={reduced ? false : "hidden"}
      whileInView="visible"
      viewport={{ once: true, amount: 0.4 }}
      variants={reduced ? undefined : staggerContainer(0.07, 0.05)}
      className="mt-12 flex flex-col items-center text-center"
    >
      <motion.span
        aria-hidden
        variants={item}
        className="h-px w-15 bg-foreground/15"
      />

      <motion.ul
        variants={item}
        className="mt-12 flex flex-wrap items-center justify-center gap-x-6 gap-y-2"
      >
        {links.map(({ href, label }) => (
          <li key={href}>
            <a
              href={href}
              target={href.startsWith("mailto:") ? undefined : "_blank"}
              rel="noreferrer"
              className="text-[15px] text-foreground underline decoration-foreground/40 underline-offset-4 transition-[text-decoration-color,text-underline-offset] duration-200 hover:decoration-foreground hover:underline-offset-[5px]"
            >
              {label}
            </a>
          </li>
        ))}
      </motion.ul>
    </motion.footer>
  )
}
