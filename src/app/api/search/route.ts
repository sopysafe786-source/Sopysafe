import { getCatalogState } from '@/server/storage/catalog-store'

export async function GET(request: Request) {
  const url = new URL(request.url)
  const q = (url.searchParams.get('q') ?? '').trim().toLowerCase()
  const { products } = getCatalogState()

  const results = q
    ? products.filter((product) =>
        [product.name, product.brand, product.category, product.summary].some((field) =>
          field.toLowerCase().includes(q),
        ),
      )
    : products

  return Response.json({
    query: q,
    count: results.length,
    items: results,
  })
}
