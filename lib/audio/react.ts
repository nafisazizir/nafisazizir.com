"use client"

import { useEffect, useSyncExternalStore } from "react"
import {
  getSettings,
  hydrate,
  setEnabled,
  setRespectReducedMotion,
  setVolume,
  subscribe,
} from "./engine"

const serverSnapshot = {
  enabled: true,
  volume: 0.3,
  respectReducedMotion: true,
}

export function useAudioSettings() {
  const settings = useSyncExternalStore(
    subscribe,
    getSettings,
    () => serverSnapshot
  )
  useEffect(() => {
    hydrate()
  }, [])
  return { ...settings, setEnabled, setVolume, setRespectReducedMotion }
}
