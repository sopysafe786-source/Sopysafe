'use client'

import Link from 'next/link'
import { IndianRupee, PackageSearch } from 'lucide-react'
import { useStorefront } from '@/components/storefront-provider'

const statusStyles: Record<string, string> = {
  Placed: 'bg-slate-100 text-slate-700',
  Processing: 'bg-amber-50 text-amber-800',
  Shipped: 'bg-blue-50 text-blue-800',
  Delivered: 'bg-emerald-50 text-emerald-800',
  Cancelled: 'bg-rose-50 text-rose-800',
}

export function OrdersView() {
  const { orders } = useStorefront()

  return (
    <section className="bg-[#f7f7f3]">
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 sm:py-10 lg:px-8">
        <div className="rounded-[1.5rem] border border-emerald-950/10 bg-white p-4 sm:p-6">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-slate-500">Orders</p>
              <h1 className="mt-1 text-2xl font-semibold text-slate-950">Order history</h1>
              <p className="mt-2 text-sm text-slate-600">
                See placed orders, status, and the next action just like a real marketplace account.
              </p>
            </div>
            <Link
              href="/track-order"
              className="inline-flex items-center justify-center rounded-full bg-emerald-950 px-4 py-2 text-sm font-semibold text-white transition hover:bg-emerald-900"
            >
              Track order
            </Link>
          </div>

          <div className="mt-5 grid gap-3">
            {orders.length ? (
              orders.map((order) => (
                <article key={order.id} className="rounded-[1.25rem] border border-emerald-950/10 bg-[#f7f7f3] p-4 sm:p-5">
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                    <div className="space-y-2">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className={`rounded-full px-3 py-1 text-xs font-semibold ${statusStyles[order.status] ?? 'bg-slate-100 text-slate-700'}`}>
                          {order.status}
                        </span>
                        <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-slate-700">
                          {order.orderNumber}
                        </span>
                      </div>
                      <h2 className="text-lg font-semibold text-slate-950">
                        {order.items.length} item{order.items.length > 1 ? 's' : ''}
                      </h2>
                      <p className="text-sm text-slate-600">{new Date(order.createdAt).toLocaleString('en-IN')}</p>
                      <p className="text-sm text-slate-600">
                        {order.customer.name} · {order.customer.phone}
                      </p>
                    </div>
                    <div className="text-left sm:text-right">
                      <p className="text-xs uppercase tracking-[0.24em] text-slate-500">Total</p>
                      <div className="mt-1 flex items-center gap-1 text-xl font-semibold text-slate-950 sm:justify-end">
                        <IndianRupee className="h-5 w-5 text-emerald-700" />
                        {order.total.toLocaleString('en-IN')}
                      </div>
                      <p className="mt-1 text-sm text-slate-600">{order.paymentStatus}</p>
                    </div>
                  </div>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {order.items.map((item) => (
                      <span key={`${order.id}-${item.slug}`} className="rounded-full border border-emerald-950/10 bg-white px-3 py-1 text-xs text-slate-700">
                        {item.name} x {item.quantity}
                      </span>
                    ))}
                  </div>
                </article>
              ))
            ) : (
              <div className="rounded-[1.25rem] border border-dashed border-emerald-950/15 bg-[#f7f7f3] p-6 text-sm text-slate-600">
                No orders yet. Place an order from product or checkout pages and it will appear here.
                <div className="mt-4">
                  <Link
                    href="/shop"
                    className="inline-flex items-center gap-2 rounded-full bg-emerald-950 px-4 py-2 text-sm font-semibold text-white"
                  >
                    <PackageSearch className="h-4 w-4" />
                    Start shopping
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
