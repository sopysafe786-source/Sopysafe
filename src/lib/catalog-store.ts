import 'server-only'

import crypto from 'node:crypto'
import { readJsonFile, writeJsonFile } from '@/lib/persistent-json'
import {
  categories as defaultCategories,
  defaultHomeSectionOrder,
  defaultSiteContent,
  products as defaultProducts,
  type Category,
  type HomeSectionId,
  type Product,
  type SiteContent,
} from '@/lib/storefront-data'

export type CatalogState = {
  site: SiteContent
  categories: Category[]
  products: Product[]
  homeSectionOrder: HomeSectionId[]
  updatedAt: string
}

const FILE_NAME = 'catalog.json'

declare global {
  // eslint-disable-next-line no-var
  var __sopysafeCatalogState: CatalogState | undefined
}

function normalizeProduct(product: Product): Product {
  return {
    ...product,
    galleryImages:
      Array.isArray(product.galleryImages) && product.galleryImages.length
        ? product.galleryImages
        : [product.image],
  }
}

function normalizeCategories(categories: Category[]): Category[] {
  if (!Array.isArray(categories) || !categories.length) {
    return defaultCategories
  }

  return categories.map((category) => ({
    slug: String(category.slug ?? '').trim() || crypto.randomUUID(),
    name: String(category.name ?? '').trim() || 'Category',
    description: String(category.description ?? '').trim() || 'Add a short category description.',
    accent: String(category.accent ?? '').trim() || 'from-slate-300 to-emerald-600',
  }))
}

function normalizeHomeSectionOrder(order: HomeSectionId[]): HomeSectionId[] {
  const allowed: HomeSectionId[] = ['hero', 'quickAccess', 'categories', 'bestSellers', 'trending']
  if (!Array.isArray(order) || !order.length) {
    return defaultHomeSectionOrder
  }

  return order.filter((item): item is HomeSectionId => allowed.includes(item))
}

function normalizeProducts(products: Product[]): Product[] {
  if (!Array.isArray(products) || !products.length) {
    return defaultProducts.map(normalizeProduct)
  }

  return products.map((product) => normalizeProduct(product))
}

function createDefaultState(): CatalogState {
  return {
    site: defaultSiteContent,
    categories: defaultCategories,
    products: defaultProducts.map(normalizeProduct),
    homeSectionOrder: defaultHomeSectionOrder,
    updatedAt: new Date(0).toISOString(),
  }
}

function normalizeState(state: Partial<CatalogState>): CatalogState {
  const fallback = createDefaultState()
  return {
    site: { ...defaultSiteContent, ...(state.site ?? {}) },
    categories: normalizeCategories(state.categories ?? fallback.categories),
    products: normalizeProducts(state.products ?? fallback.products),
    homeSectionOrder: normalizeHomeSectionOrder(state.homeSectionOrder ?? fallback.homeSectionOrder),
    updatedAt:
      typeof state.updatedAt === 'string' && state.updatedAt.trim()
        ? state.updatedAt.trim()
        : new Date().toISOString(),
  }
}

function loadState(): CatalogState {
  if (globalThis.__sopysafeCatalogState) {
    return globalThis.__sopysafeCatalogState
  }

  const fallback = createDefaultState()
  const parsed = readJsonFile<Partial<CatalogState>>(FILE_NAME, fallback)
  globalThis.__sopysafeCatalogState = normalizeState(parsed)
  return globalThis.__sopysafeCatalogState
}

function saveState(state: CatalogState) {
  writeJsonFile(FILE_NAME, state)
  globalThis.__sopysafeCatalogState = state
}

export function getCatalogState() {
  return loadState()
}

export function saveCatalogState(patch: Partial<CatalogState>) {
  const nextState = normalizeState({
    ...loadState(),
    ...patch,
    updatedAt: patch.updatedAt ?? new Date().toISOString(),
  })

  saveState(nextState)
  return nextState
}

export function resetCatalogState() {
  const nextState = createDefaultState()
  nextState.updatedAt = new Date().toISOString()
  saveState(nextState)
  return nextState
}

export function getCatalogProduct(slug: string) {
  return loadState().products.find((product) => product.slug === slug) ?? null
}

export function getCatalogCategory(slug: string) {
  return loadState().categories.find((category) => category.slug === slug) ?? null
}
