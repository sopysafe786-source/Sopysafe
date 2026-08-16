'use client'

import Link from 'next/link'
import { useEffect } from 'react'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <section className="bg-[#f7f7f3]">
      <div className="mx-auto grid min-h-[70vh] max-w-3xl place-items-center px-4 py-12 sm:py-20 text-center sm:px-6">
        <div className="rounded-[1.5rem] sm:rounded-[2rem] border border-emerald-950/10 bg-white p-4 sm:p-8 shadow-[0_12px_30px_rgba(15,23,42,0.06)]">
          <p className="text-xs sm:text-sm font-semibold uppercase tracking-[0.3em] text-emerald-700">500</p>
          <h1 className="mt-2 sm:mt-4 text-2xl sm:text-4xl font-semibold text-slate-950">Something interrupted the experience.</h1>
          <p className="mt-2 sm:mt-4 text-xs sm:text-sm leading-6 sm:leading-7 text-slate-600">
            The application can be retried safely. If the issue persists, the team should inspect logs and provider integrations.
          </p>
          <div className="mt-4 sm:mt-8 flex flex-wrap justify-center gap-2 sm:gap-3">
            <button
              type="button"
              onClick={() => reset()}
              className="rounded-full bg-emerald-950 px-4 sm:px-5 py-2 sm:py-3 text-xs sm:text-sm font-semibold text-white"
            >
              Try Again
            </button>
            <Link
              href="/"
              className="rounded-full border border-emerald-950/10 px-4 sm:px-5 py-2 sm:py-3 text-xs sm:text-sm font-semibold text-slate-800"
            >
              Return Home
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
