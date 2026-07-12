"use client"

import { motion, useReducedMotion } from "framer-motion"

import { staggerContainer, staggerItem } from "@/lib/motion"

export function ArticleHeader({
  title,
  date,
  displayDate,
}: {
  title: string
  date: string
  displayDate: string
}) {
  const reduced = useReducedMotion() ?? false
  const item = reduced ? undefined : staggerItem()

  return (
    <motion.header
      initial={reduced ? false : "hidden"}
      animate="visible"
      variants={reduced ? undefined : staggerContainer(0.08, 0.04)}
      className="mb-10"
    >
      <motion.h1 variants={item} style={{ marginBlockStart: 0 }}>
        {title}
      </motion.h1>
      <motion.time
        variants={item}
        dateTime={date}
        className="text-muted-foreground text-sm"
      >
        {displayDate}
      </motion.time>
    </motion.header>
  )
}
