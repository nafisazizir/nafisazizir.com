import { fractal } from "./fractal"
import { grain } from "./grain"
import { noise } from "./noise"
import {
  COMPOSITE_DEFAULTS,
  COMPOSITE_PARAMS,
  type Layer,
  type LayerParamSpec,
  type LayerPreset,
  type LayerType,
} from "./types"

/**
 * Every layer type, in the order the Add menu lists them. A new layer is a
 * file exporting a LayerType, added here; the shader, uniforms and controls
 * all come from it.
 */
export const LAYER_LIST: LayerType[] = [grain, noise, fractal]

export const LAYER_TYPES: Record<string, LayerType> = Object.fromEntries(
  LAYER_LIST.map((t) => [t.id, t])
)

/** All of a type's controls: the shared composite ones, then its own. */
export const layerSpecs = (type: LayerType): LayerParamSpec[] => [
  ...COMPOSITE_PARAMS,
  ...type.params,
]

let uid = 0

/**
 * A stored layer, as a layer in a stack. The uid is the caller's, so a look
 * loads the same way on the server and the client.
 */
export const instantiate = (preset: LayerPreset, uid: string): Layer => ({
  ...structuredClone(preset),
  uid,
})

/** A new layer of a type, on, at its defaults. */
export function createLayer(type: string, enabled = true): Layer {
  const t = LAYER_TYPES[type]
  return {
    uid: `${type}-${++uid}`,
    type,
    enabled,
    params: { ...COMPOSITE_DEFAULTS, ...t.defaults },
  }
}
