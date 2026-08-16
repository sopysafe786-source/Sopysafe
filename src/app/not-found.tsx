import Link from 'next/link'

export default function NotFound() {
  return (
    <section className="bg-[#f7f7f3]">
      <div className="mx-auto grid min-h-[70vh] max-w-3xl place-items-center px-4 py-12 sm:py-20 text-center sm:px-6">
        <div className="rounded-[1.5rem] sm:rounded-[2rem] border border-emerald-950/10 bg-white p-4 sm:p-8 shadow-[0_12px_30px_rgba(15,23,42,0.06)]">
          <p className="text-xs sm:text-sm font-semibold uppercase tracking-[0.3em] text-emerald-700">404</p>
          <h1 className="mt-2 sm:mt-4 text-2xl sm:text-4xl font-semibold text-slate-950">We could not find that page.</h1>
          <p className="mt-2 sm:mt-4 text-xs sm:text-sm leading-6 sm:leading-7 text-slate-600">
            The requested route is not available. Use the store navigation to continue exploring SopySafe.
          </p>
          <Link
            href="/"
            className="mt-4 sm:mt-8 inline-flex rounded-full bg-emerald-950 px-4 sm:px-5 py-2 sm:py-3 text-xs sm:text-sm font-semibold text-white"
          >
            Return Home
          </Link>
        </div>
      </div>
    </section>
  )
}
