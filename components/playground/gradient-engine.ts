import {
  GRADIENT_FRAG,
  GRADIENT_VERT,
} from "@/components/shaders/gradient-shader"

export type RGB = [number, number, number]

export interface PlaygroundParams {
  colorSize: number
  colorSpacing: number
  colorSpread: number
  colorRotation: number
  displacement: number
  noiseSize: number
  noiseIntensity: number
  offsetX: number
  offsetY: number
  speed: number
  pull: number
  pullRadius: number
  glow: number
  glowRadius: number
  style: number
  halftoneScale: number
  posterLevels: number
  grainScale: number
  grainAmount: number
  grainSoft: number
  grainSparkle: number
  mouseLerp: number
  interactive: boolean
}

export type ExportFormat = "png" | "jpeg" | "webp"

/** The timeline is a fixed window of noise-time: 60 "seconds" of playhead
 * mapped onto a fixed seed span, so scrubbing lands on the same frame no
 * matter what the speed slider says. Speed only changes how fast the playhead
 * travels. */
export const TIMELINE_SECONDS = 60
const SEED_SPAN = 2.88
const START_SEED = 10.455
const MAX_DPR = 2

const MIME: Record<ExportFormat, string> = {
  png: "image/png",
  jpeg: "image/jpeg",
  webp: "image/webp",
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
    console.error("[GradientEngine]", gl.getShaderInfoLog(sh))
    return null
  }
  return sh
}

export class GradientEngine {
  readonly ok: boolean = false
  playing = true
  onTick: ((seconds: number) => void) | null = null

  private params: PlaygroundParams
  private canvas: HTMLCanvasElement
  private gl: WebGL2RenderingContext | null = null
  private program: WebGLProgram | null = null
  private vs: WebGLShader | null = null
  private fs: WebGLShader | null = null
  private buf: WebGLBuffer | null = null
  private vao: WebGLVertexArrayObject | null = null
  private uCache = new Map<string, WebGLUniformLocation | null>()

  private live: RGB[]
  private targetColors: RGB[]
  private tween: { from: RGB[]; to: RGB[]; start: number; dur: number } | null =
    null

  /** Playhead position in seed units, within [0, SEED_SPAN). */
  private offset = 0
  private lastTs = 0
  private raf = 0
  private running = true
  private target = { x: 0, y: 0 }
  private smooth = { x: 0, y: 0 }
  private ro: ResizeObserver | null = null

  constructor(
    canvas: HTMLCanvasElement,
    colors: RGB[],
    params: PlaygroundParams
  ) {
    this.canvas = canvas
    this.params = { ...params }
    this.live = colors.map((c) => [...c] as RGB)
    this.targetColors = colors.map((c) => [...c] as RGB)

    const gl = canvas.getContext("webgl2", { alpha: false, antialias: false })
    if (!gl) return
    this.gl = gl

    this.vs = compile(gl, gl.VERTEX_SHADER, GRADIENT_VERT)
    this.fs = compile(gl, gl.FRAGMENT_SHADER, GRADIENT_FRAG)
    if (!this.vs || !this.fs) return
    const program = gl.createProgram()!
    gl.attachShader(program, this.vs)
    gl.attachShader(program, this.fs)
    gl.linkProgram(program)
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      console.error("[GradientEngine]", gl.getProgramInfoLog(program))
      return
    }
    gl.useProgram(program)
    this.program = program

    this.vao = gl.createVertexArray()
    gl.bindVertexArray(this.vao)
    this.buf = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, this.buf)
    // Full-screen triangle (position is vec3; z = 0).
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 0, 3, -1, 0, -1, 3, 0]),
      gl.STATIC_DRAW
    )
    gl.enableVertexAttribArray(0)
    gl.vertexAttribPointer(0, 3, gl.FLOAT, false, 0, 0)

    this.ok = true
    this.resize()
    this.ro = new ResizeObserver(() => this.resize())
    this.ro.observe(canvas)
    window.addEventListener("mousemove", this.onMove, { passive: true })
    document.addEventListener("visibilitychange", this.onVis)
    this.raf = requestAnimationFrame(this.loop)
  }

  getTime() {
    return (this.offset / SEED_SPAN) * TIMELINE_SECONDS
  }

  seek(seconds: number) {
    const t = Math.min(Math.max(seconds, 0), TIMELINE_SECONDS)
    this.offset = (t / TIMELINE_SECONDS) * SEED_SPAN
  }

  setParams(params: PlaygroundParams) {
    this.params = { ...params }
  }

  setColors(colors: RGB[], durMs = 900) {
    const changed = colors.some((c, i) =>
      c.some((v, j) => v !== this.targetColors[i]?.[j])
    )
    if (!changed) return
    this.targetColors = colors.map((c) => [...c] as RGB)
    this.tween = {
      from: this.live.map((c) => [...c] as RGB),
      to: this.targetColors,
      start: -1,
      dur: durMs,
    }
  }

  /** Draw the current frame at `scale` × CSS pixels and download it. */
  exportFrame(format: ExportFormat, scale = 2) {
    const gl = this.gl
    const canvas = this.canvas
    if (!gl || !this.ok) return false
    const rect = canvas.getBoundingClientRect()
    const prevW = canvas.width
    const prevH = canvas.height
    canvas.width = Math.max(1, Math.round(rect.width * scale))
    canvas.height = Math.max(1, Math.round(rect.height * scale))
    gl.viewport(0, 0, canvas.width, canvas.height)
    this.render(this.lastTs)
    // toDataURL is synchronous, so the buffer is read before the browser can
    // clear it (the context has no preserveDrawingBuffer).
    const url = canvas.toDataURL(MIME[format], 0.95)
    canvas.width = prevW
    canvas.height = prevH
    gl.viewport(0, 0, prevW, prevH)
    this.render(this.lastTs)

    const a = document.createElement("a")
    a.href = url
    a.download = `gradient-${Date.now()}.${format === "jpeg" ? "jpg" : format}`
    a.click()
    return true
  }

  destroy() {
    this.running = false
    cancelAnimationFrame(this.raf)
    this.ro?.disconnect()
    window.removeEventListener("mousemove", this.onMove)
    document.removeEventListener("visibilitychange", this.onVis)
    const gl = this.gl
    if (!gl) return
    if (this.program) gl.deleteProgram(this.program)
    if (this.vs) gl.deleteShader(this.vs)
    if (this.fs) gl.deleteShader(this.fs)
    if (this.buf) gl.deleteBuffer(this.buf)
    if (this.vao) gl.deleteVertexArray(this.vao)
  }

  private resize() {
    const gl = this.gl
    if (!gl) return
    const rect = this.canvas.getBoundingClientRect()
    const dpr = Math.min(window.devicePixelRatio || 1, MAX_DPR)
    this.canvas.width = Math.max(1, Math.floor(rect.width * dpr))
    this.canvas.height = Math.max(1, Math.floor(rect.height * dpr))
    gl.viewport(0, 0, this.canvas.width, this.canvas.height)
  }

  private onMove = (e: MouseEvent) => {
    if (!this.params.interactive) return
    const w = window.innerWidth
    const h = window.innerHeight
    if (!w || !h) return
    this.target.x = (e.clientX / w) * 2 - 1
    this.target.y = -((e.clientY / h) * 2 - 1)
  }

  private onVis = () => {
    if (document.hidden) {
      this.running = false
      cancelAnimationFrame(this.raf)
    } else if (!this.running) {
      this.running = true
      this.lastTs = 0
      this.raf = requestAnimationFrame(this.loop)
    }
  }

  private loop = (ts: number) => {
    if (!this.running) return
    this.raf = requestAnimationFrame(this.loop)
    const dt = this.lastTs ? Math.min((ts - this.lastTs) / 1000, 0.1) : 0
    this.lastTs = ts

    if (this.playing) {
      // The home hero advances the seed by `speed` per frame at ~60fps; keep
      // the same feel here but frame-rate independent.
      this.offset = (this.offset + this.params.speed * 60 * dt) % SEED_SPAN
      this.onTick?.(this.getTime())
    }
    this.render(ts)
  }

  private render(ts: number) {
    const gl = this.gl
    if (!gl || !this.ok) return
    const p = this.params

    this.smooth.x += (this.target.x - this.smooth.x) * p.mouseLerp
    this.smooth.y += (this.target.y - this.smooth.y) * p.mouseLerp

    if (this.tween) {
      const tw = this.tween
      if (tw.start < 0) tw.start = ts
      const prog = Math.min(1, (ts - tw.start) / tw.dur)
      const e = power2InOut(prog)
      this.live = tw.from.map((f, i) => [
        f[0] + (tw.to[i][0] - f[0]) * e,
        f[1] + (tw.to[i][1] - f[1]) * e,
        f[2] + (tw.to[i][2] - f[2]) * e,
      ]) as RGB[]
      if (prog >= 1) this.tween = null
    }

    const U = (name: string) => {
      if (!this.uCache.has(name))
        this.uCache.set(name, gl.getUniformLocation(this.program!, name))
      return this.uCache.get(name)!
    }

    const seed = START_SEED + this.offset
    gl.uniform2f(U("u_resolution"), this.canvas.width, this.canvas.height)
    gl.uniform2f(U("u_mouse"), this.smooth.x, this.smooth.y)
    gl.uniform1f(U("u_seed"), seed)
    gl.uniform1f(U("u_colorSize"), p.colorSize)
    gl.uniform1f(U("u_colorSpacing"), p.colorSpacing)
    gl.uniform1f(U("u_colorSpread"), p.colorSpread)
    gl.uniform1f(U("u_colorRotation"), p.colorRotation)
    gl.uniform1f(U("u_displacement"), p.displacement)
    gl.uniform1f(U("u_noiseSize"), p.noiseSize)
    gl.uniform1f(U("u_noiseIntensity"), p.noiseIntensity)
    gl.uniform1f(U("u_color5Mix"), 0)
    gl.uniform2f(U("u_colorOffset"), p.offsetX, p.offsetY)
    gl.uniform1f(U("u_pull"), p.pull)
    gl.uniform1f(U("u_pullRadius"), p.pullRadius)
    gl.uniform1f(U("u_glow"), p.glow)
    gl.uniform1f(U("u_glowRadius"), p.glowRadius)
    gl.uniform1f(U("u_style"), p.style)
    gl.uniform1f(U("u_halftoneScale"), p.halftoneScale)
    gl.uniform1f(U("u_posterLevels"), p.posterLevels)
    gl.uniform1f(U("u_grainScale"), p.grainScale)
    gl.uniform1f(U("u_grainAmount"), p.grainAmount)
    gl.uniform1f(U("u_grainSoft"), p.grainSoft)
    gl.uniform1f(U("u_grainSparkle"), p.grainSparkle)
    gl.uniform3f(U("u_color1"), ...this.live[0])
    gl.uniform3f(U("u_color2"), ...this.live[1])
    gl.uniform3f(U("u_color3"), ...this.live[2])
    gl.uniform3f(U("u_color4"), ...this.live[3])
    gl.uniform3f(U("u_color5"), 0, 0, 0)

    gl.drawArrays(gl.TRIANGLES, 0, 3)
  }
}
