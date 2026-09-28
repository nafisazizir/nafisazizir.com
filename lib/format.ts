export function formatDate(iso: string) {
  const [y, m, d] = iso.split("-").map(Number)
  if (!y || !m || !d) return iso
  return new Date(Date.UTC(y, m - 1, d)).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    timeZone: "UTC",
  })
}

/** Covers are stills by default; a clip extension switches to the video path. */
export function isVideoCover(src: string) {
  return /\.(mp4|webm|mov)$/i.test(src)
}
