'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { AlertCircle, Check, IndianRupee, LockKeyhole, LoaderCircle } from 'lucide-react'
import { useStorefront } from '@/components/storefront-provider'

export function CheckoutStudio() {
  const router = useRouter()
  const { cart, products, clearCart, addOrder } = useStorefront()
  const [customer, setCustomer] = useState({
    name: '',
    phone: '',
    email: '',
    address: '',
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isProcessing, setIsProcessing] = useState(false)

  const lines = cart
    .map((line) => {
      const product = products.find((item) => item.slug === line.slug)
      if (!product) return null
      return { ...line, product, lineTotal: product.price * line.quantity }
    })
    .filter(Boolean)

  const total = lines.reduce((sum, line) => sum + (line ? line.lineTotal : 0), 0)

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!customer.name.trim()) newErrors.name = 'Name is required'
    if (!customer.phone.trim()) newErrors.phone = 'Phone is required'
    if (!customer.email.trim()) newErrors.email = 'Email is required'
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(customer.email)) newErrors.email = 'Invalid email format'
    if (!customer.address.trim()) newErrors.address = 'Address is required'
    if (!/^\d{10}$/.test(customer.phone.replace(/\D/g, ''))) newErrors.phone = 'Phone must be 10 digits'

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const placeOrder = async () => {
    if (!validateForm()) return
    
    setIsProcessing(true)
    try {
      const order = addOrder(
        lines.map((line) => ({
          slug: line!.slug,
          name: line!.product.name,
          price: line!.product.price,
          quantity: line!.quantity,
        })),
        total,
        customer,
      )
      clearCart()
      router.push(`/checkout/success?order=${order.id}`)
    } catch (error) {
      setErrors({ submit: 'Failed to place order. Please try again.' })
      setIsProcessing(false)
    }
  }

  return (
    <section className="bg-[#f7f7f3]">
      <div className="mx-auto grid max-w-7xl gap-5 px-4 py-6 pb-40 sm:px-6 sm:py-12 sm:gap-8 lg:grid-cols-[1fr_320px] lg:px-8 lg:pb-12">
        <div className="space-y-4 sm:space-y-5">
          <div className="rounded-[1.5rem] sm:rounded-[2rem] border border-emerald-950/10 bg-white p-4 sm:p-6">
            <p className="text-xs uppercase tracking-[0.3em] text-slate-500">Checkout</p>
            <h2 className="mt-2 text-2xl sm:text-3xl font-semibold text-slate-950">Review and place your order.</h2>
            <p className="mt-2 sm:mt-3 text-xs sm:text-sm leading-6 text-slate-600">
              The flow is simple: confirm items, then place the order securely.
            </p>
          </div>
          <div className="rounded-[1.5rem] sm:rounded-[2rem] border border-emerald-950/10 bg-white p-4 sm:p-6">
            <p className="text-xs uppercase tracking-[0.3em] text-slate-500">Customer details</p>
            <div className="mt-4 grid gap-3 sm:gap-4 sm:grid-cols-2">
              <label className="grid gap-2">
                <span className="text-xs sm:text-sm font-medium text-slate-700">Full name *</span>
                <input
                  value={customer.name}
                  onChange={(event) => {
                    setCustomer((current) => ({ ...current, name: event.target.value }))
                    if (errors.name) setErrors((e) => ({ ...e, name: '' }))
                  }}
                  className={`h-11 sm:h-11 rounded-xl sm:rounded-2xl border ${errors.name ? 'border-red-500 bg-red-50' : 'border-emerald-950/10 bg-[#f7f7f3]'} px-3 sm:px-4 text-base sm:text-sm outline-none transition`}
                  placeholder="John Doe"
                />
                {errors.name && <span className="text-xs text-red-600 flex items-center gap-1"><AlertCircle className="h-3 w-3" />{errors.name}</span>}
              </label>
              <label className="grid gap-2">
                <span className="text-xs sm:text-sm font-medium text-slate-700">Phone *</span>
                <input
                  value={customer.phone}
                  onChange={(event) => {
                    setCustomer((current) => ({ ...current, phone: event.target.value }))
                    if (errors.phone) setErrors((e) => ({ ...e, phone: '' }))
                  }}
                  className={`h-11 sm:h-11 rounded-xl sm:rounded-2xl border ${errors.phone ? 'border-red-500 bg-red-50' : 'border-emerald-950/10 bg-[#f7f7f3]'} px-3 sm:px-4 text-base sm:text-sm outline-none transition`}
                  placeholder="+91 98765 43210"
                />
                {errors.phone && <span className="text-xs text-red-600 flex items-center gap-1"><AlertCircle className="h-3 w-3" />{errors.phone}</span>}
              </label>
              <label className="grid gap-2 sm:col-span-2">
                <span className="text-xs sm:text-sm font-medium text-slate-700">Email *</span>
                <input
                  type="email"
                  value={customer.email}
                  onChange={(event) => {
                    setCustomer((current) => ({ ...current, email: event.target.value }))
                    if (errors.email) setErrors((e) => ({ ...e, email: '' }))
                  }}
                  className={`h-11 sm:h-11 rounded-xl sm:rounded-2xl border ${errors.email ? 'border-red-500 bg-red-50' : 'border-emerald-950/10 bg-[#f7f7f3]'} px-3 sm:px-4 text-base sm:text-sm outline-none transition`}
                  placeholder="john@example.com"
                />
                {errors.email && <span className="text-xs text-red-600 flex items-center gap-1"><AlertCircle className="h-3 w-3" />{errors.email}</span>}
              </label>
              <label className="grid gap-2 sm:col-span-2">
                <span className="text-xs sm:text-sm font-medium text-slate-700">Shipping address *</span>
                <input
                  value={customer.address}
                  onChange={(event) => {
                    setCustomer((current) => ({ ...current, address: event.target.value }))
                    if (errors.address) setErrors((e) => ({ ...e, address: '' }))
                  }}
                  className={`h-11 sm:h-11 rounded-xl sm:rounded-2xl border ${errors.address ? 'border-red-500 bg-red-50' : 'border-emerald-950/10 bg-[#f7f7f3]'} px-3 sm:px-4 text-base sm:text-sm outline-none transition`}
                  placeholder="123 Main St, City"
                />
                {errors.address && <span className="text-xs text-red-600 flex items-center gap-1"><AlertCircle className="h-3 w-3" />{errors.address}</span>}
              </label>
            </div>
          </div>
          <div className="rounded-[1.5rem] sm:rounded-[2rem] border border-emerald-950/10 bg-white p-4 sm:p-6">
            <p className="text-xs uppercase tracking-[0.3em] text-slate-500 mb-3">Order items</p>
            <div className="grid gap-2 sm:gap-3">
              {lines.length ? (
                lines.map((line) => (
                  <div key={line!.slug} className="flex items-center justify-between rounded-xl sm:rounded-2xl bg-[#f7f7f3] p-3 sm:p-4">
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-xs sm:text-sm text-slate-950 truncate">{line!.product.name}</h3>
                      <p className="text-xs text-slate-600">Qty {line!.quantity}</p>
                    </div>
                    <div className="flex items-center gap-1 font-semibold text-xs sm:text-sm text-slate-950 ml-2 flex-shrink-0">
                      <IndianRupee className="h-3 w-3 sm:h-4 sm:w-4 text-emerald-700" />
                      {line!.lineTotal.toLocaleString('en-IN')}
                    </div>
                  </div>
                ))
              ) : (
                <div className="rounded-xl sm:rounded-2xl bg-[#f7f7f3] p-3 sm:p-4 text-xs sm:text-sm text-slate-600">
                  No items in cart. Add products from the shop first.
                </div>
              )}
            </div>
          </div>
        </div>

        <aside className="hidden rounded-[1.5rem] sm:rounded-[2rem] border border-emerald-950/10 bg-white p-4 sm:p-6 h-fit sticky top-24 lg:block">
          <div className="flex items-center gap-2 text-xs sm:text-sm font-medium text-emerald-800">
            <LockKeyhole className="h-4 w-4" />
            Secure checkout
          </div>
          <div className="mt-4 space-y-2 sm:space-y-3 text-xs sm:text-sm text-slate-600">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span className="flex items-center gap-1 font-semibold text-slate-950">
                <IndianRupee className="h-3 w-3 sm:h-4 sm:w-4" />
                {total.toLocaleString('en-IN')}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Shipping</span>
              <span className="text-xs">Calc at delivery</span>
            </div>
          </div>
          {errors.submit && (
            <div className="mt-4 rounded-lg bg-red-50 border border-red-200 p-3 flex items-start gap-2">
              <AlertCircle className="h-4 w-4 text-red-600 flex-shrink-0 mt-0.5" />
              <p className="text-xs text-red-700">{errors.submit}</p>
            </div>
          )}
          <button
            type="button"
            onClick={placeOrder}
            disabled={isProcessing || lines.length === 0}
            className={`mt-6 inline-flex w-full items-center justify-center rounded-full px-4 sm:px-5 py-2 sm:py-3 text-xs sm:text-sm font-semibold transition ${
              isProcessing || lines.length === 0
                ? 'bg-slate-300 text-slate-600 cursor-not-allowed'
                : 'bg-emerald-950 text-white hover:bg-emerald-900'
            }`}
          >
            {isProcessing ? (
              <>
                <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
                Processing...
              </>
            ) : (
              <>
                <Check className="h-4 w-4 mr-2" />
                Place Order
              </>
            )}
          </button>
          <Link
            href="/cart"
            className="mt-2 sm:mt-3 inline-flex w-full items-center justify-center rounded-full border border-emerald-950/10 px-4 sm:px-5 py-2 sm:py-3 text-xs sm:text-sm font-semibold text-slate-900 transition hover:border-emerald-300"
          >
            Back to Cart
          </Link>
        </aside>

        <div className="fixed inset-x-3 bottom-[5.5rem] z-40 rounded-[1.5rem] border border-emerald-950/10 bg-white/96 p-3 shadow-[0_16px_35px_rgba(15,23,42,0.12)] backdrop-blur md:hidden">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-[11px] uppercase tracking-[0.28em] text-slate-500">Total</p>
              <div className="mt-1 flex items-center gap-1 text-base font-semibold text-slate-950">
                <IndianRupee className="h-4 w-4 text-emerald-700" />
                {total.toLocaleString('en-IN')}
              </div>
            </div>
            <button
              type="button"
              onClick={placeOrder}
              disabled={isProcessing || lines.length === 0}
              className={`inline-flex h-12 flex-1 items-center justify-center rounded-full px-4 text-sm font-semibold transition ${
                isProcessing || lines.length === 0
                  ? 'bg-slate-300 text-slate-600 cursor-not-allowed'
                  : 'bg-emerald-950 text-white hover:bg-emerald-900'
              }`}
            >
              {isProcessing ? (
                <>
                  <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
                  Processing
                </>
              ) : (
                'Place Order'
              )}
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}
