'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { ArrowRight, Heart, IndianRupee, Package, ShieldCheck, Star, Truck } from 'lucide-react'
import { CompactShelf } from '@/components/catalog-sections'
import { ProductGallery } from '@/components/product-gallery'
import { useStorefront } from '@/components/storefront-provider'
import { categories } from '@/lib/catalog'

export function ProductDetail({ slug }: { slug: string }) {
  const router = useRouter()
  const { products, addToCart, wishlist, toggleWishlist } = useStorefront()
  const product = products.find((item) => item.slug === slug)

  if (!product) {
    return null
  }

  const category = categories.find((item) => item.slug === product.category)
  const saved = wishlist.includes(product.slug)
  const relatedSlugs = products
    .filter((item) => item.category === product.category && item.slug !== product.slug)
    .slice(0, 5)
    .map((item) => item.slug)

  const moreSlugs = products
    .filter((item) => item.category !== product.category && item.slug !== product.slug)
    .slice(0, 5)
    .map((item) => item.slug)

  const handleBuyNow = () => {
    router.push(`/buy/${product.slug}`)
  }

  return (
    <>
      <section className="bg-[#f7f7f3]">
        <div className="mx-auto max-w-7xl px-4 pt-4 sm:px-6 sm:pt-6 lg:px-8">
          <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500">
            <Link href="/" className="transition hover:text-emerald-800">
              Home
            </Link>
            <span>/</span>
            <Link href="/shop" className="transition hover:text-emerald-800">
              Shop
            </Link>
            <span>/</span>
            <Link href={`/category/${product.category}`} className="transition hover:text-emerald-800">
              {category?.name ?? product.category}
            </Link>
            <span>/</span>
            <span className="max-w-[14rem] truncate text-slate-700">{product.name}</span>
          </div>
        </div>

        <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 sm:py-6 lg:px-8">
          <div className="grid gap-4 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)_360px]">
            <div className="space-y-4">
              <div className="rounded-[1.5rem] border border-emerald-950/10 bg-white p-3 shadow-[0_10px_24px_rgba(15,23,42,0.04)] sm:p-4">
                <ProductGallery
                  title={product.name}
                  image={product.image}
                  images={product.galleryImages?.length ? product.galleryImages : [product.image]}
                />
              </div>

              <div className="rounded-[1.5rem] border border-emerald-950/10 bg-white p-4 shadow-[0_10px_24px_rgba(15,23,42,0.04)] sm:p-5">
                <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">About this item</p>
                <div className="mt-3 grid gap-2 text-sm leading-6 text-slate-600">
                  <p>{product.summary}</p>
                  <p>{product.delivery}</p>
                  <p>Designed for quick shopping decisions with simple product information and clear pricing.</p>
                </div>
              </div>
            </div>

            <div className="space-y-4 rounded-[1.5rem] border border-emerald-950/10 bg-white p-4 shadow-[0_10px_24px_rgba(15,23,42,0.04)] sm:p-5 lg:sticky lg:top-20 lg:self-start">
              <div className="flex flex-wrap items-center gap-2">
                <span className="rounded-full bg-emerald-950 px-3 py-1 text-[11px] font-medium uppercase tracking-[0.22em] text-white">
                  {product.badge}
                </span>
                <span className="rounded-full bg-emerald-50 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-emerald-900">
                  {product.stock}
                </span>
              </div>

              <div className="space-y-2">
                <p className="text-xs uppercase tracking-[0.3em] text-slate-500">{product.brand}</p>
                <h1 className="text-2xl font-semibold tracking-tight text-slate-950 sm:text-[2.15rem]">{product.name}</h1>
                <div className="flex flex-wrap items-center gap-2 text-sm text-slate-600">
                  <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-1 font-medium text-emerald-900">
                    <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                    {product.rating.toFixed(1)}
                  </span>
                  <span>{product.reviews} ratings</span>
                  <span>-</span>
                  <span>{product.stock}</span>
                </div>
              </div>

              <div className="rounded-[1.25rem] border border-emerald-950/10 bg-[#f7f7f3] p-4">
                <div className="flex items-end gap-3">
                  <div className="text-3xl font-semibold text-slate-950">
                    <IndianRupee className="mb-1 mr-1 inline h-6 w-6 text-emerald-700" />
                    {product.price.toLocaleString('en-IN')}
                  </div>
                  <div className="pb-1 text-sm text-slate-500 line-through">
                    {product.mrp.toLocaleString('en-IN')}
                  </div>
                </div>
                <p className="mt-2 text-sm text-emerald-800">You save {Math.max(product.mrp - product.price, 0).toLocaleString('en-IN')}</p>
              </div>

              <p className="text-sm leading-6 text-slate-600">{product.summary}</p>

              <div className="grid gap-2 sm:grid-cols-2">
                <div className="rounded-[1.1rem] border border-emerald-950/10 bg-[#f7f7f3] p-3 text-sm text-slate-700">
                  <span className="font-semibold text-slate-950">Colors:</span> {product.colors.join(', ')}
                </div>
                <div className="rounded-[1.1rem] border border-emerald-950/10 bg-[#f7f7f3] p-3 text-sm text-slate-700">
                  <span className="font-semibold text-slate-950">Sizes:</span> {product.sizes.join(', ')}
                </div>
              </div>

              <div className="grid gap-2">
                {[
                  { icon: Truck, title: 'Delivery', body: product.delivery },
                  { icon: ShieldCheck, title: 'Secure transaction', body: 'Checkout flow is prepared for safe provider-backed payments.' },
                  { icon: Package, title: 'Stock status', body: product.stock },
                ].map((item) => {
                  const Icon = item.icon

                  return (
                    <div key={item.title} className="rounded-[1.1rem] border border-emerald-950/10 bg-white p-3">
                      <div className="flex items-start gap-2">
                        <Icon className="mt-0.5 h-4 w-4 text-emerald-700" />
                        <div>
                          <p className="text-sm font-semibold text-slate-950">{item.title}</p>
                          <p className="mt-1 text-sm leading-6 text-slate-600">{item.body}</p>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

            <aside className="space-y-4 lg:sticky lg:top-20 lg:self-start">
              <div className="rounded-[1.5rem] border border-emerald-950/10 bg-white p-4 shadow-[0_10px_24px_rgba(15,23,42,0.04)] sm:p-5">
                <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">Buy box</p>
                <div className="mt-3 space-y-2">
                  <div className="flex items-end gap-3">
                    <div className="text-3xl font-semibold text-slate-950">
                      <IndianRupee className="mb-1 mr-1 inline h-6 w-6 text-emerald-700" />
                      {product.price.toLocaleString('en-IN')}
                    </div>
                    <div className="pb-1 text-sm text-slate-500 line-through">
                      {product.mrp.toLocaleString('en-IN')}
                    </div>
                  </div>
                  <p className="text-sm text-slate-600">{product.delivery}</p>
                  <p className="text-sm text-slate-600">
                    {product.stock === 'Low stock' ? 'Only a few left in stock.' : 'In stock and ready to ship.'}
                  </p>
                </div>

                <div className="mt-4 grid gap-2">
                  <button
                    type="button"
                    onClick={handleBuyNow}
                    className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-emerald-950 px-5 text-sm font-semibold text-white transition hover:bg-emerald-900"
                  >
                    Buy Now
                    <ArrowRight className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => addToCart(product.slug)}
                    className="inline-flex h-12 items-center justify-center rounded-full border border-emerald-950/10 px-5 text-sm font-semibold text-slate-900 transition hover:border-emerald-300"
                  >
                    Add to Cart
                  </button>
                  <button
                    type="button"
                    onClick={() => toggleWishlist(product.slug)}
                    className="inline-flex h-12 items-center justify-center gap-2 rounded-full border border-emerald-950/10 px-5 text-sm font-semibold text-slate-900 transition hover:border-emerald-300"
                  >
                    <Heart className={`h-4 w-4 ${saved ? 'fill-rose-500 text-rose-500' : ''}`} />
                    {saved ? 'Saved' : 'Save for later'}
                  </button>
                </div>

                <div className="mt-4 rounded-[1.1rem] bg-[#f7f7f3] p-3 text-sm text-slate-600">
                  <p className="font-semibold text-slate-950">Why shoppers buy here</p>
                  <ul className="mt-2 grid gap-2">
                    <li>Trusted checkout flow</li>
                    <li>Clear pricing and delivery</li>
                    <li>Simple mobile-first purchase path</li>
                  </ul>
                </div>
              </div>

              <div className="rounded-[1.5rem] border border-emerald-950/10 bg-white p-4 shadow-[0_10px_24px_rgba(15,23,42,0.04)] sm:p-5">
                <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">Highlights</p>
                <div className="mt-3 grid gap-2 text-sm text-slate-600">
                  <div className="rounded-[1.1rem] bg-[#f7f7f3] px-3 py-2">Fast checkout ready</div>
                  <div className="rounded-[1.1rem] bg-[#f7f7f3] px-3 py-2">Simple single-product view</div>
                  <div className="rounded-[1.1rem] bg-[#f7f7f3] px-3 py-2">Clear stock and delivery signals</div>
                </div>
              </div>
            </aside>
          </div>
        </div>

        <CompactShelf
          title="Frequently bought together"
          description="Related products from the same category."
          productSlugs={relatedSlugs}
        />
        <CompactShelf
          title={`More from ${category?.name ?? 'this category'}`}
          description="A second shelf to keep the shopping flow going."
          productSlugs={moreSlugs}
        />
      </section>

      <div
        className="fixed inset-x-0 bottom-0 z-40 border-t border-emerald-950/10 bg-white/98 px-3 py-3 backdrop-blur-xl md:hidden"
        style={{ paddingBottom: 'calc(env(safe-area-inset-bottom, 0px) + 0.75rem)' }}
      >
        <div className="mx-auto grid max-w-3xl grid-cols-2 gap-2">
          <button
            type="button"
            onClick={() => addToCart(product.slug)}
            className="h-12 rounded-full border border-emerald-950/10 bg-white px-4 text-sm font-semibold text-slate-900"
          >
            Add to Cart
          </button>
          <button
            type="button"
            onClick={handleBuyNow}
            className="h-12 rounded-full bg-emerald-950 px-4 text-sm font-semibold text-white"
          >
            Buy Now
          </button>
        </div>
      </div>
    </>
  )
}
