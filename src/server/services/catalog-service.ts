import { getCatalogCategory, getCatalogProduct, getCatalogState, resetCatalogState, saveCatalogState } from '@/lib/catalog-store'
import type { CatalogState } from '@/lib/catalog-store'

function scoreProduct(query: string, product: CatalogState['products'][number]) {
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

export async function readCatalog() {
  return getCatalogState()
}

export async function writeCatalog(patch: Partial<CatalogState>) {
  return saveCatalogState(patch)
}

export async function resetCatalog() {
  return resetCatalogState()
}

export async function listCatalogProducts() {
  return (await readCatalog()).products
}

export async function listCatalogCategories() {
  return (await readCatalog()).categories
}

export async function findCatalogProduct(slug: string) {
  return getCatalogProduct(slug)
}

export async function findCatalogCategory(slug: string) {
  return getCatalogCategory(slug)
}

export async function searchCatalogProducts(query: string) {
  const normalized = query.trim().toLowerCase()
  const products = (await readCatalog()).products

  const rankedProducts = normalized
    ? [...products]
        .filter((product) =>
          [product.name, product.brand, product.category, product.summary, product.badge, product.slug].some((field) =>
            field.toLowerCase().includes(normalized),
          ),
        )
        .sort((a, b) => scoreProduct(normalized, b) - scoreProduct(normalized, a))
    : [...products].sort((a, b) => b.rating * b.reviews - a.rating * a.reviews)

  return {
    query: normalized,
    products: rankedProducts,
    total: rankedProducts.length,
  }
}
