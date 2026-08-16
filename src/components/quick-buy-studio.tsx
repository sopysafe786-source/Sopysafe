'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { AlertCircle, IndianRupee, LockKeyhole, LoaderCircle } from 'lucide-react'
import { ProductGallery } from '@/components/product-gallery'
import { useStorefront } from '@/components/storefront-provider'

export function QuickBuyStudio({ slug }: { slug: string }) {
  const router = useRouter()
  const { products, addOrder } = useStorefront()
  const product = products.find((item) => item.slug === slug)
  const [customer, setCustomer] = useState({
    name: '',
    phone: '',
    email: '',
    address: '',
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isProcessing, setIsProcessing] = useState(false)

  if (!product) {
    return null
  }

  const validateForm = () => {
    const nextErrors: Record<string, string> = {}

    if (!customer.name.trim()) nextErrors.name = 'Name is required'
    if (!customer.phone.trim()) nextErrors.phone = 'Phone is required'
    if (!customer.email.trim()) nextErrors.email = 'Email is required'
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(customer.email)) nextErrors.email = 'Invalid email format'
    if (!customer.address.trim()) nextErrors.address = 'Address is required'
    if (!/^\d{10}$/.test(customer.phone.replace(/\D/g, ''))) nextErrors.phone = 'Phone must be 10 digits'

    setErrors(nextErrors)
    return Object.keys(nextErrors).length === 0
  }

  const placeOrder = async () => {
    if (!validateForm()) {
      return
    }

    setIsProcessing(true)
    try {
      const order = addOrder(
        [
          {
            slug: product.slug,
            name: product.name,
            price: product.price,
            quantity: 1,
          },
        ],
        product.price,
        customer,
      )

      router.push(`/checkout/success?order=${order.id}`)
    } catch {
      setErrors({ submit: 'Unable to place order right now. Please try again.' })
      setIsProcessing(false)
    }
  }

  return (
    <section className="bg-[#f7f7f3]">
      <div className="mx-auto grid max-w-7xl gap-6 sm:gap-8 px-4 py-8 sm:py-12 sm:px-6 lg:grid-cols-[1fr_320px] lg:px-8">
        <div className="space-y-4 sm:space-y-6">
          <div className="rounded-[1.5rem] sm:rounded-[2rem] border border-emerald-950/10 bg-white p-4 sm:p-6">
            <p className="text-xs uppercase tracking-[0.3em] text-slate-500">Buy now</p>
            <h2 className="mt-2 sm:mt-3 text-2xl sm:text-3xl font-semibold text-slate-950">{product.name}</h2>
            <p className="mt-2 sm:mt-3 text-xs sm:text-sm leading-6 sm:leading-7 text-slate-600">
              You are on a dedicated purchase page. Review the product, fill your details, and place the order directly.
            </p>
          </div>

          <div className="grid gap-4 sm:gap-6 lg:gap-8 lg:grid-cols-[0.9fr_1.1fr]">
            <ProductGallery
              title={product.name}
              image={product.image}
              images={product.galleryImages?.length ? product.galleryImages : [product.image]}
            />

            <div className="space-y-3 sm:space-y-4 rounded-[1.5rem] sm:rounded-[2rem] border border-emerald-950/10 bg-white p-4 sm:p-6">
              <div className="flex items-center gap-2 sm:gap-3">
                <span className="rounded-full bg-emerald-950 px-2 sm:px-3 py-1 text-xs font-medium text-white">
                  {product.badge}
                </span>
                <span className="rounded-full bg-slate-100 px-2 sm:px-3 py-1 text-xs font-semibold text-slate-700">
                  {product.stock}
                </span>
              </div>
              <p className="text-xs uppercase tracking-[0.28em] text-slate-500">{product.brand}</p>
              <div className="flex items-end gap-3 sm:gap-4">
                <div className="text-3xl sm:text-4xl font-semibold text-slate-950">
                  <IndianRupee className="mb-1 mr-1 inline h-6 w-6 sm:h-7 sm:w-7 text-emerald-700" />
                  {product.price.toLocaleString('en-IN')}
                </div>
                <div className="pb-1 text-xs sm:text-sm text-slate-500 line-through">
                  {product.mrp.toLocaleString('en-IN')}
                </div>
              </div>
              <p className="text-xs sm:text-sm leading-6 sm:leading-7 text-slate-600">{product.summary}</p>
              <div className="rounded-[1.25rem] sm:rounded-[1.5rem] border border-emerald-950/10 bg-[#f7f7f3] p-3 sm:p-4 text-xs sm:text-sm text-slate-600">
                <span className="font-semibold text-slate-900">Delivery:</span> {product.delivery}
              </div>
              <div className="grid gap-2 sm:gap-3 sm:grid-cols-2">
                <Link
                  href={`/product/${product.slug}`}
                  className="rounded-full border border-emerald-950/10 px-4 sm:px-5 py-2 sm:py-3 text-center text-xs sm:text-sm font-semibold text-slate-900 transition hover:border-emerald-300"
                >
                  View product
                </Link>
                <Link
                  href="/shop"
                  className="rounded-full bg-emerald-950 px-4 sm:px-5 py-2 sm:py-3 text-center text-xs sm:text-sm font-semibold text-white transition hover:bg-emerald-900"
                >
                  Continue shopping
                </Link>
              </div>
            </div>
          </div>

          <div className="rounded-[1.5rem] sm:rounded-[2rem] border border-emerald-950/10 bg-white p-4 sm:p-6">
            <p className="text-xs uppercase tracking-[0.3em] text-slate-500">Customer details</p>
            <div className="mt-3 sm:mt-4 grid gap-3 sm:gap-4 sm:grid-cols-2">
              <label className="grid gap-2">
                <span className="text-xs sm:text-sm font-medium text-slate-700">Full name</span>
                <input
                  value={customer.name}
                  onChange={(event) => {
                    setCustomer((current) => ({ ...current, name: event.target.value }))
                    if (errors.name) setErrors((current) => ({ ...current, name: '' }))
                  }}
                  className={`h-10 sm:h-11 rounded-xl sm:rounded-2xl border ${errors.name ? 'border-red-500 bg-red-50' : 'border-emerald-950/10 bg-[#f7f7f3]'} px-3 sm:px-4 text-xs sm:text-sm outline-none`}
                  placeholder="John Doe"
                />
                {errors.name && <span className="text-xs text-red-600 flex items-center gap-1"><AlertCircle className="h-3 w-3" />{errors.name}</span>}
              </label>
              <label className="grid gap-2">
                <span className="text-xs sm:text-sm font-medium text-slate-700">Phone</span>
                <input
                  value={customer.phone}
                  onChange={(event) => {
                    setCustomer((current) => ({ ...current, phone: event.target.value }))
                    if (errors.phone) setErrors((current) => ({ ...current, phone: '' }))
                  }}
                  className={`h-10 sm:h-11 rounded-xl sm:rounded-2xl border ${errors.phone ? 'border-red-500 bg-red-50' : 'border-emerald-950/10 bg-[#f7f7f3]'} px-3 sm:px-4 text-xs sm:text-sm outline-none`}
                  placeholder="+91 98765 43210"
                />
                {errors.phone && <span className="text-xs text-red-600 flex items-center gap-1"><AlertCircle className="h-3 w-3" />{errors.phone}</span>}
              </label>
              <label className="grid gap-2">
                <span className="text-xs sm:text-sm font-medium text-slate-700">Email</span>
                <input
                  type="email"
                  value={customer.email}
                  onChange={(event) => {
                    setCustomer((current) => ({ ...current, email: event.target.value }))
                    if (errors.email) setErrors((current) => ({ ...current, email: '' }))
                  }}
                  className={`h-10 sm:h-11 rounded-xl sm:rounded-2xl border ${errors.email ? 'border-red-500 bg-red-50' : 'border-emerald-950/10 bg-[#f7f7f3]'} px-3 sm:px-4 text-xs sm:text-sm outline-none`}
                  placeholder="john@example.com"
                />
                {errors.email && <span className="text-xs text-red-600 flex items-center gap-1"><AlertCircle className="h-3 w-3" />{errors.email}</span>}
              </label>
              <label className="grid gap-2">
                <span className="text-xs sm:text-sm font-medium text-slate-700">Shipping address</span>
                <input
                  value={customer.address}
                  onChange={(event) => {
                    setCustomer((current) => ({ ...current, address: event.target.value }))
                    if (errors.address) setErrors((current) => ({ ...current, address: '' }))
                  }}
                  className={`h-10 sm:h-11 rounded-xl sm:rounded-2xl border ${errors.address ? 'border-red-500 bg-red-50' : 'border-emerald-950/10 bg-[#f7f7f3]'} px-3 sm:px-4 text-xs sm:text-sm outline-none`}
                  placeholder="123 Main St, City"
                />
                {errors.address && <span className="text-xs text-red-600 flex items-center gap-1"><AlertCircle className="h-3 w-3" />{errors.address}</span>}
              </label>
            </div>
          </div>
        </div>

        <aside className="rounded-[1.5rem] sm:rounded-[2rem] border border-emerald-950/10 bg-white p-4 sm:p-6 h-fit sticky top-24">
          <div className="flex items-center gap-2 text-xs sm:text-sm font-medium text-emerald-800">
            <LockKeyhole className="h-4 w-4 sm:h-5 sm:w-5" />
            Secure purchase
          </div>
          <div className="mt-3 sm:mt-4 space-y-2 sm:space-y-3 text-xs sm:text-sm text-slate-600">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span className="flex items-center gap-1 font-semibold text-slate-950">
                <IndianRupee className="h-3 w-3 sm:h-4 sm:w-4" />
                {product.price.toLocaleString('en-IN')}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Items</span>
              <span>1</span>
            </div>
          </div>
          <button
            type="button"
            onClick={placeOrder}
            disabled={isProcessing}
            className={`mt-4 sm:mt-6 inline-flex w-full items-center justify-center rounded-full px-4 sm:px-5 py-2 sm:py-3 text-xs sm:text-sm font-semibold text-white transition ${
              isProcessing ? 'cursor-not-allowed bg-slate-300 text-slate-600' : 'bg-emerald-950 hover:bg-emerald-900'
            }`}
          >
            {isProcessing ? (
              <>
                <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
                Processing...
              </>
            ) : (
              'Place Order'
            )}
          </button>
          {errors.submit && (
            <div className="mt-3 rounded-xl border border-red-200 bg-red-50 p-3 text-xs text-red-700">
              {errors.submit}
            </div>
          )}
          <Link
            href="/checkout"
            className="mt-2 sm:mt-3 inline-flex w-full items-center justify-center rounded-full border border-emerald-950/10 px-4 sm:px-5 py-2 sm:py-3 text-xs sm:text-sm font-semibold text-slate-900"
          >
            Go to checkout
          </Link>
        </aside>
      </div>
    </section>
  )
}
