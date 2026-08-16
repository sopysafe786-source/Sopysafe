'use client'

import Link from 'next/link'
import { useStorefront } from '@/components/storefront-provider'

export default function AccountPage() {
  const { authSession, signOut, orders, cart } = useStorefront()

  const shortcutCards = [
    { label: 'My Orders', href: '/orders', value: `${orders.length}` },
    { label: 'Wishlist', href: '/wishlist', value: 'Saved' },
    { label: 'Cart', href: '/cart', value: `${cart.length}` },
    { label: 'Track Order', href: '/track-order', value: 'Live' },
  ]

  return (
    <section className="bg-[#f7f7f3]">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8 lg:py-14">
        <div className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
          <div className="space-y-4">
            <div className="rounded-[1.75rem] border border-emerald-950/10 bg-white p-5 sm:p-6">
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-slate-500">Account</p>
              <h1 className="mt-2 text-3xl font-semibold tracking-tight text-slate-950">
                {authSession ? `Hi, ${authSession.name}` : 'Sign in to your account'}
              </h1>
              <p className="mt-3 text-sm leading-6 text-slate-600">
                {authSession
                  ? `You are signed in as ${authSession.identifier}. This is the place for orders, addresses, and preferences.`
                  : 'Use login to unlock orders, saved items, and faster checkout on every device.'}
              </p>
              <div className="mt-5 flex flex-wrap gap-2">
                {authSession ? (
                  <button
                    type="button"
                    onClick={signOut}
                    className="rounded-full bg-emerald-950 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-900"
                  >
                    Sign out
                  </button>
                ) : (
                  <>
                    <Link
                      href="/login"
                      className="rounded-full bg-emerald-950 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-900"
                    >
                      Sign in
                    </Link>
                    <Link
                      href="/register"
                      className="rounded-full border border-emerald-950/10 bg-white px-4 py-2.5 text-sm font-semibold text-slate-900 transition hover:border-emerald-300"
                    >
                      Create account
                    </Link>
                  </>
                )}
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              {shortcutCards.map((item) => (
                <Link
                  key={item.label}
                  href={item.href}
                  className="rounded-[1.5rem] border border-emerald-950/10 bg-white p-4 transition hover:border-emerald-300 hover:shadow-[0_12px_30px_rgba(15,23,42,0.05)]"
                >
                  <p className="text-xs uppercase tracking-[0.28em] text-slate-500">{item.label}</p>
                  <p className="mt-2 text-lg font-semibold text-slate-950">{item.value}</p>
                </Link>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <div className="rounded-[1.75rem] border border-emerald-950/10 bg-white p-5 sm:p-6">
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-slate-500">Why account helps</p>
              <div className="mt-4 grid gap-3">
                {[
                  'Faster checkout with saved details',
                  'One place for orders and tracking',
                  'Wishlist and cart sync across visits',
                  'Clean mobile-first account access',
                ].map((item) => (
                  <div key={item} className="rounded-2xl bg-[#f7f7f3] px-4 py-3 text-sm text-slate-700">
                    {item}
                  </div>
                ))}
              </div>
            </div>
            <div className="rounded-[1.75rem] border border-emerald-950/10 bg-white p-5 sm:p-6">
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-slate-500">Support</p>
              <p className="mt-3 text-sm leading-6 text-slate-600">
                Need help with login, delivery, returns, or order status? Keep support shortcuts near the account hub just like a marketplace app.
              </p>
              <div className="mt-4 grid gap-2">
                <Link href="/track-order" className="rounded-full border border-emerald-950/10 px-4 py-3 text-sm font-semibold text-slate-900">
                  Track your order
                </Link>
                <Link href="/forgot-password" className="rounded-full border border-emerald-950/10 px-4 py-3 text-sm font-semibold text-slate-900">
                  Reset password
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
