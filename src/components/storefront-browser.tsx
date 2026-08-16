'use client'

import Link from 'next/link'
import Image from 'next/image'
import { Search } from 'lucide-react'
import { MarketplaceFilterStrip, MarketplaceProductGrid } from '@/components/catalog-sections'
import { PageChrome } from '@/components/site-shell'
import { useStorefront } from '@/components/storefront-provider'

function scoreProduct(query: string, product: { name: string; brand: string; category: string; summary: string; badge: string; slug: string; rating: number; reviews: number }) {
  const normalized = query.trim().toLowerCase()
  if (!normalized) return 0

  let score = 0
  if (product.name.toLowerCase() === normalized) score += 100
  if (product.name.toLowerCase().startsWith(normalized)) score += 60
  if (product.brand.toLowerCase() === normalized) score += 50
  if (product.category.toLowerCase() === normalized) score += 45
  if (product.badge.toLowerCase() === normalized) score += 35
  if (product.slug.toLowerCase().includes(normalized)) score += 25
  if (product.name.toLowerCase().includes(normalized)) score += 20
  if (product.brand.toLowerCase().includes(normalized)) score += 12
  if (product.category.toLowerCase().includes(normalized)) score += 10
  if (product.summary.toLowerCase().includes(normalized)) score += 6
  return score + product.rating * 2 + product.reviews / 100
}

export function ShopBrowser() {
  const { products, categories } = useStorefront()
  const shopProducts = [...products].sort((a, b) => b.rating * b.reviews - a.rating * a.reviews)

  return (
    <>
      <MarketplaceFilterStrip
        title="Shop all"
        description=""
        searchAction="/search"
        searchPlaceholder="Search products, brands, or categories"
        chips={categories.map((category) => ({
          label: category.name,
          href: `/category/${category.slug}`,
        }))}
      />

      <section className="bg-[#f7f7f3]">
        <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 sm:py-6 lg:px-8">
          <div className="rounded-[1.5rem] border border-emerald-950/10 bg-white p-4 sm:p-5">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-slate-500">All products</p>
                <h2 className="mt-1 text-lg sm:text-2xl lg:text-3xl font-semibold text-slate-950">
                  Full catalog, compact marketplace grid
                </h2>
                <p className="mt-1 text-xs sm:text-sm text-slate-600">
                  Dense product tiles keep the shop page fast to scan on mobile and desktop.
                </p>
              </div>
              <Link
                href="/search"
                className="inline-flex items-center gap-2 text-sm font-medium text-blue-700 hover:text-blue-800"
              >
                Search the catalog
              </Link>
            </div>
            <MarketplaceProductGrid productSlugs={shopProducts.map((product) => product.slug)} className="mt-4" />
          </div>
        </div>
      </section>
    </>
  )
}

export function SearchBrowser({ q }: { q: string }) {
  const { products, categories } = useStorefront()
  const normalized = q.trim().toLowerCase()

  const rankedProducts = normalized
    ? [...products]
        .filter((product) =>
          [product.name, product.brand, product.category, product.summary, product.badge, product.slug].some(
            (field) => field.toLowerCase().includes(normalized),
          ),
        )
        .sort((a, b) => scoreProduct(normalized, b) - scoreProduct(normalized, a))
    : [...products].sort((a, b) => b.rating * b.reviews - a.rating * a.reviews)

  const visibleProducts = rankedProducts.slice(0, 9)

  return (
    <>
      <PageChrome
        eyebrow="Search"
        title={normalized ? `Search results for "${q}"` : 'Search the catalog.'}
        description="Fast search that ranks the most relevant products first, with clean product cards and direct buy links."
        showMetrics={false}
      />

      <section className="bg-[#f7f7f3]">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:py-8 sm:px-6 lg:px-8">
          <div className="rounded-[1.5rem] border border-emerald-950/10 bg-white p-4 sm:p-5 shadow-[0_12px_30px_rgba(15,23,42,0.05)]">
            <form action="/search" method="get" className="grid gap-2 sm:grid-cols-[1fr_auto]">
              <label className="flex items-center gap-2 rounded-full border border-emerald-950/10 bg-[#f7f7f3] px-4 py-2.5">
                <Search className="h-4 w-4 text-emerald-700" />
                <input
                  name="q"
                  defaultValue={q}
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
          </div>

          <div className="mt-5 sm:mt-6 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-slate-500">Results</p>
              <h2 className="mt-1 text-lg sm:text-2xl lg:text-3xl font-semibold text-slate-950">
                {normalized ? `Top matches for "${q}"` : 'Popular products'}
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-slate-600">{visibleProducts.length} products shown</p>
          </div>

          <MarketplaceProductGrid productSlugs={visibleProducts.map((product) => product.slug)} className="mt-5 sm:mt-6" />

          {!visibleProducts.length ? (
            <div className="mt-8 rounded-[1.75rem] border border-dashed border-emerald-950/15 bg-white p-8 text-sm text-slate-600">
              No products matched your search. Try a product name, category name, or brand.
              <div className="mt-4 flex flex-wrap gap-2">
                {categories.map((category) => (
                  <Link
                    key={category.slug}
                    href={`/category/${category.slug}`}
                    className="rounded-full border border-emerald-950/10 px-4 py-2 text-sm font-medium text-slate-700 transition hover:border-emerald-300 hover:text-emerald-900"
                  >
                    {category.name}
                  </Link>
                ))}
              </div>
            </div>
          ) : null}
        </div>
      </section>
    </>
  )
}

export function CategoriesBrowser() {
  const { categories } = useStorefront()

  return (
    <>
      <PageChrome
        eyebrow="Categories"
        title="Every category has a premium story and a clear path to purchase."
        description="Category browsing is designed to feel elegant, obvious, and mobile-friendly."
      />
      <section className="bg-[#f7f7f3]">
        <div className="mx-auto grid max-w-7xl gap-4 px-4 py-14 sm:px-6 md:grid-cols-2 xl:grid-cols-3 lg:px-8">
          {categories.map((category) => (
            <Link
              key={category.slug}
              href={`/category/${category.slug}`}
              className="rounded-[2rem] border border-emerald-950/10 bg-white p-6 shadow-[0_12px_30px_rgba(15,23,42,0.05)] transition hover:-translate-y-1"
            >
              <div className={`h-28 rounded-[1.5rem] bg-gradient-to-br ${category.accent}`} />
              <h2 className="mt-5 text-xl font-semibold text-slate-950">{category.name}</h2>
              <p className="mt-3 text-sm leading-7 text-slate-600">{category.description}</p>
            </Link>
          ))}
        </div>
      </section>
    </>
  )
}

export function CategoryBrowser({
  slug,
  q,
  brand,
  stock,
  sort,
}: {
  slug: string
  q?: string
  brand?: string
  stock?: string
  sort?: string
}) {
  const { categories, products } = useStorefront()
  const category = categories.find((item) => item.slug === slug)

  if (!category) {
    return null
  }

  const query = q?.trim() ?? ''
  const currentBrand = brand?.trim() ?? ''
  const currentStock = stock?.trim() ?? 'all'
  const currentSort = sort?.trim() ?? 'popular'

  const categoryProducts = products.filter((product) => product.category === category.slug)
  const filteredProducts = categoryProducts
    .filter((product) => {
      const matchesSearch =
        !query ||
        [product.name, product.brand, product.summary, product.badge, product.slug].some((field) =>
          field.toLowerCase().includes(query.toLowerCase()),
        )
      const matchesBrand = !currentBrand || product.brand === currentBrand
      const matchesStock = currentStock === 'all' || product.stock.toLowerCase().replace(/\s+/g, '-') === currentStock
      return matchesSearch && matchesBrand && matchesStock
    })
    .sort((left, right) => {
      if (currentSort === 'price-low') return left.price - right.price
      if (currentSort === 'price-high') return right.price - left.price
      if (currentSort === 'rating') return right.rating - left.rating
      return right.rating * right.reviews - left.rating * left.reviews
    })

  return (
    <>
      <MarketplaceFilterStrip
        title={category.name}
        description={`Only products from ${category.name.toLowerCase()} are shown here. Use search and sort to narrow the list.`}
        searchAction={`/category/${category.slug}`}
        searchPlaceholder="Search this category"
        hiddenFields={{
          brand: currentBrand || undefined,
          stock: currentStock || undefined,
          sort: currentSort,
        }}
        activeChip={currentSort}
        chips={[
          { label: 'Popular', href: `/category/${category.slug}`, active: currentSort === 'popular' },
          { label: 'Price: Low to High', href: `/category/${category.slug}?sort=price-low`, active: currentSort === 'price-low' },
          { label: 'Price: High to Low', href: `/category/${category.slug}?sort=price-high`, active: currentSort === 'price-high' },
          { label: 'Top Rated', href: `/category/${category.slug}?sort=rating`, active: currentSort === 'rating' },
        ]}
      />
      <section className="bg-[#f7f7f3]">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 sm:py-10 lg:px-8">
          <div className="rounded-[1.5rem] border border-emerald-950/10 bg-white p-4 sm:p-5">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-slate-500">Results</p>
                <h2 className="mt-1 text-lg sm:text-2xl lg:text-3xl font-semibold text-slate-950">
                  {filteredProducts.length} items in {category.name}
                </h2>
                <p className="mt-1 text-xs sm:text-sm text-slate-600">
                  Only category-specific products are shown here, in a compact shop layout.
                </p>
              </div>
            </div>
            <MarketplaceProductGrid productSlugs={filteredProducts.map((product) => product.slug)} className="mt-4" />
          </div>
        </div>
      </section>
    </>
  )
}

export function CompareBrowser() {
  const { products } = useStorefront()
  const compareProducts = products.slice(0, 4)

  return (
    <>
      <PageChrome
        eyebrow="Compare"
        title="Compare products side by side with clarity."
        description="Comparison is designed for informed decisions, not clutter."
      />
      <section className="bg-[#f7f7f3]">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <div className="rounded-[1.5rem] border border-emerald-950/10 bg-white p-4 sm:p-6">
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
              {compareProducts.map((product) => (
                <Link
                  key={product.slug}
                  href={`/product/${product.slug}`}
                  className="overflow-hidden rounded-[1.25rem] border border-emerald-950/10 bg-[#f7f7f3]"
                >
                  <div className="relative aspect-square bg-white">
                    <Image src={product.image} alt={product.name} fill className="object-contain p-4" />
                  </div>
                  <div className="p-4">
                    <h2 className="text-sm font-semibold text-slate-950 line-clamp-2">{product.name}</h2>
                    <p className="mt-1 text-xs text-slate-600">{product.brand}</p>
                    <p className="mt-2 text-sm font-semibold text-slate-950">Rs. {product.price.toLocaleString('en-IN')}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
