import { listCatalogProducts } from '@/server/services/catalog-service'

export async function GET() {
  const products = await listCatalogProducts()
  return Response.json({
    items: products,
    total: products.length,
  })
}
