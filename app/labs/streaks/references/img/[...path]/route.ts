import { readFile } from "node:fs/promises"
import path from "node:path"

// Serves the local ElevenLabs reference library to the references board.
// The library is git-ignored third-party art, so this only answers in dev.
const ROOT = path.join(process.cwd(), "assets/references/elevenlabs")

const TYPES: Record<string, string> = {
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".webp": "image/webp",
  ".avif": "image/avif",
}

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ path: string[] }> }
) {
  if (process.env.NODE_ENV === "production") {
    return new Response(null, { status: 404 })
  }
  const file = path.resolve(ROOT, ...(await params).path)
  const type = TYPES[path.extname(file).toLowerCase()]
  if (!file.startsWith(ROOT + path.sep) || !type) {
    return new Response(null, { status: 404 })
  }
  try {
    return new Response(await readFile(file), {
      headers: { "content-type": type, "cache-control": "no-store" },
    })
  } catch {
    return new Response(null, { status: 404 })
  }
}
