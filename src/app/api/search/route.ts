import { searchCatalogProducts } from '@/server/services/catalog-service'

export async function GET(request: Request) {
  const url = new URL(request.url)
  const q = (url.searchParams.get('q') ?? '').trim()
  const { products } = await searchCatalogProducts(q)

  return Response.json({
    query: q.toLowerCase(),
    count: products.length,
    items: products,
  })
}
