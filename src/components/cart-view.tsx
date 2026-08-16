'use client'

import Image from 'next/image'
import Link from 'next/link'
import { IndianRupee, Minus, Plus, Trash2 } from 'lucide-react'
import { useStorefront } from '@/components/storefront-provider'

export function CartView() {
  const { cart, products, setCartQuantity, removeFromCart } = useStorefront()

  const lines = cart.flatMap((line) => {
    const product = products.find((item) => item.slug === line.slug)
    if (!product) return []
    return [
      {
        ...line,
        product,
        lineTotal: product.price * line.quantity,
      },
    ]
  })

  const total = lines.reduce((sum, line) => sum + line.lineTotal, 0)

  if (!lines.length) {
    return (
      <section className="bg-[#f7f7f3]">
        <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 sm:py-12">
          <div className="rounded-[1.25rem] border border-emerald-950/10 bg-white p-5 sm:p-8 text-center">
            <h2 className="text-xl sm:text-2xl font-semibold text-slate-950">Your cart is empty</h2>
            <p className="mt-2 text-sm text-slate-600">Browse products and add items to continue shopping.</p>
            <Link
              href="/shop"
              className="mt-5 inline-flex rounded-full bg-emerald-950 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-900"
            >
              Continue shopping
            </Link>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="bg-[#f7f7f3]">
      <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 sm:py-6 lg:px-8">
        <div className="mb-4 flex flex-col gap-2 rounded-[1.25rem] border border-emerald-950/10 bg-white px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-[10px] uppercase tracking-[0.28em] text-slate-500">Cart</p>
            <h1 className="mt-1 text-lg font-semibold text-slate-950">Items in your bag</h1>
          </div>
          <div className="flex items-center gap-4 text-sm text-slate-600">
            <span>{lines.length} items</span>
            <span className="flex items-center gap-1 font-semibold text-slate-950">
              <IndianRupee className="h-4 w-4 text-emerald-700" />
              {total.toLocaleString('en-IN')}
            </span>
          </div>
        </div>

        <div className="grid gap-4 lg:grid-cols-[1fr_320px] lg:items-start">
          <div className="grid gap-3">
            {lines.map((line) => (
              <div
                key={line.slug}
                className="grid gap-3 rounded-[1.25rem] border border-emerald-950/10 bg-white p-3 sm:p-4 md:grid-cols-[96px_minmax(0,1fr)_auto]"
              >
                <Link
                  href={`/product/${line.product.slug}`}
                  className="relative mx-auto aspect-square w-full max-w-[96px] overflow-hidden rounded-2xl bg-slate-100"
                >
                  <Image
                    src={line.product.image}
                    alt={line.product.name}
                    fill
                    sizes="96px"
                    className="object-contain p-2"
                  />
                </Link>

                <div className="min-w-0">
                  <Link href={`/product/${line.product.slug}`} className="block">
                    <h3 className="text-sm sm:text-base font-semibold leading-5 text-slate-950 line-clamp-2">
                      {line.product.name}
                    </h3>
                  </Link>
                  <p className="mt-1 text-xs uppercase tracking-[0.2em] text-slate-500">{line.product.brand}</p>
                  <div className="mt-2 flex flex-wrap items-center gap-3 text-sm text-slate-600">
                    <span className="font-semibold text-slate-950">
                      <IndianRupee className="mr-1 inline h-4 w-4 text-emerald-700" />
                      {line.product.price.toLocaleString('en-IN')}
                    </span>
                    <span>{line.product.stock}</span>
                    <span>{line.product.delivery}</span>
                  </div>
                </div>

                <div className="flex flex-row items-center justify-between gap-3 md:flex-col md:items-end md:justify-start">
                  <div className="flex items-center gap-2 rounded-full border border-emerald-950/10 bg-slate-50 px-2 py-1.5">
                    <button
                      type="button"
                      onClick={() => setCartQuantity(line.slug, line.quantity - 1)}
                      className="rounded-full p-1 text-slate-700 transition hover:bg-white hover:text-slate-950"
                      aria-label="Decrease quantity"
                    >
                      <Minus className="h-4 w-4" />
                    </button>
                    <span className="min-w-6 text-center text-sm font-semibold text-slate-950">{line.quantity}</span>
                    <button
                      type="button"
                      onClick={() => setCartQuantity(line.slug, line.quantity + 1)}
                      className="rounded-full p-1 text-slate-700 transition hover:bg-white hover:text-slate-950"
                      aria-label="Increase quantity"
                    >
                      <Plus className="h-4 w-4" />
                    </button>
                  </div>
                  <div className="flex items-center gap-3">
                    <p className="text-sm font-semibold text-slate-950">
                      <IndianRupee className="mr-1 inline h-4 w-4 text-emerald-700" />
                      {line.lineTotal.toLocaleString('en-IN')}
                    </p>
                    <button
                      type="button"
                      onClick={() => removeFromCart(line.slug)}
                      className="rounded-full border border-emerald-950/10 p-2 text-slate-600 transition hover:border-rose-200 hover:text-rose-600"
                      aria-label={`Remove ${line.product.name}`}
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <aside className="rounded-[1.25rem] border border-emerald-950/10 bg-white p-4 h-fit lg:sticky lg:top-24">
            <p className="text-[10px] uppercase tracking-[0.28em] text-slate-500">Summary</p>
            <div className="mt-3 space-y-2 text-sm text-slate-600">
              <div className="flex justify-between">
                <span>Items</span>
                <span className="font-semibold text-slate-950">{lines.length}</span>
              </div>
              <div className="flex justify-between">
                <span>Cart total</span>
                <span className="flex items-center gap-1 font-semibold text-slate-950">
                  <IndianRupee className="h-4 w-4 text-emerald-700" />
                  {total.toLocaleString('en-IN')}
                </span>
              </div>
            </div>
            <Link
              href="/checkout"
              className="mt-5 inline-flex w-full items-center justify-center rounded-full bg-emerald-950 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-900"
            >
              Proceed to checkout
            </Link>
          </aside>
        </div>
      </div>
    </section>
  )
}
