'use client'

import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
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
import type {
  CustomerInfo,
  OrderLine,
  OrderRecord,
  OrderStatus,
} from '@/lib/order-types'

type CartLine = {
  slug: string
  quantity: number
}

type AuthSession = {
  name: string
  identifier: string
}

type StorefrontState = {
  site: SiteContent
  categories: Category[]
  products: Product[]
  homeSectionOrder: HomeSectionId[]
  cart: CartLine[]
  wishlist: string[]
  orders: OrderRecord[]
  visitCount: number
  authSession: AuthSession | null
}

type StorefrontContextValue = StorefrontState & {
  signIn: (session: AuthSession) => void
  signOut: () => void
  setSite: (patch: Partial<SiteContent>) => void
  updateProduct: (slug: string, patch: Partial<Product>) => string
  addProduct: (patch?: Partial<Product>) => Product
  duplicateProduct: (slug: string) => Product | null
  removeProduct: (slug: string) => void
  moveProduct: (slug: string, direction: 'up' | 'down') => void
  updateCategory: (slug: string, patch: Partial<Category>) => string
  addCategory: (patch?: Partial<Category>) => Category
  removeCategory: (slug: string) => void
  moveCategory: (slug: string, direction: 'up' | 'down') => void
  moveHomeSection: (id: HomeSectionId, direction: 'up' | 'down') => void
  addToCart: (slug: string, quantity?: number) => void
  toggleWishlist: (slug: string) => void
  removeFromWishlist: (slug: string) => void
  clearWishlist: () => void
  setCartQuantity: (slug: string, quantity: number) => void
  removeFromCart: (slug: string) => void
  clearCart: () => void
  addOrder: (items: OrderLine[], total: number, customer: CustomerInfo) => OrderRecord
  updateOrderStatus: (orderId: string, status: OrderStatus) => void
  resetStorefront: () => void
}

const STORAGE_KEY = 'sopysafe-storefront-v1'
const VISIT_SESSION_KEY = 'sopysafe-visit-counted'

const StorefrontContext = createContext<StorefrontContextValue | null>(null)

function createDefaultState(): StorefrontState {
  return {
    site: defaultSiteContent,
    categories: defaultCategories,
    products: defaultProducts.map(normalizeProduct),
    homeSectionOrder: defaultHomeSectionOrder,
    cart: [],
    wishlist: [],
    orders: [],
    visitCount: 0,
    authSession: null,
  }
}

function loadPersistedState(): StorefrontState {
  if (typeof window === 'undefined') {
    return createDefaultState()
  }

  const raw = window.localStorage.getItem(STORAGE_KEY)
  if (!raw) {
    return createDefaultState()
  }

  try {
    const parsed = JSON.parse(raw) as Partial<StorefrontState>
    return {
      site: { ...defaultSiteContent, ...(parsed.site ?? {}) },
      categories:
        Array.isArray(parsed.categories) && parsed.categories.length ? parsed.categories : defaultCategories,
      products: Array.isArray(parsed.products) && parsed.products.length
        ? parsed.products.map((product) => normalizeProduct(product as Product))
        : defaultProducts.map(normalizeProduct),
      homeSectionOrder:
        Array.isArray(parsed.homeSectionOrder) && parsed.homeSectionOrder.length
          ? parsed.homeSectionOrder
          : defaultHomeSectionOrder,
      cart: Array.isArray(parsed.cart) ? parsed.cart : [],
      wishlist: Array.isArray(parsed.wishlist)
        ? parsed.wishlist.filter((item): item is string => typeof item === 'string')
        : [],
      orders: Array.isArray(parsed.orders)
        ? parsed.orders.map((order) => normalizeOrder(order as Partial<OrderRecord>))
        : [],
      visitCount: typeof parsed.visitCount === 'number' ? parsed.visitCount : 0,
      authSession:
        parsed.authSession &&
        typeof parsed.authSession === 'object' &&
        typeof parsed.authSession.name === 'string' &&
        typeof parsed.authSession.identifier === 'string'
          ? {
              name: parsed.authSession.name,
              identifier: parsed.authSession.identifier,
            }
          : null,
    }
  } catch {
    return createDefaultState()
  }
}

function persistState(state: StorefrontState) {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
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

function normalizeOrder(
  order: Partial<OrderRecord> & { items?: OrderLine[]; customer?: CustomerInfo },
): OrderRecord {
  const now = new Date().toISOString()

  return {
    id: String(order.id ?? `order-${Date.now()}`),
    orderNumber: String(order.orderNumber ?? `SS-${Date.now()}`),
    createdAt: order.createdAt ?? now,
    updatedAt: order.updatedAt ?? order.createdAt ?? now,
    status: order.status ?? 'Placed',
    paymentStatus: order.paymentStatus ?? 'pending',
    total: typeof order.total === 'number' ? order.total : 0,
    items: Array.isArray(order.items) ? order.items : [],
    customer:
      order.customer ?? {
        name: '',
        phone: '',
        email: '',
        address: '',
      },
    paymentMethod: order.paymentMethod ?? 'manual',
    provider: order.provider ?? 'storefront',
    providerRef: order.providerRef ?? '',
  }
}

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

function ensureUniqueSlug(base: string, existing: string[], fallbackPrefix: string) {
  const seed = slugify(base) || fallbackPrefix
  let candidate = seed
  let suffix = 2

  while (existing.includes(candidate)) {
    candidate = `${seed}-${suffix}`
    suffix += 1
  }

  return candidate
}

function moveItem<T>(items: T[], index: number, direction: 'up' | 'down') {
  const target = direction === 'up' ? index - 1 : index + 1
  if (target < 0 || target >= items.length) {
    return items
  }
  const copy = [...items]
  const [item] = copy.splice(index, 1)
  copy.splice(target, 0, item)
  return copy
}

function createDefaultCategory(existingSlugs: string[]): Category {
  return {
    slug: ensureUniqueSlug('New category', existingSlugs, 'category'),
    name: 'New category',
    description: 'Add a short category description.',
    accent: 'from-slate-300 to-emerald-600',
  }
}

function createDefaultProduct(existingSlugs: string[], categorySlug?: string): Product {
  const image = '/products/aurora-headphones.svg'
  return {
    slug: ensureUniqueSlug('New product', existingSlugs, 'product'),
    name: 'New product',
    category: categorySlug ?? defaultCategories[0]?.slug ?? 'uncategorized',
    brand: 'New brand',
    image,
    galleryImages: [image],
    price: 1999,
    mrp: 2999,
    rating: 4.5,
    reviews: 0,
    badge: 'New',
    summary: 'Add a short product summary.',
    colors: ['Default'],
    sizes: ['One Size'],
    stock: 'In stock',
    delivery: 'Add a delivery note.',
  }
}

export function StorefrontProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<StorefrontState>(() => createDefaultState())
  const [hydrated, setHydrated] = useState(false)

  const syncOrderToServer = async (order: OrderRecord) => {
    try {
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(order),
      })

      if (!response.ok) {
        return
      }

      const payload = (await response.json().catch(() => null)) as
        | { order?: OrderRecord }
        | null

      if (payload?.order) {
        setState((current) => ({
          ...current,
          orders: current.orders.map((item) => (item.id === payload.order!.id ? payload.order! : item)),
        }))
      }
    } catch {
      // Keep the optimistic local order even if the network request fails.
    }
  }

  const syncOrderStatusToServer = async (orderId: string, status: OrderStatus) => {
    try {
      const response = await fetch('/api/orders', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id: orderId, status }),
      })

      if (!response.ok) {
        return
      }

      const payload = (await response.json().catch(() => null)) as
        | { order?: OrderRecord }
        | null

      if (payload?.order) {
        setState((current) => ({
          ...current,
          orders: current.orders.map((item) => (item.id === payload.order!.id ? payload.order! : item)),
        }))
      }
    } catch {
      // Local state already reflects the latest admin change.
    }
  }

  const clearServerOrders = async () => {
    try {
      await fetch('/api/orders', { method: 'DELETE' })
    } catch {
      // Ignore backend reset failures during local reset.
    }
  }

  const resetServerCatalog = async () => {
    try {
      await fetch('/api/catalog', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ reset: true }),
      })
    } catch {
      // Ignore backend reset failures during local reset.
    }
  }

  const syncCatalogToServer = async (catalogState: Pick<
    StorefrontState,
    'site' | 'categories' | 'products' | 'homeSectionOrder'
  >) => {
    try {
      await fetch('/api/catalog', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(catalogState),
      })
    } catch {
      // Keep local state even if catalog sync is temporarily unavailable.
    }
  }

  useEffect(() => {
    const nextState = loadPersistedState()
    if (sessionStorage.getItem(VISIT_SESSION_KEY)) {
      setState(nextState)
      setHydrated(true)
      return
    }

    sessionStorage.setItem(VISIT_SESSION_KEY, '1')
    setState({ ...nextState, visitCount: nextState.visitCount + 1 })
    setHydrated(true)
  }, [])

  useEffect(() => {
    let cancelled = false

    const syncCatalog = async () => {
      try {
        const response = await fetch('/api/catalog', { cache: 'no-store' })
        if (!response.ok) return

        const payload = (await response.json().catch(() => null)) as
          | {
              catalog?: {
                site?: SiteContent
                categories?: Category[]
                products?: Product[]
                homeSectionOrder?: HomeSectionId[]
              }
            }
          | null

        if (cancelled || !payload?.catalog) return

        setState((current) => ({
          ...current,
          site: payload.catalog!.site ? { ...defaultSiteContent, ...payload.catalog!.site } : current.site,
          categories:
            Array.isArray(payload.catalog!.categories) && payload.catalog!.categories.length
              ? payload.catalog!.categories
              : current.categories,
          products:
            Array.isArray(payload.catalog!.products) && payload.catalog!.products.length
              ? payload.catalog!.products.map((product) => normalizeProduct(product))
              : current.products,
          homeSectionOrder:
            Array.isArray(payload.catalog!.homeSectionOrder) && payload.catalog!.homeSectionOrder.length
              ? payload.catalog!.homeSectionOrder
              : current.homeSectionOrder,
        }))
      } catch {
        // Keep local catalog if server sync is unavailable.
      }
    }

    const syncOrders = async () => {
      try {
        const response = await fetch('/api/orders', { cache: 'no-store' })
        if (!response.ok) return

        const payload = (await response.json().catch(() => null)) as
          | { orders?: OrderRecord[] }
          | null

        if (cancelled || !Array.isArray(payload?.orders)) return

        setState((current) => ({
          ...current,
          orders:
            payload.orders!.length > current.orders.length
              ? payload.orders!.map((order) => normalizeOrder(order))
              : current.orders,
        }))
      } catch {
        // Keep local order state if server sync is unavailable.
      }
    }

    const syncSession = async () => {
      try {
        const response = await fetch('/api/auth/session', { cache: 'no-store' })
        if (!response.ok) return

        const payload = (await response.json().catch(() => null)) as
          | { session?: AuthSession | null }
          | null

        if (cancelled) return

        setState((current) => ({
          ...current,
          authSession: payload?.session ?? null,
        }))
      } catch {
        // Ignore auth session refresh failures and keep the local state.
      }
    }

    void syncCatalog()
    void syncSession()
    void syncOrders()

    return () => {
      cancelled = true
    }
  }, [])

  useEffect(() => {
    if (!hydrated) {
      return
    }

    persistState(state)
  }, [state, hydrated])

  useEffect(() => {
    if (!hydrated) return

    void syncCatalogToServer({
      site: state.site,
      categories: state.categories,
      products: state.products,
      homeSectionOrder: state.homeSectionOrder,
    })
  }, [hydrated, state.site, state.categories, state.products, state.homeSectionOrder])

  const value = useMemo<StorefrontContextValue>(
    () => ({
      ...state,
      signIn: (session) =>
        setState((current) => ({
          ...current,
          authSession: session,
        })),
      signOut: () => {
        setState((current) => ({
          ...current,
          authSession: null,
        }))
        void fetch('/api/auth/logout', { method: 'POST' })
      },
      setSite: (patch) =>
        setState((current) => ({ ...current, site: { ...current.site, ...patch } })),
      updateProduct: (slug, patch) => {
        let nextSlug = slug

        setState((current) => {
          const index = current.products.findIndex((product) => product.slug === slug)
          if (index < 0) return current

          const currentProduct = current.products[index]
          nextSlug =
            typeof patch.slug === 'string' && patch.slug.trim()
              ? ensureUniqueSlug(
                  patch.slug,
                  current.products.map((item) => item.slug).filter((item) => item !== slug),
                  'product',
                )
              : currentProduct.slug

          const nextProducts = [...current.products]
          nextProducts[index] = {
            ...currentProduct,
            ...patch,
            slug: nextSlug,
          }

          return {
            ...current,
            products: nextProducts,
            cart:
              nextSlug === slug
                ? current.cart
                : current.cart.map((line) =>
                    line.slug === slug ? { ...line, slug: nextSlug } : line,
                  ),
            wishlist:
              nextSlug === slug
                ? current.wishlist
                : current.wishlist.map((item) => (item === slug ? nextSlug : item)),
          }
        })

        return nextSlug
      },
      addProduct: (patch) => {
        let created: Product | null = null

        setState((current) => {
          const draft = {
            ...createDefaultProduct(
              current.products.map((item) => item.slug),
              current.categories[0]?.slug,
            ),
            ...patch,
          }
          const galleryImages = Array.isArray(patch?.galleryImages) ? patch.galleryImages : draft.galleryImages
          const slug = ensureUniqueSlug(
            draft.slug,
            current.products.map((item) => item.slug),
            'product',
          )
          created = { ...draft, slug, galleryImages: galleryImages?.length ? galleryImages : [draft.image] }

          return {
            ...current,
            products: [...current.products, created],
          }
        })

        if (!created) {
          throw new Error('Unable to create product')
        }

        return created
      },
      duplicateProduct: (slug) => {
        let created: Product | null = null

        setState((current) => {
          const source = current.products.find((product) => product.slug === slug)
          if (!source) return current

          const duplicate: Product = {
            ...source,
            slug: ensureUniqueSlug(
              `${source.slug}-copy`,
              current.products.map((item) => item.slug),
              'product',
            ),
            name: `${source.name} Copy`,
            galleryImages: [...(source.galleryImages ?? [source.image])],
          }

          created = duplicate

          return {
            ...current,
            products: [...current.products, duplicate],
          }
        })

        return created
      },
      removeProduct: (slug) =>
        setState((current) => ({
          ...current,
          products: current.products.filter((product) => product.slug !== slug),
          cart: current.cart.filter((line) => line.slug !== slug),
          wishlist: current.wishlist.filter((item) => item !== slug),
        })),
      moveProduct: (slug, direction) =>
        setState((current) => {
          const index = current.products.findIndex((product) => product.slug === slug)
          if (index < 0) return current
          return { ...current, products: moveItem(current.products, index, direction) }
        }),
      updateCategory: (slug, patch) => {
        let nextSlug = slug

        setState((current) => {
          const index = current.categories.findIndex((category) => category.slug === slug)
          if (index < 0) return current

          const currentCategory = current.categories[index]
          nextSlug =
            typeof patch.slug === 'string' && patch.slug.trim()
              ? ensureUniqueSlug(
                  patch.slug,
                  current.categories.map((item) => item.slug).filter((item) => item !== slug),
                  'category',
                )
              : currentCategory.slug

          const nextCategories = [...current.categories]
          nextCategories[index] = {
            ...currentCategory,
            ...patch,
            slug: nextSlug,
          }

          return {
            ...current,
            categories: nextCategories,
            products:
              nextSlug === slug
                ? current.products
                : current.products.map((product) =>
                    product.category === slug ? { ...product, category: nextSlug } : product,
                  ),
          }
        })

        return nextSlug
      },
      addCategory: (patch) => {
        let created: Category | null = null

        setState((current) => {
          const draft = {
            ...createDefaultCategory(current.categories.map((item) => item.slug)),
            ...patch,
          }
          const slug = ensureUniqueSlug(
            draft.slug,
            current.categories.map((item) => item.slug),
            'category',
          )
          created = { ...draft, slug }

          return {
            ...current,
            categories: [...current.categories, created],
          }
        })

        if (!created) {
          throw new Error('Unable to create category')
        }

        return created
      },
      removeCategory: (slug) =>
        setState((current) => {
          if (current.categories.length <= 1) {
            return current
          }

          const remainingCategories = current.categories.filter((category) => category.slug !== slug)
          const fallbackCategory = remainingCategories[0]?.slug ?? current.categories[0]?.slug

          return {
            ...current,
            categories: remainingCategories,
            products: current.products.map((product) =>
              product.category === slug ? { ...product, category: fallbackCategory } : product,
            ),
          }
        }),
      moveCategory: (slug, direction) =>
        setState((current) => {
          const index = current.categories.findIndex((category) => category.slug === slug)
          if (index < 0) return current
          return { ...current, categories: moveItem(current.categories, index, direction) }
        }),
      moveHomeSection: (id, direction) =>
        setState((current) => {
          const index = current.homeSectionOrder.indexOf(id)
          if (index < 0) return current
          return {
            ...current,
            homeSectionOrder: moveItem(current.homeSectionOrder, index, direction),
          }
        }),
      addToCart: (slug, quantity = 1) =>
        setState((current) => {
          const existing = current.cart.find((line) => line.slug === slug)
          if (existing) {
            return {
              ...current,
              cart: current.cart.map((line) =>
                line.slug === slug ? { ...line, quantity: line.quantity + quantity } : line,
              ),
            }
          }
          return { ...current, cart: [...current.cart, { slug, quantity }] }
        }),
      toggleWishlist: (slug) =>
        setState((current) => ({
          ...current,
          wishlist: current.wishlist.includes(slug)
            ? current.wishlist.filter((item) => item !== slug)
            : [slug, ...current.wishlist],
        })),
      removeFromWishlist: (slug) =>
        setState((current) => ({
          ...current,
          wishlist: current.wishlist.filter((item) => item !== slug),
        })),
      clearWishlist: () =>
        setState((current) => ({
          ...current,
          wishlist: [],
        })),
      addOrder: (items, total, customer) => {
        const localOrder: OrderRecord = {
          id:
            typeof crypto !== 'undefined' && 'randomUUID' in crypto
              ? crypto.randomUUID()
              : `order-${Date.now()}`,
          orderNumber: `SS-${Date.now()}`,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          status: 'Placed',
          paymentStatus: 'pending',
          total,
          items,
          customer,
          paymentMethod: 'manual',
          provider: 'storefront',
          providerRef: '',
        }

        setState((current) => ({
          ...current,
          orders: [localOrder, ...current.orders],
        }))

        void syncOrderToServer(localOrder)

        return localOrder
      },
      updateOrderStatus: (orderId, status) =>
        setState((current) => {
          const nextState = {
            ...current,
            orders: current.orders.map((order) => (order.id === orderId ? { ...order, status } : order)),
          }

          void syncOrderStatusToServer(orderId, status)
          return nextState
        }),
      setCartQuantity: (slug, quantity) =>
        setState((current) => ({
          ...current,
          cart:
            quantity <= 0
              ? current.cart.filter((line) => line.slug !== slug)
              : current.cart.map((line) => (line.slug === slug ? { ...line, quantity } : line)),
        })),
      removeFromCart: (slug) =>
        setState((current) => ({
          ...current,
          cart: current.cart.filter((line) => line.slug !== slug),
        })),
      clearCart: () => setState((current) => ({ ...current, cart: [] })),
      resetStorefront: () => {
        setState({
          site: defaultSiteContent,
          categories: defaultCategories,
          products: defaultProducts.map(normalizeProduct),
          homeSectionOrder: defaultHomeSectionOrder,
          cart: [],
          wishlist: [],
          orders: [],
          visitCount: 0,
          authSession: null,
        })
        void resetServerCatalog()
        void clearServerOrders()
      },
    }),
    [state],
  )

  return <StorefrontContext.Provider value={value}>{children}</StorefrontContext.Provider>
}

export function useStorefront() {
  const context = useContext(StorefrontContext)
  if (!context) {
    throw new Error('useStorefront must be used within StorefrontProvider')
  }
  return context
}
