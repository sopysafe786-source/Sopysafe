import { notFound } from 'next/navigation'
import { CategoryBrowser } from '@/components/storefront-browser'
import { getCatalogCategory, getCatalogState } from '@/server/storage/catalog-store'

type SearchParams = {
  q?: string | string[]
  brand?: string | string[]
  stock?: string | string[]
  sort?: string | string[]
}

export function generateStaticParams() {
  return getCatalogState().categories.map((category) => ({ slug: category.slug }))
}

export default async function CategoryPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>
  searchParams?: Promise<SearchParams>
}) {
  const { slug } = await params
  const resolvedSearchParams = (await Promise.resolve(searchParams ?? {})) as SearchParams
  const q = typeof resolvedSearchParams.q === 'string' ? resolvedSearchParams.q : undefined
  const brand = typeof resolvedSearchParams.brand === 'string' ? resolvedSearchParams.brand : undefined
  const stock = typeof resolvedSearchParams.stock === 'string' ? resolvedSearchParams.stock : undefined
  const sort = typeof resolvedSearchParams.sort === 'string' ? resolvedSearchParams.sort : undefined

  if (!getCatalogCategory(slug)) {
    notFound()
  }

  return <CategoryBrowser slug={slug} q={q} brand={brand} stock={stock} sort={sort} />
}
