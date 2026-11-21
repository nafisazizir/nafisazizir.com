"use client"

import { useSyncExternalStore } from "react"

import { TOC_VARIANTS } from "./registry"

// Which contents variant the page shows while we compare them. `?toc=<id>`
// wins (so a link can pin one), then the last one picked, then the first.
const KEY = "toc-variant"
const listeners = new Set<() => void>()

function read(): string {
  const ids = TOC_VARIANTS.map((v) => v.id)
  const fromUrl = new URLSearchParams(window.location.search).get("toc")
  if (fromUrl && ids.includes(fromUrl)) return fromUrl
  const saved = window.localStorage.getItem(KEY)
  if (saved && ids.includes(saved)) return saved
  return ids[0]
}

export function setTocVariant(id: string) {
  window.localStorage.setItem(KEY, id)
  const url = new URL(window.location.href)
  url.searchParams.set("toc", id)
  window.history.replaceState(window.history.state, "", url)
  listeners.forEach((l) => l())
}

function subscribe(l: () => void) {
  listeners.add(l)
  return () => listeners.delete(l)
}

export function useTocVariant(): string | null {
  return useSyncExternalStore(subscribe, read, () => null)
}
