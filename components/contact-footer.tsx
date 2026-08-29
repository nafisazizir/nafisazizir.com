"use client"

import { motion, useReducedMotion } from "framer-motion"
import { usePathname } from "next/navigation"

import { track } from "@/lib/analytics/events"
import { staggerContainer, staggerItem } from "@/lib/motion"
import { socialLinks } from "@/lib/site"
import { cn } from "@/lib/utils"

export function ContactFooter({ className }: { className?: string }) {
  const reduced = useReducedMotion() ?? false
  const item = reduced ? undefined : staggerItem(8)
  const pathname = usePathname()

  return (
    <motion.footer
      initial={reduced ? false : "hidden"}
      whileInView="visible"
      viewport={{ once: true, amount: 0.4 }}
      variants={reduced ? undefined : staggerContainer(0.07, 0.05)}
      className={cn("mt-12 flex flex-col items-center text-center", className)}
    >
      <motion.span
        aria-hidden
        variants={item}
        className="h-px w-15 bg-gray-alpha-400"
      />

      <motion.ul
        variants={item}
        className="mt-12 flex flex-wrap items-center justify-center gap-x-6 gap-y-2"
      >
        {socialLinks.map(({ href, label }) => (
          <li key={href}>
            <a
              href={href}
              target={href.startsWith("mailto:") ? undefined : "_blank"}
              rel="noreferrer"
              onClick={() =>
                track("outbound link clicked", { href, label, path: pathname })
              }
              className="text-[15px] text-gray-1000 underline decoration-gray-900 underline-offset-4 transition-[text-decoration-color,text-underline-offset] duration-200 hover:decoration-gray-1000 hover:underline-offset-[5px]"
            >
              {label}
            </a>
          </li>
        ))}
      </motion.ul>
    </motion.footer>
  )
}
