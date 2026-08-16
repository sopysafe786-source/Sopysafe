'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useState } from 'react'
import { Heart, IndianRupee, Plus, Star } from 'lucide-react'
import { useStorefront } from '@/components/storefront-provider'

export function ProductCard({ slug }: { slug: string }) {
  const { products, addToCart, wishlist, toggleWishlist } = useStorefront()
  const [justAdded, setJustAdded] = useState(false)
  const product = products.find((item) => item.slug === slug)

  if (!product) return null

  const discount = Math.round(((product.mrp - product.price) / product.mrp) * 100)
  const saved = wishlist.includes(product.slug)

  const handleAddToCart = () => {
    addToCart(product.slug)
    setJustAdded(true)
    window.setTimeout(() => setJustAdded(false), 1200)
  }

  return (
    <article className="group overflow-hidden rounded-[1rem] sm:rounded-[1.15rem] border border-emerald-950/10 bg-white transition hover:border-emerald-300 hover:shadow-[0_8px_20px_rgba(15,23,42,0.05)]">
      <Link href={`/product/${product.slug}`} className="block">
        <div className="relative aspect-[0.95/1] overflow-hidden bg-slate-100">
          <Image
            src={product.image}
            alt={product.name}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1280px) 30vw, 22vw"
            className="object-contain p-1.5 sm:p-2 transition duration-500 group-hover:scale-105"
          />
          <div className="absolute left-2 top-2 rounded-full bg-emerald-950 px-2 py-1 text-[10px] font-medium tracking-wide text-emerald-50">
            {product.badge}
          </div>
          <div className="absolute right-2 top-2 rounded-full bg-white/90 px-2 py-1 text-[10px] font-semibold text-emerald-900">
            {discount}% off
          </div>
        </div>
      </Link>
      <div className="space-y-2 p-2.5 sm:p-3">
        <div className="flex items-start justify-between gap-2 sm:gap-3">
          <div>
            <p className="text-[9px] uppercase tracking-[0.24em] text-slate-500 truncate">{product.brand}</p>
            <h3 className="mt-1 text-[13px] font-semibold leading-5 text-slate-950 line-clamp-2">{product.name}</h3>
          </div>
          <div className="flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-1 text-[10px] font-semibold text-emerald-800 whitespace-nowrap">
            <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
            {product.rating.toFixed(1)}
          </div>
        </div>
        <p className="text-[11px] leading-4.5 text-slate-600 line-clamp-2">{product.summary}</p>
        <div className="flex items-center justify-between gap-3 sm:gap-3">
          <div>
            <div className="flex items-baseline gap-1 sm:gap-2">
              <span className="text-[15px] font-semibold text-slate-950">
                <IndianRupee className="mr-1 inline h-3.5 w-3.5 text-emerald-700" />
                {product.price.toLocaleString('en-IN')}
              </span>
              <span className="text-[11px] text-slate-500 line-through">
                {product.mrp.toLocaleString('en-IN')}
              </span>
            </div>
            <p className="mt-1 text-[10px] text-slate-500">{product.reviews} reviews</p>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-2 md:grid-cols-3">
          <Link
            href={`/product/${product.slug}`}
            className="inline-flex h-9 items-center justify-center rounded-full border border-emerald-950/10 px-3 text-[11px] font-semibold text-slate-900 transition hover:border-emerald-300"
          >
            Preview
          </Link>
          <button
            type="button"
            onClick={handleAddToCart}
            className="inline-flex h-9 items-center justify-center gap-2 rounded-full bg-emerald-950 px-3 text-[11px] font-semibold text-white transition hover:bg-emerald-900"
          >
            <Plus className="h-3.5 w-3.5" />
            {justAdded ? 'Added' : 'Add to cart'}
          </button>
          <button
            type="button"
            onClick={() => toggleWishlist(product.slug)}
            className="col-span-2 inline-flex h-9 items-center justify-center gap-2 rounded-full border border-emerald-950/10 px-3 text-[11px] font-semibold text-slate-900 transition hover:border-emerald-300 md:col-span-1"
          >
            <Heart className={`h-3.5 w-3.5 ${saved ? 'fill-rose-500 text-rose-500' : ''}`} />
            {saved ? 'Saved' : 'Save'}
          </button>
        </div>
      </div>
    </article>
  )
}
