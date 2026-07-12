"use client"

import { motion, useReducedMotion } from "framer-motion"
import Link from "next/link"

import { staggerContainer, staggerItem } from "@/lib/motion"

export function AboutContent() {
  const reduced = useReducedMotion() ?? false
  const item = reduced ? undefined : staggerItem()

  return (
    <motion.article
      initial={reduced ? false : "hidden"}
      animate="visible"
      variants={reduced ? undefined : staggerContainer(0.09, 0.05)}
      className="typeset typeset-article"
    >
      <motion.p variants={item}>
        I&apos;m Nafis, a software engineer based in Brisbane, Australia. These
        days I spend most of my time building software, and the rest of it
        outdoors.
      </motion.p>

      <motion.p variants={item}>
        I work at a startup where I build AI agent systems. Mostly voice and
        call agents, living deep in TypeScript and the full-stack tooling around
        it. On the side I build developer tools at the intersection of AI and
        productivity: small, sharp things that remove friction from the way I
        actually work. A CLI for indexing agent skills into passive context. An
        SDK for voice call agents. A personal MCP server that turns my own
        training data into something an agent can reason about. I like tools
        that are opinionated, fast, and genuinely useful to the person who made
        them first.
      </motion.p>

      <motion.p variants={item}>
        I studied computer science through a joint degree between the University
        of Queensland and the University of Indonesia, majoring in data science,
        with a semester on exchange at the National University of Singapore.
        Along the way I won a few hackathons, including NASA Space Apps. Taught
        machine learning, and shipped tools that ended up serving thousands of
        people. That habit stuck. I still learn fastest by building the thing
        and putting it in front of someone.
      </motion.p>

      <motion.p variants={item}>
        You can find what I&apos;ve built in{" "}
        <Link href="/projects">projects</Link>, what I&apos;ve been thinking
        about in the <Link href="/blogs">blog</Link>, my code on{" "}
        <a href="https://github.com/nafisazizir" target="_blank" rel="noreferrer">
          GitHub
        </a>
        , and the occasional note on{" "}
        <a href="https://x.com/nafisazizir" target="_blank" rel="noreferrer">
          X
        </a>
        . Or just say hi at{" "}
        <a href="mailto:hello@nafisazizi.com">hello@nafisazizi.com</a>.
      </motion.p>
    </motion.article>
  )
}
