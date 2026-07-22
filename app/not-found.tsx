import Link from "next/link"

export default function NotFound() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-6 px-6 text-center">
      <p className="font-mono text-sm text-muted-foreground">404</p>
      <h1 className="max-w-[20ch] text-3xl tracking-tighter text-balance sm:text-4xl">
        This page went on a side quest and never came back.
      </h1>
      <Link
        href="/"
        className="text-sm text-muted-foreground underline underline-offset-4 transition-colors hover:text-foreground"
      >
        Back home
      </Link>
    </main>
  )
}
