'use client'

import Image from 'next/image'
import Link from 'next/link'
import { HeartOff, IndianRupee, ShoppingCart } from 'lucide-react'
import { useStorefront } from '@/components/storefront-provider'

export function WishlistView() {
  const { products, wishlist, removeFromWishlist, clearWishlist, addToCart } = useStorefront()

  const items = wishlist
    .map((slug) => products.find((product) => product.slug === slug))
    .filter((product): product is (typeof products)[number] => Boolean(product))

  return (
    <section className="bg-[#f7f7f3]">
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 sm:py-10 lg:px-8">
        <div className="rounded-[1.5rem] border border-emerald-950/10 bg-white p-4 sm:p-6">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-slate-500">Wishlist</p>
              <h1 className="mt-1 text-2xl font-semibold text-slate-950">Saved items</h1>
              <p className="mt-2 text-sm text-slate-600">
                Keep products here for later, or move them straight into cart.
              </p>
            </div>
            {items.length ? (
              <button
                type="button"
                onClick={clearWishlist}
                className="inline-flex items-center justify-center rounded-full border border-emerald-950/10 px-4 py-2 text-sm font-semibold text-slate-900 transition hover:border-emerald-300"
              >
                Clear wishlist
              </button>
            ) : null}
          </div>

          {items.length ? (
            <div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
              {items.map((product) => (
                <article key={product.slug} className="overflow-hidden rounded-[1.25rem] border border-emerald-950/10 bg-[#f7f7f3]">
                  <Link href={`/product/${product.slug}`} className="block">
                    <div className="relative aspect-[1/1] bg-white">
                      <Image
                        src={product.image}
                        alt={product.name}
                        fill
                        sizes="(max-width: 640px) 100vw, 33vw"
                        className="object-contain p-3"
                      />
                    </div>
                  </Link>
                  <div className="space-y-2 p-4">
                    <p className="text-[10px] uppercase tracking-[0.24em] text-slate-500">{product.brand}</p>
                    <h2 className="text-sm font-semibold text-slate-950 line-clamp-2">{product.name}</h2>
                    <div className="flex items-center gap-1 text-sm font-semibold text-slate-950">
                      <IndianRupee className="h-4 w-4 text-emerald-700" />
                      {product.price.toLocaleString('en-IN')}
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <Link
                        href={`/product/${product.slug}`}
                        className="inline-flex h-10 items-center justify-center rounded-full border border-emerald-950/10 bg-white px-4 text-xs font-semibold text-slate-900 transition hover:border-emerald-300"
                      >
                        Preview
                      </Link>
                      <button
                        type="button"
                        onClick={() => addToCart(product.slug)}
                        className="inline-flex h-10 items-center justify-center gap-2 rounded-full bg-emerald-950 px-4 text-xs font-semibold text-white transition hover:bg-emerald-900"
                      >
                        <ShoppingCart className="h-3.5 w-3.5" />
                        Add to cart
                      </button>
                      <button
                        type="button"
                        onClick={() => removeFromWishlist(product.slug)}
                        className="inline-flex h-10 items-center justify-center gap-2 rounded-full border border-emerald-950/10 px-4 text-xs font-semibold text-slate-700 transition hover:border-rose-200 hover:text-rose-700"
                      >
                        <HeartOff className="h-3.5 w-3.5" />
                        Remove
                      </button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div className="mt-5 rounded-[1.25rem] border border-dashed border-emerald-950/15 bg-[#f7f7f3] p-6 text-sm text-slate-600">
              No saved items yet. Open a product and use the Save button to build your wishlist.
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
