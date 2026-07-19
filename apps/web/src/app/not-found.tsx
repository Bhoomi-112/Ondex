import Link from "next/link"

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center px-6 bg-zinc-950">
      <div className="text-center">
        <h1 className="text-8xl font-bold text-teal-500 mb-4">404</h1>
        <p className="text-xl text-zinc-400 mb-8">Page not found</p>
        <Link
          href="/"
          className="inline-flex items-center justify-center h-10 px-4 py-2 rounded-lg bg-teal-500 text-white text-sm font-medium hover:bg-teal-600 transition-colors"
        >
          Back to Home
        </Link>
      </div>
    </div>
  )
}
