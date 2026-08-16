'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'
import { AlertCircle, ArrowRight, Search } from 'lucide-react'
import { useStorefront } from '@/components/storefront-provider'

export function TrackOrderStudio() {
  const { orders } = useStorefront()
  const [query, setQuery] = useState('')

  const matchedOrder = useMemo(() => {
    const normalized = query.trim().toLowerCase()
    if (!normalized) return null

    return orders.find((order) => {
      const fields = [order.id, order.orderNumber, order.customer.email, order.customer.phone].filter(
        (field): field is string => Boolean(field),
      )

      return fields.some((field) => field.toLowerCase().includes(normalized))
    })
  }, [orders, query])

  const latestOrder = orders[0] ?? null
  const activeOrder = matchedOrder ?? latestOrder

  return (
    <section className="bg-[#f7f7f3]">
      <div className="mx-auto max-w-5xl px-4 py-6 sm:px-6 sm:py-10 lg:px-8">
        <div className="rounded-[1.5rem] border border-emerald-950/10 bg-white p-4 sm:p-6">
          <p className="text-xs uppercase tracking-[0.3em] text-slate-500">Track order</p>
          <h1 className="mt-1 text-2xl font-semibold text-slate-950">Find your order</h1>
          <p className="mt-2 text-sm text-slate-600">
            Search by order number, email, or phone to see live order status from the local store.
          </p>

          <div className="mt-5 grid gap-2 sm:grid-cols-[1fr_auto]">
            <label className="flex items-center gap-2 rounded-full border border-emerald-950/10 bg-[#f7f7f3] px-4 py-3">
              <Search className="h-4 w-4 text-emerald-700" />
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Enter order number, email, or mobile"
                className="w-full bg-transparent text-sm outline-none placeholder:text-slate-500"
              />
            </label>
            <button
              type="button"
              onClick={() => setQuery((current) => current.trim())}
              className="inline-flex items-center justify-center rounded-full bg-emerald-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-emerald-900"
            >
              Track now
            </button>
          </div>

          {query.trim() && !activeOrder ? (
            <div className="mt-5 rounded-[1.25rem] border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
              <div className="flex items-start gap-2">
                <AlertCircle className="mt-0.5 h-4 w-4" />
                <p>No matching order was found. Check the order number or try the email/phone used at checkout.</p>
              </div>
            </div>
          ) : null}

          {activeOrder ? (
            <div className="mt-5 rounded-[1.5rem] border border-emerald-950/10 bg-[#f7f7f3] p-4 sm:p-6">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <p className="text-xs uppercase tracking-[0.24em] text-slate-500">Current order</p>
                  <h2 className="mt-1 text-xl font-semibold text-slate-950">{activeOrder.orderNumber}</h2>
                  <p className="mt-2 text-sm text-slate-600">
                    {activeOrder.customer.name} · {activeOrder.customer.phone}
                  </p>
                </div>
                <div className="rounded-full bg-white px-4 py-2 text-sm font-semibold text-emerald-800">
                  {activeOrder.status}
                </div>
              </div>

              <div className="mt-5 grid gap-3 sm:grid-cols-4">
                {['Placed', 'Processing', 'Shipped', 'Delivered'].map((step) => {
                  const active = ['Placed', 'Processing', 'Shipped', 'Delivered'].indexOf(step) <=
                    ['Placed', 'Processing', 'Shipped', 'Delivered'].indexOf(activeOrder.status === 'Cancelled' ? 'Placed' : activeOrder.status)

                  return (
                    <div
                      key={step}
                      className={`rounded-[1.1rem] border p-3 text-sm ${
                        active ? 'border-emerald-300 bg-white text-slate-950' : 'border-emerald-950/10 bg-white/70 text-slate-500'
                      }`}
                    >
                      <p className="font-semibold">{step}</p>
                      <p className="mt-1 text-xs leading-5">
                        {step === 'Placed' && 'Order received'}
                        {step === 'Processing' && 'Packed at warehouse'}
                        {step === 'Shipped' && 'On the way'}
                        {step === 'Delivered' && 'Completed delivery'}
                      </p>
                    </div>
                  )
                })}
              </div>

              <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="text-sm text-slate-600">
                  Total items: <span className="font-semibold text-slate-950">{activeOrder.items.length}</span>
                </div>
                <Link
                  href="/orders"
                  className="inline-flex items-center gap-2 rounded-full bg-emerald-950 px-4 py-2.5 text-sm font-semibold text-white"
                >
                  View all orders
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          ) : (
            <div className="mt-5 rounded-[1.25rem] border border-dashed border-emerald-950/15 bg-[#f7f7f3] p-6 text-sm text-slate-600">
              Add an order from checkout, then search it here by order number, email, or phone.
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
