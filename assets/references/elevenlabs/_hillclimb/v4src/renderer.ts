import { STREAK_PARAMS, type StreakParams } from "./presets"
import { STREAK_FRAG, STREAK_VERT } from "./shader"

/**
 * One WebGL2 context on an offscreen canvas. Every image (preview, thumbnails,
 * export) is drawn in tiles into a 2D canvas, so a 4K export never stalls the
 * GPU in one long draw, and the page only ever holds a single GL context.
 */

export interface RenderOptions {
  time?: number
  samples?: number
}

export interface StreakRenderer {
  render(
    ctx: CanvasRenderingContext2D,
    width: number,
    height: number,
    params: StreakParams,
    options?: RenderOptions
  ): void
  dispose(): void
}

const TILE = 512

function hexToLinear(hex: string) {
  const v = parseInt(hex.slice(1), 16)
  return [(v >> 16) & 255, (v >> 8) & 255, v & 255].map((c) => {
    c /= 255
    return c <= 0.04045 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4)
  })
}

export function createStreakRenderer(): StreakRenderer | null {
  const canvas = document.createElement("canvas")
  const gl = canvas.getContext("webgl2", {
    antialias: false,
    preserveDrawingBuffer: true,
  })
  if (!gl) return null

  const compile = (type: number, src: string) => {
    const sh = gl.createShader(type)!
    gl.shaderSource(sh, src)
    gl.compileShader(sh)
    if (!gl.getShaderParameter(sh, gl.COMPILE_STATUS)) {
      console.error("[streaks]", gl.getShaderInfoLog(sh))
    }
    return sh
  }
  const vs = compile(gl.VERTEX_SHADER, STREAK_VERT)
  const fs = compile(gl.FRAGMENT_SHADER, STREAK_FRAG)
  const program = gl.createProgram()
  gl.attachShader(program, vs)
  gl.attachShader(program, fs)
  gl.bindAttribLocation(program, 0, "a")
  gl.linkProgram(program)
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    console.error("[streaks]", gl.getProgramInfoLog(program))
    return null
  }
  gl.useProgram(program)

  const vao = gl.createVertexArray()
  gl.bindVertexArray(vao)
  const buf = gl.createBuffer()
  gl.bindBuffer(gl.ARRAY_BUFFER, buf)
  // Full-screen triangle.
  gl.bufferData(
    gl.ARRAY_BUFFER,
    new Float32Array([-1, -1, 3, -1, -1, 3]),
    gl.STATIC_DRAW
  )
  gl.enableVertexAttribArray(0)
  gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0)

  const locs = new Map<string, WebGLUniformLocation | null>()
  const loc = (name: string) => {
    if (!locs.has(name)) locs.set(name, gl.getUniformLocation(program, name))
    return locs.get(name)!
  }

  function setUniforms(p: StreakParams, time: number, samples: number) {
    for (const spec of STREAK_PARAMS) {
      const v = p[spec.key]
      gl!.uniform1f(loc(`u_${spec.key}`), spec.deg ? (v * Math.PI) / 180 : v)
    }
    gl!.uniform1f(loc("u_time"), time)
    gl!.uniform1f(loc("u_dither"), 1)
    gl!.uniform1i(loc("u_samples"), samples)
    gl!.uniform3fv(loc("u_stops[0]"), p.stops.flatMap(hexToLinear))
    gl!.uniform3fv(loc("u_accent"), hexToLinear(p.accent ?? "#ffffff"))
    gl!.uniform3fv(loc("u_accent2"), hexToLinear(p.accent2 ?? "#ffffff"))
    gl!.uniform3fv(loc("u_heroColor"), hexToLinear(p.heroColor ?? "#ffffff"))
    gl!.uniform3fv(loc("u_detailColor"), hexToLinear(p.detailColor ?? "#ffffff"))
  }

  return {
    render(ctx, width, height, params, { time = 0, samples = 40 } = {}) {
      setUniforms(params, time, samples)
      gl.uniform2f(loc("u_full"), width, height)
      for (let ty = 0; ty < height; ty += TILE) {
        for (let tx = 0; tx < width; tx += TILE) {
          const tw = Math.min(TILE, width - tx)
          const th = Math.min(TILE, height - ty)
          if (canvas.width !== tw || canvas.height !== th) {
            canvas.width = tw
            canvas.height = th
          }
          gl.viewport(0, 0, tw, th)
          // GL's origin is bottom-left, the 2D canvas's is top-left.
          gl.uniform2f(loc("u_origin"), tx, height - ty - th)
          gl.drawArrays(gl.TRIANGLES, 0, 3)
          ctx.drawImage(canvas, tx, ty)
        }
      }
    },
    dispose() {
      gl.deleteProgram(program)
      gl.deleteShader(vs)
      gl.deleteShader(fs)
      gl.deleteBuffer(buf)
      gl.deleteVertexArray(vao)
      gl.getExtension("WEBGL_lose_context")?.loseContext()
    },
  }
}
