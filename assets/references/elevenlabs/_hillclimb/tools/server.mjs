// Streak render + scoring server.
//
//   node tools/server.mjs            (port 8420, 4 headless Chrome pages)
//
// Runs the site's real renderer.ts / shader.ts / presets.ts (type-stripped and
// served as ES modules, reloaded whenever the files change) in a pool of
// headless Chrome pages, and exposes:
//
//   POST /api/job  {kind: "render"|"score"|"sheet", ...}  -> JSON
//
// Use tools/sl.mjs instead of calling this directly.
import { spawn } from "node:child_process"
import fs from "node:fs"
import http from "node:http"
import { stripTypeScriptTypes } from "node:module"
import os from "node:os"
import path from "node:path"

const PORT = +(process.env.SL_PORT || 8420)
const PAGES = +(process.env.SL_PAGES || 4)
const REPO = "/Users/nafis/Documents/personal/nafisazizir.com"
const SRC = process.env.SL_SRC || `${REPO}/components/labs/streaks`
const REF = `${REPO}/assets/references/elevenlabs`
const HERE = path.dirname(new URL(import.meta.url).pathname)
const CHROME = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
const MODS = ["renderer", "shader", "presets"]
const JOB_TIMEOUT = +(process.env.SL_JOB_TIMEOUT || 60000)
const withTimeout = (p, ms) => Promise.race([p, new Promise((_, rej) => setTimeout(() => rej(new Error("job timeout")), ms))])

const version = () =>
  MODS.map((m) => fs.statSync(`${SRC}/${m}.ts`).mtimeMs).join("-")

function serveModule(name, res) {
  let code = stripTypeScriptTypes(fs.readFileSync(`${SRC}/${name}.ts`, "utf8"))
  code = code.replace(/from\s+"\.\/(\w[\w-]*)"/g, (_, m) => `from "/mod/${m}.js?v=${version()}"`)
  res.writeHead(200, { "content-type": "text/javascript", "cache-control": "no-store" })
  res.end(code)
}

const MIME = { ".png": "image/png", ".jpg": "image/jpeg", ".jpeg": "image/jpeg", ".webp": "image/webp", ".avif": "image/avif", ".gif": "image/gif" }

// ---- Chrome pool over raw CDP -------------------------------------------
const tmp = fs.mkdtempSync(path.join(os.tmpdir(), "sl-chrome-"))
const chrome = spawn(CHROME, [
  "--headless=new", "--use-angle=metal", "--enable-gpu", "--ignore-gpu-blocklist",
  "--remote-debugging-port=0", `--user-data-dir=${tmp}`, "--no-first-run",
  "--disable-background-timer-throttling", "--disable-renderer-backgrounding",
  "about:blank",
], { stdio: "ignore" })
process.on("exit", () => chrome.kill())
for (const s of ["SIGINT", "SIGTERM"]) process.on(s, () => process.exit(0))

async function devtoolsPort() {
  for (let i = 0; i < 100; i++) {
    try { return fs.readFileSync(path.join(tmp, "DevToolsActivePort"), "utf8").split("\n")[0] } catch {}
    await new Promise((r) => setTimeout(r, 100))
  }
  throw new Error("chrome did not start")
}

class Page {
  constructor(ws) { this.ws = ws; this.id = 0; this.pending = new Map(); this.queue = Promise.resolve(); this.busy = 0
    ws.onmessage = (e) => { const m = JSON.parse(e.data); const p = this.pending.get(m.id); if (p) { this.pending.delete(m.id); m.error ? p.rej(new Error(m.error.message)) : p.res(m.result) } }
  }
  send(method, params = {}) { const id = ++this.id; this.ws.send(JSON.stringify({ id, method, params })); return new Promise((res, rej) => this.pending.set(id, { res, rej })) }
  async eval(expr) {
    const r = await this.send("Runtime.evaluate", { expression: expr, awaitPromise: true, returnByValue: true })
    if (r.exceptionDetails) throw new Error(r.exceptionDetails.exception?.description || r.exceptionDetails.text)
    return r.result.value
  }
  async fresh() {
    // Reload when the harness itself changed (module changes are picked up
    // inside the page via /version).
    const m = fs.statSync(path.join(HERE, "harness.html")).mtimeMs
    if (this.mtime === m) return
    if (this.mtime !== undefined) await this.send("Page.reload", { ignoreCache: true })
    this.mtime = m
    for (let k = 0; k < 100; k++) { if (await this.eval("typeof window.job === 'function'").catch(() => false)) return; await new Promise((r) => setTimeout(r, 100)) }
  }
  run(job) {
    this.busy++
    // A wedged page (GPU stall, runaway render) must not block the queue
    // behind it: time the job out and reload the page.
    const once = () => this.fresh().then(() => this.eval(`window.job(${JSON.stringify(job)})`))
    const p = this.queue.then(() => withTimeout(once(), JOB_TIMEOUT).catch(async (e) => {
      if (e.message !== "job timeout") throw e
      console.error(`[sl] job timed out, reloading page`)
      this.mtime = undefined
      await withTimeout(this.send("Page.reload", { ignoreCache: true }), 10000).catch(() => {})
      await new Promise((r) => setTimeout(r, 500))
      throw e
    }))
    this.queue = p.catch(() => {}).finally(() => this.busy--)
    return p
  }
}

const pages = []
async function startPool() {
  const port = await devtoolsPort()
  for (let i = 0; i < PAGES; i++) {
    const t = await (await fetch(`http://127.0.0.1:${port}/json/new?http://127.0.0.1:${PORT}/harness`, { method: "PUT" })).json()
    const ws = new WebSocket(t.webSocketDebuggerUrl)
    await new Promise((r, j) => { ws.onopen = r; ws.onerror = j })
    const pg = new Page(ws)
    await pg.send("Runtime.enable")
    await pg.fresh()
    pages.push(pg)
  }
  console.log(`[sl] ${pages.length} pages ready on http://127.0.0.1:${PORT}`)
}
const pick = () => pages.reduce((a, b) => (b.busy < a.busy ? b : a))

// ---- HTTP ---------------------------------------------------------------
const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, "http://x")
  try {
    if (url.pathname === "/harness") {
      res.writeHead(200, { "content-type": "text/html", "cache-control": "no-store" })
      return res.end(fs.readFileSync(path.join(HERE, "harness.html")))
    }
    if (url.pathname === "/version") { res.writeHead(200, { "cache-control": "no-store" }); return res.end(version()) }
    if (url.pathname.startsWith("/mod/")) return serveModule(path.basename(url.pathname, ".js"), res)
    if (url.pathname.startsWith("/ref/")) {
      const f = path.join(REF, decodeURIComponent(url.pathname.slice(5)))
      if (!f.startsWith(REF) || !fs.existsSync(f)) { res.writeHead(404); return res.end() }
      res.writeHead(200, { "content-type": MIME[path.extname(f).toLowerCase()] || "application/octet-stream" })
      return res.end(fs.readFileSync(f))
    }
    if (url.pathname === "/api/job" && req.method === "POST") {
      let body = ""; for await (const c of req) body += c
      const job = JSON.parse(body)
      const out = await pick().run(job)
      res.writeHead(200, { "content-type": "application/json" })
      return res.end(JSON.stringify(out))
    }
    res.writeHead(404); res.end()
  } catch (e) {
    res.writeHead(500, { "content-type": "application/json" })
    res.end(JSON.stringify({ error: String(e?.message || e) }))
  }
})
server.listen(PORT, "127.0.0.1", () => startPool().catch((e) => { console.error(e); process.exit(1) }))
