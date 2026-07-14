import { duration, type Layer, type SoundSpec } from "./specs"
import { type Voice, voiceFor } from "./voice"

interface Settings {
  enabled: boolean
  volume: number

  respectReducedMotion: boolean
}

const STORAGE_KEY = "nafisazizir-audio"
const isBrowser = typeof window !== "undefined"

let settings: Settings = {
  enabled: true,
  volume: 0.3,
  respectReducedMotion: true,
}
let loaded = false
let snapshot: Settings = settings
const listeners = new Set<() => void>()

function load() {
  if (loaded || !isBrowser) return
  loaded = true
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (raw) settings = { ...settings, ...JSON.parse(raw) }
  } catch {}
  snapshot = { ...settings }
}

function save() {
  snapshot = { ...settings }
  for (const fn of listeners) fn()
  if (!isBrowser) return
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(settings))
  } catch {}
}

export function setEnabled(enabled: boolean) {
  load()
  settings.enabled = enabled
  save()
}

export function setVolume(volume: number) {
  load()
  settings.volume = Math.min(Math.max(volume, 0), 1)
  if (master) master.gain.value = settings.volume
  save()
}

export function setRespectReducedMotion(respect: boolean) {
  load()
  settings.respectReducedMotion = respect
  save()
}

export function getSettings(): Settings {
  return snapshot
}

export function hydrate() {
  const before = snapshot
  load()
  if (
    snapshot.enabled !== before.enabled ||
    snapshot.volume !== before.volume ||
    snapshot.respectReducedMotion !== before.respectReducedMotion
  ) {
    for (const fn of listeners) fn()
  }
}

let currentVoice: Voice | null = null

export function setVoice(voice: string | number | Voice | null) {
  currentVoice =
    voice == null ? null : typeof voice === "object" ? voice : voiceFor(voice)
  for (const fn of listeners) fn()
}

export function getVoice(): Voice | null {
  return currentVoice
}

export function subscribe(fn: () => void): () => void {
  listeners.add(fn)
  return () => listeners.delete(fn)
}

let ctx: AudioContext | null = null
let master: GainNode | null = null
let noiseBuffer: AudioBuffer | null = null

function ensure(): { ctx: AudioContext; master: GainNode } | null {
  if (!isBrowser || typeof AudioContext === "undefined") return null
  if (!ctx) {
    ctx = new AudioContext()
    master = ctx.createGain()
    master.gain.value = getSettings().volume
    master.connect(ctx.destination)
  }
  if (ctx.state === "suspended") void ctx.resume()

  return { ctx, master: master! }
}

function whiteNoise(ctx: AudioContext): AudioBuffer {
  if (noiseBuffer) return noiseBuffer
  const length = Math.ceil(ctx.sampleRate * 0.25)
  noiseBuffer = ctx.createBuffer(1, length, ctx.sampleRate)
  const data = noiseBuffer.getChannelData(0)
  for (let i = 0; i < length; i++) data[i] = Math.random() * 2 - 1
  return noiseBuffer
}

const ATTACK = 0.004
const FLOOR = 0.001

function scheduleLayer(
  ctx: AudioContext,
  master: GainNode,
  layer: Layer,
  t0: number
) {
  const start = t0 + layer.at
  const end = start + layer.duration

  const gain = ctx.createGain()
  gain.gain.setValueAtTime(FLOOR, start)
  gain.gain.linearRampToValueAtTime(layer.peak, start + ATTACK)
  gain.gain.exponentialRampToValueAtTime(FLOOR, end)
  gain.connect(master)

  let source: AudioScheduledSourceNode
  const extras: AudioNode[] = []
  if (layer.kind === "tone") {
    const osc = ctx.createOscillator()
    osc.type = layer.wave
    osc.frequency.setValueAtTime(layer.from, start)
    if (layer.to !== layer.from) {
      osc.frequency.exponentialRampToValueAtTime(layer.to, end)
    }
    osc.connect(gain)
    source = osc
  } else if (layer.kind === "fm") {
    const carrier = ctx.createOscillator()
    carrier.type = "sine"
    carrier.frequency.setValueAtTime(layer.from, start)
    if (layer.to !== layer.from) {
      carrier.frequency.exponentialRampToValueAtTime(layer.to, end)
    }
    const mod = ctx.createOscillator()
    mod.type = "sine"
    mod.frequency.setValueAtTime(layer.from * layer.ratio, start)
    const depth = ctx.createGain()
    const d0 = Math.max(layer.index * layer.from, 1)
    depth.gain.setValueAtTime(d0, start)
    depth.gain.exponentialRampToValueAtTime(Math.max(d0 * 0.03, 0.5), end)
    mod.connect(depth)
    depth.connect(carrier.frequency)
    mod.start(start)
    mod.stop(end + 0.01)
    carrier.connect(gain)
    extras.push(mod, depth)
    source = carrier
  } else {
    const noise = ctx.createBufferSource()
    noise.buffer = whiteNoise(ctx)
    noise.loop = true
    const filter = ctx.createBiquadFilter()
    filter.type = "bandpass"
    filter.Q.value = layer.q
    filter.frequency.setValueAtTime(layer.from, start)
    if (layer.to !== layer.from) {
      filter.frequency.exponentialRampToValueAtTime(layer.to, end)
    }
    noise.connect(filter)
    filter.connect(gain)
    extras.push(filter)
    source = noise
  }

  source.start(start)
  source.stop(end + 0.01)
  source.onended = () => {
    source.disconnect()
    for (const n of extras) n.disconnect()
    gain.disconnect()
  }
}

export function play(spec: SoundSpec): void {
  load()
  const s = getSettings()
  if (!s.enabled || s.volume <= 0) return
  if (
    s.respectReducedMotion &&
    isBrowser &&
    window.matchMedia?.("(prefers-reduced-motion: reduce)").matches
  ) {
    return
  }
  const audio = ensure()
  if (!audio) return
  const t0 = audio.ctx.currentTime + 0.001
  for (const layer of spec.layers) {
    scheduleLayer(audio.ctx, audio.master, layer, t0)
  }
}

export { duration }
