import { layerSpecs, LAYER_TYPES } from "./registry"
import type { LayerPreset, LayerType } from "./types"

/**
 * The layer pass. The image (a streak tile, the homepage gradient) is drawn
 * into a texture; one program built from the enabled layers, in stack order,
 * reads it back, runs each generator and composites it over. Programs are cached by the stack's shape
 * (which types, in which order), so moving a slider never recompiles, and an
 * empty stack skips the pass entirely: no layers, the exact streak pixels.
 *
 * Layers work on display (sRGB) values, like grain laid over a print, which is
 * also where blend modes are defined.
 */

const COMMON = `#version 300 es
precision highp float;

uniform sampler2D u_src;
uniform vec2 u_full, u_origin;
uniform float u_time;

out vec4 o;

float l_hash(vec3 p) {
  p = fract(p * vec3(0.1031, 0.1030, 0.0973));
  p += dot(p, p.yzx + 33.33);
  return fract((p.x + p.y) * p.z);
}

// Value noise with a near-gaussian value per cell (three uniforms summed),
// in -1..1. k picks an independent field.
float l_cell(vec2 i, float k) {
  return (l_hash(vec3(i, k)) + l_hash(vec3(i, k + 0.37)) + l_hash(vec3(i, k + 0.71))) / 1.5 - 1.0;
}
float l_value(vec2 p, float k) {
  vec2 i = floor(p), f = fract(p);
  f = f * f * (3.0 - 2.0 * f);
  return mix(mix(l_cell(i, k), l_cell(i + vec2(1, 0), k), f.x),
             mix(l_cell(i + vec2(0, 1), k), l_cell(i + vec2(1, 1), k), f.x), f.y);
}

vec2 l_hash2(vec2 p) {
  p = vec2(dot(p, vec2(127.1, 311.7)), dot(p, vec2(269.5, 183.3)));
  return -1.0 + 2.0 * fract(sin(p) * 43758.5453);
}
// Gradient noise, about -0.7..0.7.
float l_gnoise(vec2 p) {
  vec2 i = floor(p), f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(
    mix(dot(l_hash2(i), f), dot(l_hash2(i + vec2(1, 0)), f - vec2(1, 0)), u.x),
    mix(dot(l_hash2(i + vec2(0, 1)), f - vec2(0, 1)), dot(l_hash2(i + vec2(1, 1)), f - vec2(1, 1)), u.x),
    u.y);
}

mat2 l_rot(float a) { float c = cos(a), s = sin(a); return mat2(c, s, -s, c); }

float l_fbm(vec2 p, int oct) {
  float s = 0.0, a = 0.5;
  for (int i = 0; i < 8; i++) {
    if (i >= oct) break;
    s += a * l_gnoise(p);
    p = l_rot(0.6435) * p * 2.03 + vec2(3.1, 1.7);
    a *= 0.5;
  }
  return s;
}

vec2 l_seed(float s) { return vec2(fract(s * 0.1373) * 97.0, fract(s * 0.0719) * 89.0); }

// The signal s (-1..1, 0 neutral) as a layer value 0..1 (0.5 neutral), put
// through a blend mode over b.
vec3 l_blend(vec3 b, vec3 s, float mode) {
  vec3 l = clamp(0.5 + 0.5 * s, 0.0, 1.0);
  if (mode < 0.5) {
    // Soft light (W3C).
    vec3 d = mix(sqrt(b), ((16.0 * b - 12.0) * b + 4.0) * b, step(b, vec3(0.25)));
    return mix(b - (1.0 - 2.0 * l) * b * (1.0 - b), b + (2.0 * l - 1.0) * (d - b), step(0.5, l));
  }
  if (mode < 1.5) return mix(2.0 * b * l, 1.0 - 2.0 * (1.0 - b) * (1.0 - l), step(0.5, b));
  if (mode < 2.5) return b + 0.5 * s;
  if (mode < 3.5) return b * l;
  return 1.0 - (1.0 - b) * (1.0 - l);
}

// Amount is the layer's opacity; mids fades it out toward black and white,
// the way film grain lives in the midtones.
vec3 l_composite(vec3 b, vec3 s, float amount, float mode, float mids) {
  float y = dot(b, vec3(0.2126, 0.7152, 0.0722));
  float w = amount * mix(1.0, 4.0 * y * (1.0 - y), mids);
  return clamp(mix(b, l_blend(b, s, mode), w), 0.0, 1.0);
}
`

const uniformName = (i: number, key: string) => `u_l${i}_${key}`

export function buildPostShader(types: LayerType[]) {
  const seen = new Set<string>()
  const fns: string[] = []
  const decls: string[] = []
  const calls: string[] = []
  types.forEach((type, i) => {
    if (!seen.has(type.id)) {
      seen.add(type.id)
      const args = type.params.map((p) => `float ${p.key}`).join(", ")
      fns.push(
        `${type.helpers ?? ""}\nvec3 layer_${type.id}(vec2 px, vec2 uv, float res${args ? ", " + args : ""}) {${type.body}\n}`
      )
    }
    const specs = layerSpecs(type)
    decls.push(
      `uniform float ${specs.map((p) => uniformName(i, p.key)).join(", ")};`
    )
    const own = type.params.map((p) => uniformName(i, p.key))
    const u = (k: string) => uniformName(i, k)
    calls.push(
      `  col = l_composite(col, layer_${type.id}(px, uv, res${own.length ? ", " + own.join(", ") : ""}), ${u("amount")}, ${u("blend")}, ${u("mids")});`
    )
  })
  return `${COMMON}
${decls.join("\n")}
${fns.join("\n\n")}

void main() {
  vec2 px = gl_FragCoord.xy + u_origin;
  vec2 uv = (px - 0.5 * u_full) / u_full.y;
  float res = u_full.y / 1080.0;
  vec3 col = texelFetch(u_src, ivec2(gl_FragCoord.xy), 0).rgb;
${calls.join("\n")}
  o = vec4(col, 1.0);
}`
}

interface Built {
  program: WebGLProgram
  locs: Map<string, WebGLUniformLocation | null>
}

export interface PostStack {
  /** Where the streak tile goes, for this pass to read. */
  framebuffer: WebGLFramebuffer
  /** The texture behind it, for laying layers over an image from elsewhere. */
  texture: WebGLTexture
  /** Draws the layered tile to the canvas. */
  draw(originX: number, originY: number): void
}

export interface PostPass {
  /**
   * Readies the enabled layers for a render of this size: null when there are
   * none (or they failed to compile), so the caller draws straight out.
   */
  prepare(
    layers: LayerPreset[] | undefined,
    width: number,
    height: number,
    time: number,
    /** The most drawn at once (a tile, or the whole frame): what it holds. */
    room?: [number, number]
  ): PostStack | null
  dispose(): void
}

export function createPostPass(
  gl: WebGL2RenderingContext,
  vertex: WebGLShader
): PostPass {
  const cache = new Map<string, Built | null>()
  let texture: WebGLTexture | null = null
  let framebuffer: WebGLFramebuffer | null = null
  let held = [0, 0]

  const build = (types: LayerType[]): Built | null => {
    const fs = gl.createShader(gl.FRAGMENT_SHADER)!
    gl.shaderSource(fs, buildPostShader(types))
    gl.compileShader(fs)
    if (!gl.getShaderParameter(fs, gl.COMPILE_STATUS)) {
      console.error("[streaks] layers:", gl.getShaderInfoLog(fs))
      gl.deleteShader(fs)
      return null
    }
    const program = gl.createProgram()
    gl.attachShader(program, vertex)
    gl.attachShader(program, fs)
    gl.bindAttribLocation(program, 0, "a")
    gl.linkProgram(program)
    gl.deleteShader(fs)
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      console.error("[streaks] layers:", gl.getProgramInfoLog(program))
      gl.deleteProgram(program)
      return null
    }
    return { program, locs: new Map() }
  }

  // The texture holds one draw's worth (a tile, or a whole canvas), and is
  // reallocated when that size changes.
  const target = (w: number, h: number) => {
    if (!framebuffer) {
      texture = gl.createTexture()
      gl.bindTexture(gl.TEXTURE_2D, texture)
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST)
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST)
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE)
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE)
      framebuffer = gl.createFramebuffer()
    }
    if (held[0] !== w || held[1] !== h) {
      gl.bindTexture(gl.TEXTURE_2D, texture)
      gl.texImage2D(
        gl.TEXTURE_2D,
        0,
        gl.RGBA8,
        w,
        h,
        0,
        gl.RGBA,
        gl.UNSIGNED_BYTE,
        null
      )
      gl.bindFramebuffer(gl.FRAMEBUFFER, framebuffer)
      gl.framebufferTexture2D(
        gl.FRAMEBUFFER,
        gl.COLOR_ATTACHMENT0,
        gl.TEXTURE_2D,
        texture,
        0
      )
      gl.bindFramebuffer(gl.FRAMEBUFFER, null)
      held = [w, h]
    }
    return framebuffer
  }

  return {
    prepare(layers, width, height, time, room = [width, height]) {
      const stack = (layers ?? []).flatMap((l) => {
        const type = l.enabled ? LAYER_TYPES[l.type] : undefined
        return type ? [{ layer: l, type }] : []
      })
      if (!stack.length) return null
      const key = stack.map((s) => s.type.id).join(",")
      if (!cache.has(key)) cache.set(key, build(stack.map((s) => s.type)))
      const built = cache.get(key)
      if (!built) return null

      const { program, locs } = built
      const loc = (name: string) => {
        if (!locs.has(name))
          locs.set(name, gl.getUniformLocation(program, name))
        return locs.get(name)!
      }
      gl.useProgram(program)
      gl.uniform1i(loc("u_src"), 0)
      gl.uniform2f(loc("u_full"), width, height)
      gl.uniform1f(loc("u_time"), time)
      stack.forEach(({ layer, type }, i) => {
        for (const spec of layerSpecs(type)) {
          const v = layer.params[spec.key] ?? type.defaults[spec.key] ?? 0
          gl.uniform1f(
            loc(uniformName(i, spec.key)),
            spec.deg ? (v * Math.PI) / 180 : v
          )
        }
      })

      const fb = target(room[0], room[1])
      return {
        framebuffer: fb,
        texture: texture!,
        draw(originX, originY) {
          gl.bindFramebuffer(gl.FRAMEBUFFER, null)
          gl.useProgram(program)
          gl.activeTexture(gl.TEXTURE0)
          gl.bindTexture(gl.TEXTURE_2D, texture)
          gl.uniform2f(loc("u_origin"), originX, originY)
          gl.drawArrays(gl.TRIANGLES, 0, 3)
        },
      }
    },
    dispose() {
      for (const built of cache.values())
        if (built) gl.deleteProgram(built.program)
      cache.clear()
      gl.deleteFramebuffer(framebuffer)
      gl.deleteTexture(texture)
    },
  }
}
