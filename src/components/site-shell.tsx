'use client'

import Link from 'next/link'
import { CircleUserRound, House, Menu, Search, ShoppingBag, Store } from 'lucide-react'
import { usePathname } from 'next/navigation'
import { Logo } from '@/components/logo'
import { useStorefront } from '@/components/storefront-provider'
import { categories } from '@/lib/catalog'
import { navigation, policyLinks } from '@/lib/site'
import { cn } from '@/lib/utils'

export function SiteShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const { authSession } = useStorefront()
  const accountLabel = authSession ? 'Account' : 'Sign in'
  const accountHref = authSession ? '/account' : '/login'
  const hasPageLevelMobileActions =
    pathname?.startsWith('/product/') ||
    pathname?.startsWith('/buy/') ||
    pathname?.startsWith('/checkout')
  const quickLinks = [
    { href: '/cart', label: 'Cart' },
    { href: '/wishlist', label: 'Wishlist' },
    { href: accountHref, label: accountLabel },
  ]
  const mobileNav = [
    { href: '/', label: 'Home', icon: House },
    { href: '/shop', label: 'Shop', icon: Store },
    { href: '/cart', label: 'Cart', icon: ShoppingBag },
    { href: accountHref, label: accountLabel, icon: CircleUserRound },
  ]

  return (
    <div className="min-h-screen overflow-x-hidden bg-[#f6f7f4] text-slate-900">
      <header className="sticky top-0 z-40 border-b border-emerald-950/10 bg-white/96 backdrop-blur-xl">
        <div className="mx-auto max-w-7xl px-3 py-2.5 sm:px-6 sm:py-3 lg:px-8">
          <div className="flex items-center gap-2.5 sm:gap-3">
            <Link href="/" className="shrink-0">
              <Logo />
            </Link>
            <div className="ml-auto hidden items-center gap-2 md:flex">
              <Link
                href={accountHref}
                className="inline-flex items-center gap-2 rounded-full border border-emerald-950/10 bg-white px-3.5 py-2 text-sm font-semibold text-slate-700 transition hover:border-emerald-300 hover:text-emerald-900"
              >
                <CircleUserRound className="h-4 w-4 text-emerald-700" />
                {authSession ? 'Account' : 'Sign in'}
              </Link>
              <Link
                href="/orders"
                className="rounded-full border border-emerald-950/10 bg-white px-3.5 py-2 text-sm font-semibold text-slate-700 transition hover:border-emerald-300 hover:text-emerald-900"
              >
                Orders
              </Link>
              <Link
                href="/cart"
                className="rounded-full bg-emerald-950 px-3.5 py-2 text-sm font-semibold text-white transition hover:bg-emerald-900"
              >
                Cart
              </Link>
            </div>
            <details className="group relative ml-auto md:hidden">
              <summary className="flex cursor-pointer list-none items-center gap-2 rounded-full border border-emerald-950/10 bg-white px-3 py-2 text-xs text-slate-800 touch-manipulation sm:px-4 sm:py-2 sm:text-sm">
                <Menu className="h-5 w-5 sm:h-4 sm:w-4" />
                <span className="hidden sm:inline">Menu</span>
              </summary>
              <div className="absolute right-0 mt-2 w-[min(95vw,20rem)] rounded-3xl border border-emerald-950/10 bg-white p-3 shadow-2xl shadow-black/10">
                <div className="grid gap-2">
                  {quickLinks.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      className="rounded-2xl px-4 py-3 text-sm text-slate-700 transition hover:bg-emerald-50 hover:text-emerald-800"
                    >
                      {item.label}
                    </Link>
                  ))}
                  <div className="border-t border-emerald-950/10 my-2" />
                  {navigation.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      className="rounded-2xl px-4 py-3 text-sm text-slate-700 transition hover:bg-emerald-50 hover:text-emerald-800"
                    >
                      {item.label}
                    </Link>
                  ))}
                </div>
              </div>
            </details>
          </div>
          {pathname === '/' ? (
            <form action="/search" method="get" className="mt-2.5">
              <label className="flex items-center gap-2 rounded-full border border-emerald-950/10 bg-[#f7f7f3] px-4 py-2.5 shadow-[0_8px_24px_rgba(15,23,42,0.03)]">
                <Search className="h-4 w-4 text-emerald-700" />
                <input
                  name="q"
                  placeholder="Search products, brands and categories"
                  className="w-full bg-transparent text-sm outline-none placeholder:text-slate-500"
                />
              </label>
            </form>
          ) : null}
          <nav className="mt-2.5 flex gap-2 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none]">
            <Link
              href="/"
              className={cn(
                'whitespace-nowrap rounded-full px-3 py-1.5 text-xs font-medium transition',
                pathname === '/' ? 'bg-emerald-950 text-white' : 'bg-[#f7f7f3] text-slate-700 hover:bg-emerald-50',
              )}
            >
              Home
            </Link>
            <Link
              href="/shop"
              className={cn(
                'whitespace-nowrap rounded-full px-3 py-1.5 text-xs font-medium transition',
                pathname === '/shop' ? 'bg-emerald-950 text-white' : 'bg-[#f7f7f3] text-slate-700 hover:bg-emerald-50',
              )}
            >
              Shop
            </Link>
            {categories.map((category) => {
              const active = pathname?.startsWith(`/category/${category.slug}`)

              return (
                <Link
                  key={category.slug}
                  href={`/category/${category.slug}`}
                  className={cn(
                    'whitespace-nowrap rounded-full px-3 py-1.5 text-xs font-medium transition',
                    active ? 'bg-emerald-950 text-white' : 'bg-[#f7f7f3] text-slate-700 hover:bg-emerald-50',
                  )}
                >
                  {category.name}
                </Link>
              )
            })}
          </nav>
        </div>
      </header>
      <main className="pb-24 md:pb-0">{children}</main>
      <footer className="border-t border-emerald-950/10 bg-white">
        <div className="mx-auto grid w-full max-w-7xl gap-6 px-4 py-10 sm:px-6 sm:gap-8 sm:py-12 lg:grid-cols-[1.2fr_1fr_1fr] lg:px-8 lg:gap-10 lg:py-14">
          <div className="space-y-4">
            <Logo variant="footer" className="max-w-[180px] sm:max-w-[220px]" />
            <p className="max-w-xl text-xs sm:text-sm leading-6 sm:leading-7 text-slate-600">
              Premium Indian e-commerce with a simple, trustworthy shopping experience.
            </p>
          </div>
          <div>
            <h2 className="mb-3 text-xs sm:text-sm font-semibold uppercase tracking-[0.24em] text-slate-500">
              Explore
            </h2>
            <div className="grid gap-2 text-xs sm:text-sm text-slate-700">
              {navigation.map((item) => (
                <Link key={item.href} href={item.href} className="hover:text-emerald-800">
                  {item.label}
                </Link>
              ))}
            </div>
          </div>
          <div>
            <h2 className="mb-3 text-xs sm:text-sm font-semibold uppercase tracking-[0.24em] text-slate-500">
              Policies
            </h2>
            <div className="grid gap-2 text-xs sm:text-sm text-slate-700">
              {policyLinks.map((item) => (
                <Link key={item.href} href={item.href} className="hover:text-emerald-800">
                  {item.label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </footer>
      {hasPageLevelMobileActions ? null : (
        <nav
          className="fixed inset-x-0 bottom-0 z-50 border-t border-emerald-950/10 bg-white/96 px-2 py-2 backdrop-blur-xl md:hidden"
          style={{ paddingBottom: 'calc(env(safe-area-inset-bottom, 0px) + 0.5rem)' }}
        >
          <div className="mx-auto grid max-w-3xl grid-cols-4 gap-1">
            {mobileNav.map((item) => {
              const Icon = item.icon
              const active = pathname === item.href || (item.href !== '/' && pathname?.startsWith(item.href))

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    'flex flex-col items-center justify-center gap-1 rounded-2xl px-2 py-2 text-[11px] font-medium transition',
                    active
                      ? 'bg-emerald-950 text-white shadow-[0_10px_25px_rgba(7,24,19,0.22)]'
                      : 'text-slate-500 hover:bg-emerald-50 hover:text-emerald-900',
                  )}
                >
                  <Icon className="h-4 w-4" />
                  <span>{item.label}</span>
                </Link>
              )
            })}
          </div>
        </nav>
      )}
    </div>
  )
}

export function PageChrome({
  eyebrow,
  title,
  description,
  className,
  showMetrics = true,
}: {
  eyebrow: string
  title: string
  description: string
  className?: string
  showMetrics?: boolean
}) {
  return (
    <section className={cn('border-b border-emerald-950/10 bg-white', className)}>
      <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-6 sm:px-6 sm:py-8 lg:flex-row lg:items-end lg:justify-between lg:px-8 lg:py-10">
        <div>
          <p className="text-[11px] sm:text-sm font-semibold uppercase tracking-[0.32em] text-emerald-700">
            {eyebrow}
          </p>
          <h1 className="mt-3 sm:mt-4 max-w-4xl text-[clamp(1.75rem,6vw,3.25rem)] font-semibold leading-[1.05] tracking-tight text-slate-950">
            {title}
          </h1>
          <p className="mt-3 sm:mt-4 max-w-3xl text-sm sm:text-base leading-6 sm:leading-8 text-slate-600 sm:text-lg">
            {description}
          </p>
        </div>
        {showMetrics ? (
          <div className="grid gap-2 sm:grid-cols-3 lg:w-[34rem]">
            {[
              { label: 'Search-first', body: 'Find products fast' },
              { label: 'Category-first', body: 'Browse by aisle' },
              { label: 'One-tap actions', body: 'Cart, account, orders' },
            ].map((item) => (
              <div key={item.label} className="rounded-[1.25rem] border border-emerald-950/10 bg-[#f7f7f3] p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-emerald-700">{item.label}</p>
                <p className="mt-2 text-sm leading-6 text-slate-600">{item.body}</p>
              </div>
            ))}
          </div>
        ) : null}
      </div>
    </section>
  )
}
