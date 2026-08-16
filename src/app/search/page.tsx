import type { Metadata } from 'next'
import { SearchBrowser } from '@/components/storefront-browser'
import { siteName, siteUrl } from '@/lib/site'
import type { Product } from '@/lib/storefront-data'

type SearchParams = {
  q?: string
}

export async function generateMetadata({
  searchParams,
}: {
  searchParams?: SearchParams
}): Promise<Metadata> {
  const q = searchParams?.q?.trim()

  return {
    title: q ? `Search results for "${q}"` : 'Search',
    description: q
      ? `Search results for "${q}" across the ${siteName} catalog.`
      : 'Search the SopySafe catalog by product, brand, or category.',
    alternates: {
      canonical: q ? siteUrl(`/search?q=${encodeURIComponent(q)}`) : siteUrl('/search'),
    },
    robots: {
      index: false,
      follow: true,
    },
  }
}

function scoreProduct(query: string, product: Product) {
  const normalized = query.trim().toLowerCase()
  if (!normalized) return 0

  const fields = {
    name: product.name.toLowerCase(),
    brand: product.brand.toLowerCase(),
    category: product.category.toLowerCase(),
    summary: product.summary.toLowerCase(),
    badge: product.badge.toLowerCase(),
    slug: product.slug.toLowerCase(),
  }

  let score = 0
  if (fields.name === normalized) score += 100
  if (fields.name.startsWith(normalized)) score += 60
  if (fields.brand === normalized) score += 50
  if (fields.category === normalized) score += 45
  if (fields.badge === normalized) score += 35
  if (fields.slug.includes(normalized)) score += 25
  if (fields.name.includes(normalized)) score += 20
  if (fields.brand.includes(normalized)) score += 12
  if (fields.category.includes(normalized)) score += 10
  if (fields.summary.includes(normalized)) score += 6
  return score + product.rating * 2 + product.reviews / 100
}

export default function SearchPage({
  searchParams,
}: {
  searchParams?: SearchParams
}) {
  const q = searchParams?.q?.trim() ?? ''
  return <SearchBrowser q={q} />
}
