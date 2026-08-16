import { getCatalogState } from '@/server/storage/catalog-store'

export async function GET() {
  const { products } = getCatalogState()
  return Response.json({
    items: products,
    total: products.length,
  })
}
