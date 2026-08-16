import Link from 'next/link'
import { CheckCircle2 } from 'lucide-react'
import { PageChrome } from '@/components/site-shell'

type SearchParams = {
  order?: string
}

export default function CheckoutSuccessPage({
  searchParams,
}: {
  searchParams?: SearchParams
}) {
  const orderId = searchParams?.order?.trim()

  return (
    <>
      <PageChrome
        eyebrow="Order Success"
        title="Your order was placed successfully."
        description="Use this page to reinforce trust, show tracking details, and suggest the next action."
      />
      <section className="bg-[#f7f7f3]">
        <div className="mx-auto max-w-3xl px-4 py-8 sm:py-16 sm:px-6">
          <div className="rounded-[1.5rem] sm:rounded-[2rem] border border-emerald-950/10 bg-white p-4 sm:p-8 text-center shadow-[0_12px_30px_rgba(15,23,42,0.05)]">
            <CheckCircle2 className="mx-auto h-10 w-10 sm:h-14 sm:w-14 text-emerald-700" />
            <h2 className="mt-3 sm:mt-5 text-2xl sm:text-3xl font-semibold text-slate-950">Order confirmed</h2>
            <p className="mt-2 sm:mt-3 text-xs sm:text-sm leading-6 sm:leading-7 text-slate-600">
              Confirmation number, payment status, and shipping timeline should all be visible here.
            </p>
            {orderId ? (
              <div className="mt-4 inline-flex rounded-full border border-emerald-950/10 bg-[#f7f7f3] px-4 py-2 text-xs sm:text-sm text-slate-700">
                Order reference: <span className="ml-1 font-semibold text-slate-950">{orderId}</span>
              </div>
            ) : null}
            <div className="mt-4 sm:mt-8 flex flex-wrap justify-center gap-2 sm:gap-3">
              <Link href="/track-order" className="rounded-full bg-emerald-950 px-4 sm:px-5 py-2 sm:py-3 text-xs sm:text-sm font-semibold text-white">
                Track Order
              </Link>
              <Link href="/" className="rounded-full border border-emerald-950/10 px-4 sm:px-5 py-2 sm:py-3 text-xs sm:text-sm font-semibold text-slate-900">
                Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
