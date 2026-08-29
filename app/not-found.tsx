import Link from "next/link"

export default function NotFound() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-6 px-6 text-center">
      <p className="text-label-14-mono text-gray-900">404</p>
      <h1 className="max-w-[20ch] text-heading-32 text-balance sm:text-heading-40">
        This page went on a side quest and never came back.
      </h1>
      <Link
        href="/"
        className="text-label-14 text-gray-900 underline underline-offset-4 transition-colors hover:text-gray-1000"
      >
        Back home
      </Link>
    </main>
  )
}
