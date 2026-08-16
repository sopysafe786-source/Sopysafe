'use client'

import Image from 'next/image'
import Link from 'next/link'
import { Search, ShoppingBag, Sparkles, Truck } from 'lucide-react'
import { AnimatedSection } from '@/components/animated-section'
import { ProductCard } from '@/components/product-card'
import { SectionHeading } from '@/components/section'
import { useStorefront } from '@/components/storefront-provider'
import { featuredBrands } from '@/lib/catalog'
import type { HomeSectionId } from '@/lib/storefront-data'

export function HeroSection() {
  const { site } = useStorefront()

  return (
    <section className="bg-white">
      <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 sm:py-5 lg:px-8 lg:py-6">
        <AnimatedSection>
          <div className="rounded-[1.25rem] border border-emerald-950/10 bg-white px-4 py-4 sm:rounded-[1.5rem] sm:px-6 sm:py-5">
            <div className="flex flex-col gap-3">
              <span className="inline-flex w-fit items-center gap-2 rounded-full border border-emerald-950/10 bg-emerald-50 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.22em] text-emerald-800 sm:text-xs">
                <Sparkles className="h-3 w-3" />
                {site.heroEyebrow}
              </span>
              <div className="max-w-3xl space-y-2">
                <h1 className="text-[clamp(1.7rem,5vw,2.85rem)] font-semibold leading-[1.04] tracking-tight text-slate-950">
                  {site.heroTitle}
                </h1>
                <p className="max-w-2xl text-sm leading-6 text-slate-600 sm:text-base sm:leading-7">
                  {site.heroDescription}
                </p>
              </div>
              <form action="/search" method="get" className="grid gap-2 sm:max-w-2xl sm:grid-cols-[1fr_auto]">
                <label className="flex items-center gap-2 rounded-full border border-emerald-950/10 bg-[#f7f7f3] px-4 py-2.5">
                  <Search className="h-4 w-4 text-emerald-700" />
                  <input
                    name="q"
                    placeholder="Search products, brands, or categories"
                    className="w-full bg-transparent text-sm outline-none placeholder:text-slate-500"
                  />
                </label>
                <button
                  type="submit"
                  className="inline-flex items-center justify-center rounded-full bg-emerald-950 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-900"
                >
                  Search
                </button>
              </form>
              <div className="flex gap-2 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] sm:flex-wrap sm:overflow-visible sm:pb-0 sm:gap-2.5">
                <Link
                  href="/shop"
                  className="whitespace-nowrap rounded-full bg-emerald-950 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-900"
                >
                  Start Shopping
                </Link>
                <Link
                  href="/categories"
                  className="whitespace-nowrap rounded-full border border-emerald-950/10 bg-white px-4 py-2.5 text-sm font-semibold text-slate-800 transition hover:border-emerald-300 hover:text-emerald-900"
                >
                  Browse categories
                </Link>
                <Link
                  href="/orders"
                  className="whitespace-nowrap rounded-full border border-emerald-950/10 bg-white px-4 py-2.5 text-sm font-semibold text-slate-800 transition hover:border-emerald-300 hover:text-emerald-900"
                >
                  Orders
                </Link>
                <Link
                  href="/cart"
                  className="whitespace-nowrap rounded-full border border-emerald-950/10 bg-white px-4 py-2.5 text-sm font-semibold text-slate-800 transition hover:border-emerald-300 hover:text-emerald-900"
                >
                  Cart
                </Link>
              </div>
            </div>
          </div>
        </AnimatedSection>
      </div>
    </section>
  )
}

export function QuickAccessStrip() {
  const { authSession, products } = useStorefront()
  const highlights = [
    {
      title: 'Up to 40% off',
      body: 'Kitchen, home, and daily essentials',
      href: '/shop',
      cta: 'Shop deals',
      image: products[0]?.image ?? '/hero-commerce-scene.png',
    },
    {
      title: authSession ? 'Welcome back' : 'Sign in & save',
      body: authSession ? 'Jump into orders and wishlist faster' : 'Get faster checkout and better offers',
      href: authSession ? '/account' : '/login',
      cta: authSession ? 'Open account' : 'Sign in',
      image: products[1]?.image ?? '/hero-commerce-scene.png',
    },
    {
      title: 'Track your order',
      body: 'Live updates with a clean delivery flow',
      href: '/orders',
      cta: 'View orders',
      image: products[2]?.image ?? '/hero-commerce-scene.png',
    },
    {
      title: 'Search best picks',
      body: 'Explore trending products and quick buys',
      href: '/search',
      cta: 'Search now',
      image: products[3]?.image ?? '/hero-commerce-scene.png',
    },
  ]

  return (
    <section className="bg-[#f7f7f3]">
      <div className="mx-auto max-w-7xl px-4 py-3 sm:px-6 sm:py-5 lg:px-8">
        <div className="grid grid-cols-2 gap-2 sm:gap-3 xl:grid-cols-4">
          {highlights.map((item) => {
            const isWide = item.title === 'Up to 40% off'

            return (
              <Link
                key={item.title}
                href={item.href}
                className={`group overflow-hidden rounded-[1rem] border border-emerald-950/10 bg-white shadow-[0_10px_30px_rgba(15,23,42,0.04)] transition hover:-translate-y-0.5 hover:border-emerald-300 hover:shadow-[0_14px_32px_rgba(15,23,42,0.07)] ${
                  isWide ? 'sm:col-span-2' : ''
                }`}
              >
                <div className="relative min-h-[8.75rem] sm:min-h-[10rem]">
                  <Image
                    src={item.image}
                    alt={item.title}
                    fill
                    sizes="(max-width: 640px) 50vw, (max-width: 1280px) 25vw, 20vw"
                    className="object-cover transition duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-slate-950/75 via-slate-950/25 to-transparent" />
                  <div className="absolute inset-0 flex flex-col justify-between p-3 sm:p-4 text-white">
                    <div className="w-fit rounded-full bg-white/15 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.22em] backdrop-blur">
                      Offer
                    </div>
                    <div className="max-w-[12rem]">
                      <h3 className="text-sm font-semibold leading-5 sm:text-base">{item.title}</h3>
                      <p className="mt-1 text-[11px] leading-4.5 text-white/85 sm:text-sm sm:leading-6">{item.body}</p>
                      <span className="mt-2 inline-flex rounded-full bg-white px-3 py-1.5 text-[11px] font-semibold text-slate-950">
                        {item.cta}
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            )
          })}
        </div>
      </div>
    </section>
  )
}

export function CategoryStrip() {
  const { categories, products } = useStorefront()

  return (
    <section className="bg-[#f7f7f3]">
      <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 sm:py-8 lg:px-8 lg:py-10">
        <SectionHeading
          eyebrow="Categories"
          title="Browse by category."
          description="Simple category cards keep shopping quick, clear, and easy to scan."
        />
        <div className="mt-4 flex gap-3 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] sm:mt-6 sm:grid sm:overflow-visible sm:pb-0 sm:grid-cols-2 xl:grid-cols-4">
          {categories.map((category) => {
            const featuredProduct = products.find((product) => product.category === category.slug)

            return (
              <Link
                key={category.slug}
                href={`/category/${category.slug}`}
                className="group min-w-[14rem] overflow-hidden rounded-[1rem] border border-emerald-950/10 bg-white transition hover:border-emerald-300 hover:shadow-[0_12px_30px_rgba(15,23,42,0.06)] sm:min-w-0 sm:rounded-[1.25rem]"
              >
                <div className="grid gap-2 sm:gap-3 p-3 sm:p-4">
                  <div className={`relative h-22 sm:h-36 overflow-hidden rounded-[0.9rem] sm:rounded-[1.05rem] bg-gradient-to-br ${category.accent}`}>
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.32),transparent_40%)]" />
                    {featuredProduct ? (
                      <Image
                        src={featuredProduct.image}
                        alt={category.name}
                        fill
                        className="object-contain p-3 sm:p-4 transition duration-500 group-hover:scale-105"
                        sizes="(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 33vw"
                      />
                    ) : null}
                  </div>
                  <div>
                    <h3 className="text-sm sm:text-base font-semibold text-slate-950">{category.name}</h3>
                    <p className="mt-1 text-[11px] sm:text-sm leading-4.5 sm:leading-6 text-slate-600 line-clamp-2">{category.description}</p>
                  </div>
                </div>
              </Link>
            )
          })}
        </div>
      </div>
    </section>
  )
}

export function ProductRail({
  title,
  description,
  productSlugs,
}: {
  title: string
  description: string
  productSlugs?: string[]
}) {
  const { products } = useStorefront()
  const visibleSlugs = productSlugs?.length ? productSlugs : products.map((product) => product.slug)
  const featuredSlugs = visibleSlugs.slice(0, 3)

  return (
    <section className="bg-[#f7f7f3]">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
        <SectionHeading eyebrow="Products" title={title} description={description} />
        {featuredSlugs.length ? (
          <div className="mt-6 grid gap-3 sm:mt-8 sm:grid-cols-2 sm:gap-4 lg:grid-cols-3">
            {featuredSlugs.map((slug) => {
              const product = products.find((item) => item.slug === slug)
              if (!product) return null

              return (
                <Link
                  key={product.slug}
                  href={`/product/${product.slug}`}
                  className="group overflow-hidden rounded-[1.5rem] sm:rounded-[2rem] border border-emerald-950/10 bg-white transition hover:border-emerald-300 hover:shadow-[0_12px_30px_rgba(15,23,42,0.06)]"
                >
                  <div className="relative aspect-[4/3] bg-slate-100">
                    <Image
                      src={product.image}
                      alt={product.name}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 33vw"
                      className="object-contain p-3 sm:p-4 transition duration-500 group-hover:scale-105"
                    />
                  </div>
                  <div className="p-3 sm:p-5">
                    <p className="text-xs uppercase tracking-[0.28em] text-slate-500 truncate">{product.brand}</p>
                    <h3 className="mt-1 sm:mt-2 text-sm sm:text-lg font-semibold text-slate-950 line-clamp-2">{product.name}</h3>
                    <p className="mt-1 sm:mt-2 text-xs sm:text-sm text-slate-600 line-clamp-2">{product.summary}</p>
                  </div>
                </Link>
              )
            })}
          </div>
        ) : null}
        <div className="mt-6 grid gap-3 sm:mt-8 sm:grid-cols-2 sm:gap-4 md:grid-cols-3">
          {visibleSlugs.map((slug) => (
            <ProductCard key={slug} slug={slug} />
          ))}
        </div>
      </div>
    </section>
  )
}

export function MarketplaceProductGrid({
  productSlugs,
  className = '',
}: {
  productSlugs: string[]
  className?: string
}) {
  return (
    <div className={`grid grid-cols-2 gap-2 sm:gap-3 md:grid-cols-3 xl:grid-cols-4 ${className}`.trim()}>
      {productSlugs.map((slug) => (
        <ProductCard key={slug} slug={slug} />
      ))}
    </div>
  )
}

export function CompactShelf({
  title,
  description,
  productSlugs,
}: {
  title: string
  description: string
  productSlugs: string[]
}) {
  const { products } = useStorefront()

  return (
    <section className="bg-[#f7f7f3]">
      <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 sm:py-6 lg:px-8">
        <div className="rounded-[1.5rem] border border-emerald-950/10 bg-white p-4 sm:p-5">
          <div className="flex items-center justify-between gap-3">
            <div>
              <h2 className="text-base sm:text-xl font-semibold text-slate-950">{title}</h2>
              <p className="mt-1 text-xs sm:text-sm text-slate-600">{description}</p>
            </div>
            <Link href="/shop" className="text-xs sm:text-sm font-medium text-blue-700 hover:text-blue-800">
              See all
            </Link>
          </div>
          <div className="mt-4 flex gap-3 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none]">
            {productSlugs.map((slug) => {
              const product = products.find((item) => item.slug === slug)
              if (!product) return null

              return (
                <Link
                  key={product.slug}
                  href={`/product/${product.slug}`}
                  className="min-w-[10.25rem] max-w-[10.25rem] rounded-[1.1rem] border border-emerald-950/10 bg-[#f7f7f3] p-2 transition hover:border-emerald-300 sm:min-w-[11rem] sm:max-w-[11rem]"
                >
                  <div className="relative aspect-[1/1] overflow-hidden rounded-[0.95rem] bg-white">
                    <Image
                      src={product.image}
                      alt={product.name}
                      fill
                      sizes="(max-width: 640px) 45vw, 12rem"
                      className="object-contain p-1.5"
                    />
                  </div>
                  <p className="mt-2 text-[10px] uppercase tracking-[0.22em] text-slate-500 truncate">{product.brand}</p>
                  <h3 className="mt-1 text-[11px] font-semibold leading-4 text-slate-950 line-clamp-2">{product.name}</h3>
                  <div className="mt-1.5 flex items-baseline gap-1.5">
                    <span className="text-xs font-semibold text-slate-950">Rs.{product.price.toLocaleString('en-IN')}</span>
                    <span className="text-[10px] text-slate-500 line-through">Rs.{product.mrp.toLocaleString('en-IN')}</span>
                  </div>
                </Link>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}

export function MarketplaceFilterStrip({
  title,
  description,
  searchAction,
  searchPlaceholder,
  chips,
  activeChip,
  hiddenFields,
}: {
  title: string
  description: string
  searchAction: string
  searchPlaceholder: string
  chips: Array<{ label: string; href: string; active?: boolean }>
  activeChip?: string
  hiddenFields?: Record<string, string | undefined>
}) {
  return (
    <section className="bg-[#f7f7f3]">
      <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 sm:py-6 lg:px-8">
        <div className="rounded-[1.5rem] border border-emerald-950/10 bg-white p-4 shadow-[0_10px_24px_rgba(15,23,42,0.04)] sm:p-5">
          <div className="flex flex-wrap items-center gap-2 text-xs font-semibold uppercase tracking-[0.24em] text-emerald-700">
            <Sparkles className="h-4 w-4" />
            Marketplace browsing
          </div>
          <div className="mt-3 grid gap-3 lg:grid-cols-[1fr_auto] lg:items-center">
            <form action={searchAction} method="get" className="grid gap-2 sm:grid-cols-[1fr_auto]">
              <label className="flex items-center gap-2 rounded-full border border-emerald-950/10 bg-[#f7f7f3] px-4 py-2.5">
                <Search className="h-4 w-4 text-emerald-700" />
                <input
                  name="q"
                  placeholder={searchPlaceholder}
                  className="w-full bg-transparent text-sm outline-none placeholder:text-slate-500"
                />
              </label>
              {hiddenFields
                ? Object.entries(hiddenFields).map(([name, value]) =>
                    value ? <input key={name} type="hidden" name={name} value={value} /> : null,
                  )
                : null}
              <button
                type="submit"
                className="inline-flex items-center justify-center rounded-full bg-emerald-950 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-900"
              >
                Search
              </button>
            </form>
            <div className="flex gap-2 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] lg:justify-end">
              {chips.map((chip) => (
                <Link
                  key={chip.href}
                  href={chip.href}
                  className={`whitespace-nowrap rounded-full px-3 py-2 text-xs font-medium transition ${
                    chip.active || activeChip === chip.label
                      ? 'bg-emerald-950 text-white'
                      : 'border border-emerald-950/10 bg-[#f7f7f3] text-slate-700 hover:border-emerald-300 hover:text-emerald-900'
                  }`}
                >
                  {chip.label}
                </Link>
              ))}
            </div>
          </div>
          {description ? <p className="mt-3 text-xs sm:text-sm text-slate-600">{description}</p> : null}
        </div>
      </div>
    </section>
  )
}

export function BrandStrip() {
  return (
    <section className="bg-[#f7f7f3]">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
        <div className="rounded-[1.5rem] sm:rounded-[2rem] border border-emerald-950/10 bg-white px-4 sm:px-6 py-6 sm:py-8">
          <p className="text-xs uppercase tracking-[0.3em] text-slate-500">Brands</p>
          <div className="mt-4 sm:mt-5 grid grid-cols-2 gap-2 sm:gap-3 sm:grid-cols-3 lg:grid-cols-6">
            {featuredBrands.map((brand) => (
              <div key={brand} className="rounded-lg sm:rounded-2xl border border-emerald-950/10 px-3 sm:px-4 py-2 sm:py-4 text-center text-xs sm:text-sm font-medium text-slate-700">
                {brand}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

export function HomeRenderer() {
  const { homeSectionOrder, categories, products } = useStorefront()
  const orderedSections = [
    'quickAccess',
    'categories',
    ...homeSectionOrder.filter(
      (section) =>
        section !== 'hero' &&
        section !== 'quickAccess' &&
        section !== 'categories' &&
        section !== 'bestSellers' &&
        section !== 'trending',
    ),
  ] as HomeSectionId[]
  const allProductSlugs = products.map((product) => product.slug)
  const browseChips = [
    { label: 'Shop all', href: '/shop' },
    { label: 'Categories', href: '/categories' },
    { label: 'Search', href: '/search' },
    ...products
      .slice(0, 4)
      .map((product) => product.category)
      .filter((slug, index, array) => array.indexOf(slug) === index)
      .map((slug) => {
        const category = categories.find((item) => item.slug === slug)
        return category ? { label: category.name, href: `/category/${category.slug}` } : null
      })
      .filter((chip): chip is { label: string; href: string } => chip !== null),
  ]

  return (
    <>
      {orderedSections.map((section) => {
        if (section === 'quickAccess') return <QuickAccessStrip key={section} />
        if (section === 'categories') return <CategoryStrip key={section} />
        return null
      })}
      <section className="bg-[#f7f7f3]">
        <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 sm:py-6 lg:px-8">
          <div className="rounded-[1.5rem] border border-emerald-950/10 bg-white p-4 sm:p-5">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-slate-500">All products</p>
                <h2 className="mt-1 text-lg sm:text-2xl font-semibold text-slate-950">
                  Full catalog on the home page
                </h2>
                <p className="mt-1 text-xs sm:text-sm text-slate-600">
                  Browse every product immediately in a compact marketplace grid.
                </p>
              </div>
              <Link
                href="/shop"
                className="inline-flex items-center justify-center rounded-full border border-emerald-950/10 bg-[#f7f7f3] px-4 py-2 text-sm font-medium text-slate-700 transition hover:border-emerald-300 hover:text-emerald-900"
              >
                Open shop
              </Link>
            </div>
            <MarketplaceProductGrid productSlugs={allProductSlugs} className="mt-4" />
          </div>
        </div>
      </section>
      <MarketplaceFilterStrip
        title="Browse the full catalog"
        description="Use the top strip to jump fast, then keep scrolling through the rest of the marketplace below."
        searchAction="/search"
        searchPlaceholder="Search products, brands, or categories"
        chips={browseChips}
      />
      <CompactShelf
        title="Today's deals"
        description="Quick price-forward picks with a horizontal shelf like Amazon."
        productSlugs={[
          'verde-smart-kitchen-jar-set',
          'daily-balance-grocery-care-pack',
          'purenest-ceramic-mug-set',
          'aurora-noise-canceling-headphones',
          'heritage-leather-sling-bag',
        ]}
      />
      <CompactShelf
        title="Recommended for you"
        description="A clean shopping feed with direct product access."
        productSlugs={[
          'saffron-glow-facial-kit',
          'aurora-noise-canceling-headphones',
          'heritage-leather-sling-bag',
          'verde-smart-kitchen-jar-set',
          'purenest-ceramic-mug-set',
        ]}
      />
    </>
  )
}
