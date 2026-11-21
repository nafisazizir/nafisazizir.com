"use client"

import { useSyncExternalStore } from "react"

import { TOC_VARIANTS } from "./registry"

// Which contents variant the page shows while we compare them. `?toc=<id>`
// wins (so a link can pin one), then the last one picked, then the first.
const KEY = "toc-variant"
const listeners = new Set<() => void>()

// Storage can throw where the browser blocks it; the pick then lives only in
// the URL.
function load(): string | null {
  try {
    return window.localStorage.getItem(KEY)
  } catch {
    return null
  }
}

function save(id: string) {
  try {
    save(id)
  } catch {}
}

function read(): string {
  const ids = TOC_VARIANTS.map((v) => v.id)
  const fromUrl = new URLSearchParams(window.location.search).get("toc")
  if (fromUrl && ids.includes(fromUrl)) return fromUrl
  const saved = load()
  if (saved && ids.includes(saved)) return saved
  return ids[0]
}

export function setTocVariant(id: string) {
  save(id)
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
