import Link from 'next/link'
import { AlertCircle } from 'lucide-react'
import { PageChrome } from '@/components/site-shell'

export default function CheckoutFailedPage() {
  return (
    <>
      <PageChrome
        eyebrow="Order Failed"
        title="We could not complete the payment."
        description="Failure states should be calm, specific, and actionable."
      />
      <section className="bg-[#f7f7f3]">
        <div className="mx-auto max-w-3xl px-4 py-8 sm:py-16 sm:px-6">
          <div className="rounded-[1.5rem] sm:rounded-[2rem] border border-emerald-950/10 bg-white p-4 sm:p-8 text-center shadow-[0_12px_30px_rgba(15,23,42,0.05)]">
            <AlertCircle className="mx-auto h-10 w-10 sm:h-14 sm:w-14 text-amber-600" />
            <h2 className="mt-3 sm:mt-5 text-2xl sm:text-3xl font-semibold text-slate-950">Payment did not go through</h2>
            <p className="mt-2 sm:mt-3 text-xs sm:text-sm leading-6 sm:leading-7 text-slate-600">
              Customers should be able to retry payment, change methods, or contact support immediately.
            </p>
            <div className="mt-4 sm:mt-8 flex flex-wrap justify-center gap-2 sm:gap-3">
              <Link href="/checkout" className="rounded-full bg-emerald-950 px-4 sm:px-5 py-2 sm:py-3 text-xs sm:text-sm font-semibold text-white">
                Try Again
              </Link>
              <Link href="/contact" className="rounded-full border border-emerald-950/10 px-4 sm:px-5 py-2 sm:py-3 text-xs sm:text-sm font-semibold text-slate-900">
                Contact Support
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
