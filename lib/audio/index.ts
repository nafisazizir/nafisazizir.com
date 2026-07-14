import {
  close as closeSpec,
  confirm as confirmSpec,
  copy as copySpec,
  deny as denySpec,
  nudge as nudgeSpec,
  open as openSpec,
  type PageDirection,
  paste as pasteSpec,
  remove as removeSpec,
  type SpatialDirection,
  slide as slideSpec,
  tap as tapSpec,
  toggle as toggleSpec,
  type ToggleState,
  turn as turnSpec,
  type VerticalDirection,
} from "./specs"
import { getVoice, play } from "./engine"

export const tap = () => play(tapSpec(getVoice() ?? undefined))

export const nudge = (direction: VerticalDirection) =>
  play(nudgeSpec(direction, getVoice() ?? undefined))

export const toggle = (state: ToggleState) =>
  play(toggleSpec(state, getVoice() ?? undefined))

export const slide = (direction: SpatialDirection) =>
  play(slideSpec(direction, getVoice() ?? undefined))

export const turn = (direction: PageDirection) =>
  play(turnSpec(direction, getVoice() ?? undefined))

export const open = () => play(openSpec(getVoice() ?? undefined))

export const close = () => play(closeSpec(getVoice() ?? undefined))

export const copy = () => play(copySpec(getVoice() ?? undefined))

export const paste = () => play(pasteSpec(getVoice() ?? undefined))

export const remove = () => play(removeSpec(getVoice() ?? undefined))

export const confirm = () => play(confirmSpec(getVoice() ?? undefined))

export const deny = () => play(denySpec(getVoice() ?? undefined))

export {
  duration,
  getSettings,
  getVoice,
  play,
  setEnabled,
  setRespectReducedMotion,
  setVoice,
  setVolume,
  subscribe,
} from "./engine"
export { registerRatio, type Voice, voiceFor } from "./voice"
export type {
  FmLayer,
  Layer,
  NoiseLayer,
  PageDirection,
  SoundSpec,
  SpatialDirection,
  ToggleState,
  ToneLayer,
  VerticalDirection,
} from "./specs"
export { REGISTER, specs } from "./specs"
