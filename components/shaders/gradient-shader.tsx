"use client"

import { useEffect, useRef } from "react"
import { cn } from "@/lib/utils"

const VERT = `#version 300 es
layout(location = 0) in vec3 position;
out vec2 vPosition;
void main() {
  gl_Position = vec4(position, 1.0);
  vPosition = position.xy;
}`

const FRAG = `#version 300 es
precision highp float;

uniform vec3  u_color1, u_color2, u_color3, u_color4, u_color5;
uniform float u_colorSize, u_colorSpacing, u_colorSpread, u_colorRotation;
uniform float u_displacement, u_noiseSize, u_noiseIntensity, u_seed;
uniform float u_color5Mix;
uniform vec2  u_colorOffset, u_resolution, u_mouse;
uniform float u_pull, u_pullRadius, u_glow, u_glowRadius;

in  vec2 vPosition;
out vec4 fragColor;

float hash(vec2 p) {
  p = 50.0 * fract(p * 0.3183099 + vec2(0.71, 0.113));
  return -1.0 + 2.0 * fract(p.x * p.y * (p.x + p.y));
}

float noise2D(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(
    mix(hash(i + vec2(0,0)), hash(i + vec2(1,0)), u.x),
    mix(hash(i + vec2(0,1)), hash(i + vec2(1,1)), u.x),
    u.y
  );
}

vec4 gradientDerivativesNoise3D(vec3 p) {
  vec3 i = floor(p);
  vec3 f = fract(p);
  vec3 u  = f * f * f * (f * (f * 6.0 - 15.0) + 10.0);
  vec3 du = 30.0 * f * f * (f * (f - 2.0) + 1.0);
  float a  = hash(i.xy + vec2(0,0) + i.z);
  float b  = hash(i.xy + vec2(1,0) + i.z);
  float c  = hash(i.xy + vec2(0,1) + i.z);
  float d  = hash(i.xy + vec2(1,1) + i.z);
  float e  = hash(i.xy + vec2(0,0) + i.z + 1.0);
  float f2 = hash(i.xy + vec2(1,0) + i.z + 1.0);
  float g  = hash(i.xy + vec2(0,1) + i.z + 1.0);
  float h  = hash(i.xy + vec2(1,1) + i.z + 1.0);
  float k0 =  a;
  float k1 =  b - a;
  float k2 =  c - a;
  float k3 =  e - a;
  float k4 =  a - b - c + d;
  float k5 =  a - b - e + f2;
  float k6 =  a - c - e + g;
  float k7 = -a + b + c - d + e - f2 - g + h;
  return vec4(
    k0 + k1*u.x + k2*u.y + k3*u.z + k4*u.x*u.y + k5*u.x*u.z + k6*u.y*u.z + k7*u.x*u.y*u.z,
    du * vec3(
      k1 + k4*u.y + k5*u.z + k7*u.y*u.z,
      k2 + k4*u.x + k6*u.z + k7*u.x*u.z,
      k3 + k5*u.x + k6*u.y + k7*u.x*u.y
    )
  );
}

vec2 rotate(vec2 v, float a) {
  float s = sin(a), c = cos(a);
  return mat2(c, -s, s, c) * v;
}

void main() {
  vec2 uv = vPosition;
  uv.x *= min(1.0, u_resolution.x / u_resolution.y);
  uv /= max(u_colorSize, 0.001);

  vec2 mouseUV = u_mouse;
  mouseUV.x *= min(1.0, u_resolution.x / u_resolution.y);
  mouseUV /= max(u_colorSize, 0.001);

  vec2 toMouse = mouseUV - uv;
  float dist = length(toMouse);
  float pull = smoothstep(u_pullRadius, 0.0, dist) * u_pull;
  vec2 warped = uv + toMouse * pull;

  vec3 noiseInput = vec3(warped * u_noiseSize, u_seed);
  vec3 dispNoise  = gradientDerivativesNoise3D(noiseInput).yzw;
  vec2 position   = warped + dispNoise.xz * u_displacement + u_colorOffset;

  vec2 pos = rotate(position, -u_colorRotation);

  vec3 color = vec3(0.0);
  color = mix(u_color1, color, smoothstep(0.0, u_colorSpread, distance(pos, vec2(0.0,  u_colorSpacing * 1.5))));
  color = mix(u_color2, color, smoothstep(0.0, u_colorSpread, distance(pos, vec2(0.0,  u_colorSpacing * 0.5))));
  color = mix(u_color3, color, smoothstep(0.0, u_colorSpread, distance(pos, vec2(0.0, -u_colorSpacing * 0.5))));
  color = mix(u_color4, color, smoothstep(0.0, u_colorSpread, distance(pos, vec2(0.0, -u_colorSpacing * 1.5))));
  if (u_color5Mix > 0.0) {
    color = mix(color, u_color5, u_color5Mix * (1.0 - smoothstep(0.0, u_colorSpread * 0.8, distance(pos, vec2(0.0, 0.0)))));
  }

  float glow = smoothstep(u_glowRadius, 0.0, dist) * u_glow;
  color += glow;

  float grain = noise2D(vPosition.xy * 600.0 + u_seed);
  color += grain * u_noiseIntensity;

  fragColor = vec4(clamp(color, 0.0, 1.0), 1.0);
}`

type RGB01 = [number, number, number]

export interface GradientConfig {
  colorSize: number
  colorSpacing: number
  colorSpread: number
  colorRotation: number
  displacement: number
  noiseSize: number
  noiseIntensity: number
  offsetX: number
  offsetY: number
  color5Mix: number
  speed: number
  pull: number
  pullRadius: number
  glow: number
  glowRadius: number
  mouseLerp: number
  tween: number
  maxDpr: number
  presets: number[][][]
}

export const DEFAULT_GRADIENT_CONFIG: GradientConfig = {
  colorSize: 0.75,
  colorSpacing: 0.52,
  colorSpread: 1.5,
  colorRotation: -0.38,
  displacement: 1.2,
  noiseSize: 0.45,
  noiseIntensity: 0.01,
  offsetX: 0,
  offsetY: 0,
  color5Mix: 0,
  speed: 0.0008,
  pull: 0.35,
  pullRadius: 2.5,
  glow: 0.12,
  glowRadius: 1.8,
  mouseLerp: 0.12,
  tween: 1.4,
  maxDpr: 2,
  presets: [
    [
      [22 / 255, 37 / 255, 75 / 255],
      [35 / 255, 65 / 255, 138 / 255],
      [170 / 255, 223 / 255, 217 / 255],
      [223 / 255, 78 / 255, 16 / 255],
    ], // Ocean
    [
      [1, 236 / 255, 210 / 255],
      [1, 60 / 255, 0],
      [13 / 255, 2 / 255, 0],
      [55 / 255, 12 / 255, 0],
    ], // Ember
    [
      [211 / 255, 218 / 255, 52 / 255],
      [203 / 255, 178 / 255, 173 / 255],
      [1 / 255, 29 / 255, 141 / 255],
      [1 / 255, 3 / 255, 18 / 255],
    ], // Lime
    [
      [0, 8 / 255, 22 / 255],
      [0, 22 / 255, 65 / 255],
      [220 / 255, 238 / 255, 1],
      [0, 100 / 255, 1],
    ], // Frost
  ],
}

// GSAP power2.inOut, replicated so we don't pull in the dependency.
function power2InOut(t: number) {
  return t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2
}

function compile(gl: WebGL2RenderingContext, type: number, src: string) {
  const sh = gl.createShader(type)!
  gl.shaderSource(sh, src)
  gl.compileShader(sh)
  if (!gl.getShaderParameter(sh, gl.COMPILE_STATUS)) {
    console.error("[GradientShader]", gl.getShaderInfoLog(sh))
    return null
  }
  return sh
}

const num = (c: GradientConfig, k: string) =>
  (c as unknown as Record<string, number>)[k]

export function GradientShader({
  config,
  className,
}: {
  config?: Partial<GradientConfig>
  className?: string
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const cfgRef = useRef<GradientConfig>({
    ...DEFAULT_GRADIENT_CONFIG,
    ...config,
  })
  // Keep the live config in sync with the prop without touching the ref
  // during render (the render loop reads cfgRef.current each frame).
  useEffect(() => {
    cfgRef.current = { ...DEFAULT_GRADIENT_CONFIG, ...config }
  }, [config])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const gl = canvas.getContext("webgl2", { alpha: false, antialias: false })
    if (!gl) {
      console.warn("[GradientShader] WebGL2 unavailable")
      return
    }

    const vs = compile(gl, gl.VERTEX_SHADER, VERT)
    const fs = compile(gl, gl.FRAGMENT_SHADER, FRAG)
    if (!vs || !fs) return
    const program = gl.createProgram()!
    gl.attachShader(program, vs)
    gl.attachShader(program, fs)
    gl.linkProgram(program)
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      console.error("[GradientShader]", gl.getProgramInfoLog(program))
      return
    }
    gl.useProgram(program)

    const vao = gl.createVertexArray()
    gl.bindVertexArray(vao)
    const buf = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, buf)
    // Full-screen triangle (position is vec3; z = 0).
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 0, 3, -1, 0, -1, 3, 0]),
      gl.STATIC_DRAW
    )
    gl.enableVertexAttribArray(0)
    gl.vertexAttribPointer(0, 3, gl.FLOAT, false, 0, 0)

    const uCache = new Map<string, WebGLUniformLocation | null>()
    const U = (name: string) => {
      if (!uCache.has(name))
        uCache.set(name, gl.getUniformLocation(program, name))
      return uCache.get(name)!
    }

    // --- Live interaction state --------------------------------------------
    const presets = cfgRef.current.presets
    let live: RGB01[] = presets[0].map((c) => [...c] as RGB01)
    let presetIndex = 0
    let tween: {
      from: RGB01[]
      to: RGB01[]
      start: number
      dur: number
    } | null = null

    let seed = 0.18
    const target = { x: 0, y: 0 }
    const smooth = { x: 0, y: 0 }

    // --- Sizing ------------------------------------------------------------
    let cssW = 0,
      cssH = 0
    function resize() {
      const rect = canvas!.getBoundingClientRect()
      const dpr = Math.min(
        window.devicePixelRatio || 1,
        num(cfgRef.current, "maxDpr") || 2
      )
      cssW = Math.max(1, rect.width)
      cssH = Math.max(1, rect.height)
      canvas!.width = Math.floor(cssW * dpr)
      canvas!.height = Math.floor(cssH * dpr)
      gl!.viewport(0, 0, canvas!.width, canvas!.height)
    }
    resize()
    const ro = new ResizeObserver(resize)
    ro.observe(canvas)

    // --- Pointer (window-level; the canvas is pointer-events-none) ---------
    let rafPointer = 0
    const onMove = (e: MouseEvent) => {
      const cx = e.clientX,
        cy = e.clientY
      if (rafPointer) return
      rafPointer = requestAnimationFrame(() => {
        rafPointer = 0
        const w = window.innerWidth,
          h = window.innerHeight
        if (w && h) {
          target.x = (cx / w) * 2 - 1
          target.y = -((cy / h) * 2 - 1)
        }
      })
    }
    const onClick = (e: MouseEvent) => {
      const el = e.target
      if (
        el instanceof Element &&
        el.closest(
          'a, button, input, select, textarea, [role="button"], [contenteditable="true"]'
        )
      )
        return
      presetIndex = (presetIndex + 1) % presets.length
      tween = {
        from: live.map((c) => [...c] as RGB01),
        to: presets[presetIndex].map((c) => [...c] as RGB01),
        start: -1,
        dur: (num(cfgRef.current, "tween") || 1.4) * 1000,
      }
    }
    window.addEventListener("mousemove", onMove, { passive: true })
    window.addEventListener("click", onClick)

    // --- Render loop -------------------------------------------------------
    let raf = 0
    let running = true
    function draw(ts: number) {
      if (!running) return
      raf = requestAnimationFrame(draw)
      const c = cfgRef.current

      // Idle drift + pointer smoothing.
      seed += num(c, "speed")
      const lerp = num(c, "mouseLerp")
      smooth.x += (target.x - smooth.x) * lerp
      smooth.y += (target.y - smooth.y) * lerp

      // Colour tween.
      if (tween) {
        if (tween.start < 0) tween.start = ts
        const p = Math.min(1, (ts - tween.start) / tween.dur)
        const e = power2InOut(p)
        live = tween.from.map((f, i) => [
          f[0] + (tween!.to[i][0] - f[0]) * e,
          f[1] + (tween!.to[i][1] - f[1]) * e,
          f[2] + (tween!.to[i][2] - f[2]) * e,
        ]) as RGB01[]
        if (p >= 1) tween = null
      }

      gl!.uniform2f(U("u_resolution"), canvas!.width, canvas!.height)
      gl!.uniform2f(U("u_mouse"), smooth.x, smooth.y)
      gl!.uniform1f(U("u_seed"), seed)
      gl!.uniform1f(U("u_colorSize"), num(c, "colorSize"))
      gl!.uniform1f(U("u_colorSpacing"), num(c, "colorSpacing"))
      gl!.uniform1f(U("u_colorSpread"), num(c, "colorSpread"))
      gl!.uniform1f(U("u_colorRotation"), num(c, "colorRotation"))
      gl!.uniform1f(U("u_displacement"), num(c, "displacement"))
      gl!.uniform1f(U("u_noiseSize"), num(c, "noiseSize"))
      gl!.uniform1f(U("u_noiseIntensity"), num(c, "noiseIntensity"))
      gl!.uniform1f(U("u_color5Mix"), num(c, "color5Mix"))
      gl!.uniform2f(U("u_colorOffset"), num(c, "offsetX"), num(c, "offsetY"))
      gl!.uniform1f(U("u_pull"), num(c, "pull"))
      gl!.uniform1f(U("u_pullRadius"), num(c, "pullRadius"))
      gl!.uniform1f(U("u_glow"), num(c, "glow"))
      gl!.uniform1f(U("u_glowRadius"), num(c, "glowRadius"))
      gl!.uniform3f(U("u_color1"), live[0][0], live[0][1], live[0][2])
      gl!.uniform3f(U("u_color2"), live[1][0], live[1][1], live[1][2])
      gl!.uniform3f(U("u_color3"), live[2][0], live[2][1], live[2][2])
      gl!.uniform3f(U("u_color4"), live[3][0], live[3][1], live[3][2])
      gl!.uniform3f(U("u_color5"), 0, 0, 0)

      gl!.drawArrays(gl!.TRIANGLES, 0, 3)
    }
    raf = requestAnimationFrame(draw)

    const onVis = () => {
      if (document.hidden) {
        running = false
        cancelAnimationFrame(raf)
      } else if (!running) {
        running = true
        raf = requestAnimationFrame(draw)
      }
    }
    document.addEventListener("visibilitychange", onVis)

    return () => {
      running = false
      cancelAnimationFrame(raf)
      cancelAnimationFrame(rafPointer)
      ro.disconnect()
      window.removeEventListener("mousemove", onMove)
      window.removeEventListener("click", onClick)
      document.removeEventListener("visibilitychange", onVis)
      gl.deleteProgram(program)
      gl.deleteShader(vs)
      gl.deleteShader(fs)
      gl.deleteBuffer(buf)
      gl.deleteVertexArray(vao)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      className={cn("block h-full w-full", className)}
    />
  )
}
