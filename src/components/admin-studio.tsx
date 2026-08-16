'use client'

import Image from 'next/image'
import { ChevronDown, ChevronUp, Copy, Plus, RotateCcw, Save, Trash2 } from 'lucide-react'
import { useEffect, useMemo, useState, type ReactNode } from 'react'
import { useStorefront } from '@/components/storefront-provider'
import { type Product } from '@/lib/storefront-data'

const sectionLabels = {
  hero: 'Hero',
  categories: 'Categories',
  bestSellers: 'Best Sellers',
  trending: 'Trending',
} as const

const stockOptions: Product['stock'][] = ['In stock', 'Low stock']

function csvToList(value: string) {
  return value
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean)
}

function listToCsv(values: string[]) {
  return values.join(', ')
}

function FieldLabel({ children }: { children: ReactNode }) {
  return <span className="text-sm font-medium text-slate-700">{children}</span>
}

function readFileAsDataUrl(file: File) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        resolve(reader.result)
      } else {
        reject(new Error('Unable to read file'))
      }
    }
    reader.onerror = () => reject(new Error('Unable to read file'))
    reader.readAsDataURL(file)
  })
}

export function AdminStudio() {
  const {
    site,
    setSite,
    products,
    categories,
    updateProduct,
    addProduct,
    duplicateProduct,
    removeProduct,
    moveProduct,
    updateCategory,
    addCategory,
    removeCategory,
    moveCategory,
    orders,
    visitCount,
    updateOrderStatus,
    resetStorefront,
  } = useStorefront()

  const [selectedProductSlug, setSelectedProductSlug] = useState(products[0]?.slug ?? '')
  const [selectedCategorySlug, setSelectedCategorySlug] = useState(categories[0]?.slug ?? '')
  const [productSearch, setProductSearch] = useState('')
  const [productCategoryFilter, setProductCategoryFilter] = useState('all')

  useEffect(() => {
    if (!products.length) {
      setSelectedProductSlug('')
      return
    }

    if (!products.some((product) => product.slug === selectedProductSlug)) {
      setSelectedProductSlug(products[0].slug)
    }
  }, [products, selectedProductSlug])

  useEffect(() => {
    if (!categories.length) {
      setSelectedCategorySlug('')
      return
    }

    if (!categories.some((category) => category.slug === selectedCategorySlug)) {
      setSelectedCategorySlug(categories[0].slug)
    }
  }, [categories, selectedCategorySlug])

  const currentProduct = useMemo(
    () => products.find((item) => item.slug === selectedProductSlug) ?? products[0],
    [products, selectedProductSlug],
  )

  const currentCategory = useMemo(
    () => categories.find((item) => item.slug === selectedCategorySlug) ?? categories[0],
    [categories, selectedCategorySlug],
  )

  const filteredProducts = useMemo(() => {
    const query = productSearch.trim().toLowerCase()

    return products.filter((product) => {
      const matchesCategory =
        productCategoryFilter === 'all' || product.category === productCategoryFilter
      const matchesSearch =
        !query ||
        [product.name, product.brand, product.slug, product.summary, product.category]
          .join(' ')
          .toLowerCase()
          .includes(query)

      return matchesCategory && matchesSearch
    })
  }, [productCategoryFilter, productSearch, products])

  const categoryCounts = useMemo(
    () =>
      categories.map((category) => ({
        ...category,
        count: products.filter((product) => product.category === category.slug).length,
      })),
    [categories, products],
  )

  const customers = useMemo(() => {
    const map = new Map<
      string,
      {
        key: string
        name: string
        email: string
        phone: string
        orderCount: number
        totalSpent: number
        lastOrder: string
      }
    >()

    orders.forEach((order) => {
      const key = order.customer.email || order.customer.phone || order.customer.name || order.id
      const existing = map.get(key)
      const next = {
        key,
        name: order.customer.name || 'Guest customer',
        email: order.customer.email || 'Not shared',
        phone: order.customer.phone || 'Not shared',
        orderCount: (existing?.orderCount ?? 0) + 1,
        totalSpent: (existing?.totalSpent ?? 0) + order.total,
        lastOrder: order.createdAt,
      }
      map.set(key, next)
    })

    return Array.from(map.values()).sort((a, b) => b.totalSpent - a.totalSpent)
  }, [orders])

  if (!currentProduct || !currentCategory) {
    return null
  }

  const handleCreateProduct = () => {
    const created = addProduct()
    setSelectedProductSlug(created.slug)
  }

  const handleDuplicateProduct = () => {
    const created = duplicateProduct(currentProduct.slug)
    if (created) {
      setSelectedProductSlug(created.slug)
    }
  }

  const handleCreateCategory = () => {
    const created = addCategory()
    setSelectedCategorySlug(created.slug)
  }

  const handleProductImageUpload = (file: File) => {
    readFileAsDataUrl(file).then((dataUrl) => {
      const currentGallery = currentProduct.galleryImages?.length ? currentProduct.galleryImages : [currentProduct.image]
      updateProduct(currentProduct.slug, {
        image: dataUrl,
        galleryImages: Array.from(new Set([dataUrl, ...currentGallery])),
      })
    })
  }

  const handleProductGalleryUpload = async (files: FileList | null) => {
    if (!files?.length) return

    const uploads = await Promise.all(Array.from(files).map((file) => readFileAsDataUrl(file)))
    const galleryImages = [...(currentProduct.galleryImages ?? [currentProduct.image]), ...uploads]
    const uniqueImages = Array.from(new Set(galleryImages))
    updateProduct(currentProduct.slug, {
      image: uniqueImages[0] ?? currentProduct.image,
      galleryImages: uniqueImages.length ? uniqueImages : [currentProduct.image],
    })
  }

  const galleryImages = currentProduct.galleryImages?.length
    ? Array.from(new Set(currentProduct.galleryImages))
    : [currentProduct.image]

  const updateGalleryImages = (nextImages: string[]) => {
    const uniqueImages = nextImages.map((item) => item.trim()).filter(Boolean)
    updateProduct(currentProduct.slug, {
      image: uniqueImages[0] ?? currentProduct.image,
      galleryImages: uniqueImages.length ? uniqueImages : [currentProduct.image],
    })
  }

  const handleSetPrimaryImage = (imageSrc: string) => {
    const nextImages = [imageSrc, ...galleryImages.filter((src) => src !== imageSrc)]
    updateGalleryImages(nextImages)
  }

  const handleMoveGalleryImage = (index: number, direction: 'up' | 'down') => {
    const target = direction === 'up' ? index - 1 : index + 1
    if (target < 0 || target >= galleryImages.length) return
    const nextImages = [...galleryImages]
    const [item] = nextImages.splice(index, 1)
    nextImages.splice(target, 0, item)
    updateGalleryImages(nextImages)
  }

  const handleRemoveGalleryImage = (index: number) => {
    const nextImages = galleryImages.filter((_, itemIndex) => itemIndex !== index)
    updateGalleryImages(nextImages)
  }

  return (
    <section className="bg-[#f6f7f4]">
      <div className="mx-auto max-w-7xl px-4 py-6 sm:py-10 sm:px-6 lg:px-8">
        <div className="rounded-[1.75rem] sm:rounded-[2.5rem] border border-emerald-950/10 bg-white p-4 sm:p-6 shadow-[0_20px_50px_rgba(15,23,42,0.05)]">
          <div className="flex flex-col gap-4 sm:gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-3xl">
              <p className="text-xs uppercase tracking-[0.32em] text-slate-500">Admin Console</p>
              <h2 className="mt-2 sm:mt-3 text-xl sm:text-3xl lg:text-4xl font-semibold tracking-tight text-slate-950">
                Simple control panel for content, catalog, and homepage sections.
              </h2>
              <p className="mt-2 sm:mt-3 text-xs sm:text-sm lg:text-base leading-6 sm:leading-7 text-slate-600">
                Change product details, add new catalog entries, manage categories, and keep the storefront looking clean.
              </p>
            </div>
            <div className="flex flex-wrap gap-2 sm:gap-3">
              <button
                type="button"
                onClick={handleCreateProduct}
                className="inline-flex items-center gap-2 rounded-full bg-emerald-950 px-3 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm font-semibold text-white transition hover:bg-emerald-900"
              >
                <Plus className="h-3 w-3 sm:h-4 sm:w-4" />
                <span className="hidden sm:inline">New product</span>
                <span className="sm:hidden">New</span>
              </button>
              <button
                type="button"
                onClick={handleCreateCategory}
                className="inline-flex items-center gap-2 rounded-full border border-emerald-950/10 px-3 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm font-semibold text-slate-800 transition hover:border-emerald-300 hover:text-emerald-900"
              >
                <Plus className="h-3 w-3 sm:h-4 sm:w-4" />
                <span className="hidden sm:inline">New category</span>
                <span className="sm:hidden">Cat</span>
              </button>
              <button
                type="button"
                onClick={resetStorefront}
                className="inline-flex items-center gap-2 rounded-full border border-emerald-950/10 px-3 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm font-semibold text-slate-700 transition hover:border-emerald-300 hover:text-emerald-900"
              >
                <RotateCcw className="h-3 w-3 sm:h-4 sm:w-4" />
                <span className="hidden sm:inline">Reset</span>
              </button>
            </div>
          </div>

          <div className="mt-4 sm:mt-6 grid gap-2 sm:gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {[
              { label: 'Products', value: String(products.length) },
              { label: 'Categories', value: String(categories.length) },
              { label: 'Orders', value: String(orders.length) },
              { label: 'Visits', value: String(visitCount) },
            ].map((metric) => (
              <div key={metric.label} className="rounded-[1.25rem] sm:rounded-[1.75rem] border border-emerald-950/10 bg-[#f7f7f3] p-3 sm:p-5">
                <p className="text-xs uppercase tracking-[0.28em] text-slate-500">{metric.label}</p>
                <p className="mt-2 sm:mt-3 text-2xl sm:text-3xl font-semibold text-slate-950">{metric.value}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-4 sm:mt-6 grid gap-4 sm:gap-6 lg:grid-cols-[1.02fr_0.98fr]">
          <div className="space-y-4 sm:space-y-6">
            <section className="rounded-[1.5rem] sm:rounded-[2rem] border border-emerald-950/10 bg-white p-4 sm:p-6">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-xs uppercase tracking-[0.3em] text-slate-500">Global content</p>
                  <h3 className="mt-1 sm:mt-2 text-lg sm:text-2xl font-semibold text-slate-950">Homepage copy</h3>
                </div>
                <Save className="h-4 w-4 sm:h-5 sm:w-5 text-emerald-700" />
              </div>

              <div className="mt-3 sm:mt-5 grid gap-3 sm:gap-4">
                {[
                  ['heroEyebrow', 'Eyebrow'],
                  ['heroTitle', 'Title'],
                  ['heroDescription', 'Description'],
                  ['heroNote', 'Hero note'],
                  ['footerNote', 'Footer note'],
                ].map(([key, label]) => (
                  <label key={key} className="grid gap-2">
                    <FieldLabel>{label}</FieldLabel>
                    {key === 'heroDescription' || key === 'heroNote' || key === 'footerNote' ? (
                      <textarea
                        value={site[key as keyof typeof site]}
                        onChange={(event) =>
                          setSite({ [key]: event.target.value } as Partial<typeof site>)
                        }
                        rows={3}
                        className="rounded-lg sm:rounded-2xl border border-emerald-950/10 bg-[#f7f7f3] px-3 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm text-slate-900 outline-none"
                      />
                    ) : (
                      <input
                        value={site[key as keyof typeof site]}
                        onChange={(event) =>
                          setSite({ [key]: event.target.value } as Partial<typeof site>)
                        }
                        className="h-9 sm:h-11 rounded-lg sm:rounded-2xl border border-emerald-950/10 bg-[#f7f7f3] px-3 sm:px-4 text-xs sm:text-sm text-slate-900 outline-none"
                      />
                    )}
                  </label>
                ))}
              </div>
            </section>

            <section className="rounded-[1.5rem] sm:rounded-[2rem] border border-emerald-950/10 bg-white p-4 sm:p-6">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-xs uppercase tracking-[0.3em] text-slate-500">Categories</p>
                  <h3 className="mt-1 sm:mt-2 text-lg sm:text-2xl font-semibold text-slate-950">Create and edit categories</h3>
                </div>
                <button
                  type="button"
                  onClick={handleCreateCategory}
                  className="inline-flex items-center gap-2 rounded-full border border-emerald-950/10 px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-semibold text-slate-800 transition hover:border-emerald-300 hover:text-emerald-900"
                >
                  <Plus className="h-4 w-4" />
                  Add
                </button>
              </div>

              <div className="mt-5 grid gap-4">
                {categories.map((category) => {
                  const isActive = selectedCategorySlug === category.slug
                  return (
                    <div
                      key={category.slug}
                      role="button"
                      tabIndex={0}
                      onClick={() => setSelectedCategorySlug(category.slug)}
                      onKeyDown={(event) => {
                        if (event.key === 'Enter' || event.key === ' ') {
                          event.preventDefault()
                          setSelectedCategorySlug(category.slug)
                        }
                      }}
                      className={`rounded-[1.5rem] border p-4 text-left transition ${
                        isActive
                          ? 'border-emerald-500 bg-emerald-50'
                          : 'border-emerald-950/10 bg-[#f7f7f3] hover:border-emerald-300'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0 flex-1">
                          <p className="text-xs uppercase tracking-[0.24em] text-slate-500">Slug</p>
                          <p className="mt-1 truncate font-semibold text-slate-950">{category.slug}</p>
                          <p className="mt-2 text-sm text-slate-600">{category.name}</p>
                        </div>
                        <div className="flex gap-2">
                          <button
                            type="button"
                            onClick={(event) => {
                              event.stopPropagation()
                              moveCategory(category.slug, 'up')
                            }}
                            className="rounded-full border border-emerald-950/10 p-2 transition hover:border-emerald-300"
                            aria-label={`Move ${category.name} up`}
                          >
                            <ChevronUp className="h-4 w-4" />
                          </button>
                          <button
                            type="button"
                            onClick={(event) => {
                              event.stopPropagation()
                              moveCategory(category.slug, 'down')
                            }}
                            className="rounded-full border border-emerald-950/10 p-2 transition hover:border-emerald-300"
                            aria-label={`Move ${category.name} down`}
                          >
                            <ChevronDown className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>

              <div className="mt-5 grid gap-4 rounded-[1.5rem] border border-emerald-950/10 bg-[#f7f7f3] p-5">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-xs uppercase tracking-[0.24em] text-slate-500">Selected category</p>
                    <h4 className="mt-1 text-lg font-semibold text-slate-950">{currentCategory.name}</h4>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeCategory(currentCategory.slug)}
                    className="inline-flex items-center gap-2 rounded-full border border-rose-200 bg-white px-4 py-2 text-sm font-semibold text-rose-700 transition hover:border-rose-300"
                    disabled={categories.length <= 1}
                    title={categories.length <= 1 ? 'Keep at least one category' : 'Delete category'}
                  >
                    <Trash2 className="h-4 w-4" />
                    Delete
                  </button>
                </div>

                <div className="grid gap-4">
                  <label className="grid gap-2">
                    <FieldLabel>Slug</FieldLabel>
                    <input
                      value={currentCategory.slug}
                      onChange={(event) => {
                        const nextSlug = updateCategory(currentCategory.slug, { slug: event.target.value })
                        setSelectedCategorySlug(nextSlug)
                      }}
                      className="h-11 rounded-2xl border border-emerald-950/10 bg-white px-4 text-sm text-slate-900 outline-none"
                    />
                  </label>
                  <label className="grid gap-2">
                    <FieldLabel>Name</FieldLabel>
                    <input
                      value={currentCategory.name}
                      onChange={(event) =>
                        updateCategory(currentCategory.slug, { name: event.target.value })
                      }
                      className="h-11 rounded-2xl border border-emerald-950/10 bg-white px-4 text-sm text-slate-900 outline-none"
                    />
                  </label>
                  <label className="grid gap-2">
                    <FieldLabel>Description</FieldLabel>
                    <textarea
                      value={currentCategory.description}
                      onChange={(event) =>
                        updateCategory(currentCategory.slug, { description: event.target.value })
                      }
                      rows={3}
                      className="rounded-2xl border border-emerald-950/10 bg-white px-4 py-3 text-sm text-slate-900 outline-none"
                    />
                  </label>
                  <label className="grid gap-2">
                    <FieldLabel>Accent classes</FieldLabel>
                    <input
                      value={currentCategory.accent}
                      onChange={(event) =>
                        updateCategory(currentCategory.slug, { accent: event.target.value })
                      }
                      className="h-11 rounded-2xl border border-emerald-950/10 bg-white px-4 text-sm text-slate-900 outline-none"
                    />
                  </label>
                </div>
              </div>
            </section>
          </div>

          <div className="space-y-6">
            <section className="rounded-[2rem] border border-emerald-950/10 bg-white p-6">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <p className="text-xs uppercase tracking-[0.3em] text-slate-500">Catalog</p>
                  <h3 className="mt-2 text-2xl font-semibold text-slate-950">Products</h3>
                </div>
                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={handleCreateProduct}
                    className="inline-flex items-center gap-2 rounded-full bg-emerald-950 px-4 py-2 text-sm font-semibold text-white transition hover:bg-emerald-900"
                  >
                    <Plus className="h-4 w-4" />
                    Add product
                  </button>
                  <button
                    type="button"
                    onClick={handleDuplicateProduct}
                    className="inline-flex items-center gap-2 rounded-full border border-emerald-950/10 px-4 py-2 text-sm font-semibold text-slate-800 transition hover:border-emerald-300"
                  >
                    <Copy className="h-4 w-4" />
                    Duplicate
                  </button>
                  <button
                    type="button"
                    onClick={() => removeProduct(currentProduct.slug)}
                    className="inline-flex items-center gap-2 rounded-full border border-rose-200 px-4 py-2 text-sm font-semibold text-rose-700 transition hover:border-rose-300"
                  >
                    <Trash2 className="h-4 w-4" />
                    Delete
                  </button>
                </div>
              </div>

              <div className="mt-5 grid gap-4 rounded-[1.5rem] border border-emerald-950/10 bg-[#f7f7f3] p-4">
                <div className="grid gap-3 lg:grid-cols-[1fr_auto] lg:items-end">
                  <label className="grid gap-2">
                    <FieldLabel>Search products</FieldLabel>
                    <input
                      value={productSearch}
                      onChange={(event) => setProductSearch(event.target.value)}
                      placeholder="Search name, brand, slug..."
                      className="h-11 rounded-2xl border border-emerald-950/10 bg-white px-4 text-sm text-slate-900 outline-none"
                    />
                  </label>
                  <label className="grid gap-2">
                    <FieldLabel>Filter by category</FieldLabel>
                    <select
                      value={productCategoryFilter}
                      onChange={(event) => setProductCategoryFilter(event.target.value)}
                      className="h-11 rounded-2xl border border-emerald-950/10 bg-white px-4 text-sm text-slate-900 outline-none"
                    >
                      <option value="all">All categories</option>
                      {categories.map((category) => (
                        <option key={category.slug} value={category.slug}>
                          {category.name}
                        </option>
                      ))}
                    </select>
                  </label>
                </div>

                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => setProductCategoryFilter('all')}
                    className={`rounded-full px-4 py-2 text-xs font-semibold transition ${
                      productCategoryFilter === 'all'
                        ? 'bg-emerald-950 text-white'
                        : 'border border-emerald-950/10 bg-white text-slate-700 hover:border-emerald-300'
                    }`}
                  >
                    All
                  </button>
                  {categoryCounts.map((category) => (
                    <button
                      key={category.slug}
                      type="button"
                      onClick={() => setProductCategoryFilter(category.slug)}
                      className={`rounded-full px-4 py-2 text-xs font-semibold transition ${
                        productCategoryFilter === category.slug
                          ? 'bg-emerald-950 text-white'
                          : 'border border-emerald-950/10 bg-white text-slate-700 hover:border-emerald-300'
                      }`}
                    >
                      {category.name} ({category.count})
                    </button>
                  ))}
                </div>

                <div className="text-xs uppercase tracking-[0.24em] text-slate-500">
                  Showing {filteredProducts.length} of {products.length} products
                </div>
              </div>

              <div className="mt-5 grid gap-3">
                {filteredProducts.map((product) => {
                  const isActive = selectedProductSlug === product.slug
                  return (
                    <div
                      key={product.slug}
                      role="button"
                      tabIndex={0}
                      onClick={() => setSelectedProductSlug(product.slug)}
                      onKeyDown={(event) => {
                        if (event.key === 'Enter' || event.key === ' ') {
                          event.preventDefault()
                          setSelectedProductSlug(product.slug)
                        }
                      }}
                      className={`flex items-center gap-3 rounded-[1.5rem] border px-4 py-4 text-left transition ${
                        isActive
                          ? 'border-emerald-500 bg-emerald-50'
                          : 'border-emerald-950/10 bg-[#f7f7f3] hover:border-emerald-300'
                      }`}
                    >
                      <div className="min-w-0 flex-1">
                        <p className="text-xs uppercase tracking-[0.24em] text-slate-500">Slug</p>
                        <p className="mt-1 truncate font-semibold text-slate-950">{product.slug}</p>
                        <p className="mt-1 text-sm text-slate-600">
                          {product.brand} - {product.category}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-semibold text-slate-950">
                          Rs {product.price.toLocaleString('en-IN')}
                        </p>
                        <p className="mt-1 text-xs text-slate-500">{product.stock}</p>
                      </div>
                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={(event) => {
                            event.stopPropagation()
                            moveProduct(product.slug, 'up')
                          }}
                          className="rounded-full border border-emerald-950/10 p-2 transition hover:border-emerald-300"
                          aria-label={`Move ${product.name} up`}
                        >
                          <ChevronUp className="h-4 w-4" />
                        </button>
                        <button
                          type="button"
                          onClick={(event) => {
                            event.stopPropagation()
                            moveProduct(product.slug, 'down')
                          }}
                          className="rounded-full border border-emerald-950/10 p-2 transition hover:border-emerald-300"
                          aria-label={`Move ${product.name} down`}
                        >
                          <ChevronDown className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  )
                })}
                {!filteredProducts.length ? (
                  <div className="rounded-[1.5rem] border border-dashed border-emerald-950/15 bg-[#f7f7f3] p-6 text-sm text-slate-600">
                    No products match this filter. Try another category or search term.
                  </div>
                ) : null}
              </div>
            </section>

            <section className="rounded-[2rem] border border-emerald-950/10 bg-white p-6">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-xs uppercase tracking-[0.3em] text-slate-500">Selected product</p>
                  <h3 className="mt-2 text-2xl font-semibold text-slate-950">{currentProduct.name}</h3>
                </div>
                <button
                  type="button"
                  onClick={handleDuplicateProduct}
                  className="rounded-full border border-emerald-950/10 px-4 py-2 text-sm font-semibold text-slate-800 transition hover:border-emerald-300"
                >
                  Duplicate
                </button>
              </div>

              <div className="mt-5 grid gap-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <label className="grid gap-2">
                    <FieldLabel>Slug</FieldLabel>
                    <input
                      value={currentProduct.slug}
                      onChange={(event) => {
                        const nextSlug = updateProduct(currentProduct.slug, { slug: event.target.value })
                        setSelectedProductSlug(nextSlug)
                      }}
                      className="h-11 rounded-2xl border border-emerald-950/10 bg-[#f7f7f3] px-4 text-sm text-slate-900 outline-none"
                    />
                  </label>
                  <label className="grid gap-2">
                    <FieldLabel>Name</FieldLabel>
                    <input
                      value={currentProduct.name}
                      onChange={(event) =>
                        updateProduct(currentProduct.slug, { name: event.target.value })
                      }
                      className="h-11 rounded-2xl border border-emerald-950/10 bg-[#f7f7f3] px-4 text-sm text-slate-900 outline-none"
                    />
                  </label>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <label className="grid gap-2">
                    <FieldLabel>Category</FieldLabel>
                    <select
                      value={currentProduct.category}
                      onChange={(event) =>
                        updateProduct(currentProduct.slug, { category: event.target.value })
                      }
                      className="h-11 rounded-2xl border border-emerald-950/10 bg-[#f7f7f3] px-4 text-sm text-slate-900 outline-none"
                    >
                      {categories.map((category) => (
                        <option key={category.slug} value={category.slug}>
                          {category.name}
                        </option>
                      ))}
                    </select>
                  </label>
                  <label className="grid gap-2">
                    <FieldLabel>Brand</FieldLabel>
                    <input
                      value={currentProduct.brand}
                      onChange={(event) =>
                        updateProduct(currentProduct.slug, { brand: event.target.value })
                      }
                      className="h-11 rounded-2xl border border-emerald-950/10 bg-[#f7f7f3] px-4 text-sm text-slate-900 outline-none"
                    />
                  </label>
                </div>

                <label className="grid gap-2">
                  <FieldLabel>Image path</FieldLabel>
                  <input
                    value={currentProduct.image}
                    onChange={(event) =>
                      updateProduct(currentProduct.slug, { image: event.target.value })
                    }
                    className="h-11 rounded-2xl border border-emerald-950/10 bg-[#f7f7f3] px-4 text-sm text-slate-900 outline-none"
                  />
                </label>

                <label className="grid gap-2">
                  <FieldLabel>Upload image from computer</FieldLabel>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(event) => {
                      const file = event.target.files?.[0]
                      if (file) {
                        handleProductImageUpload(file)
                      }
                      event.currentTarget.value = ''
                    }}
                    className="rounded-2xl border border-emerald-950/10 bg-[#f7f7f3] px-4 py-3 text-sm text-slate-700 file:mr-4 file:rounded-full file:border-0 file:bg-emerald-950 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-white"
                  />
                </label>

                <label className="grid gap-2">
                  <FieldLabel>Upload gallery images</FieldLabel>
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={(event) => {
                      void handleProductGalleryUpload(event.target.files)
                      event.currentTarget.value = ''
                    }}
                    className="rounded-2xl border border-emerald-950/10 bg-[#f7f7f3] px-4 py-3 text-sm text-slate-700 file:mr-4 file:rounded-full file:border-0 file:bg-emerald-950 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-white"
                  />
                </label>

                <div className="grid gap-3">
                  <div className="flex items-center justify-between gap-3">
                    <FieldLabel>Gallery images</FieldLabel>
                    <span className="text-xs uppercase tracking-[0.24em] text-slate-500">
                      {galleryImages.length} images
                    </span>
                  </div>
                  <div className="grid gap-3 sm:grid-cols-2">
                    <div className="grid gap-2">
                      <div className="relative aspect-[4/3] overflow-hidden rounded-[1.5rem] border border-emerald-950/10 bg-[#f7f7f3]">
                        <Image
                          src={currentProduct.image}
                          alt={currentProduct.name}
                          fill
                          sizes="(max-width: 768px) 100vw, 40vw"
                          className="object-contain p-4"
                        />
                      </div>
                      <p className="text-xs text-slate-500">
                        Main image preview. This is the first image used across the storefront.
                      </p>
                    </div>

                    <div className="grid gap-2 rounded-[1.5rem] border border-emerald-950/10 bg-[#f7f7f3] p-3">
                      <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">
                        Manage side images
                      </p>
                      <div className="grid gap-2">
                        {galleryImages.map((src, index) => (
                          <div
                            key={`${src}-${index}`}
                            className="grid grid-cols-[64px_minmax(0,1fr)] gap-2 rounded-2xl border border-emerald-950/10 bg-white p-2"
                          >
                            <div className="relative aspect-square overflow-hidden rounded-xl bg-[#f7f7f3]">
                              <Image
                                src={src}
                                alt={`${currentProduct.name} ${index + 1}`}
                                fill
                                sizes="64px"
                                className="object-contain p-1"
                              />
                            </div>
                            <div className="min-w-0">
                              <div className="flex items-center justify-between gap-2">
                                <p className="truncate text-sm font-medium text-slate-900">
                                  {index === 0 ? 'Primary image' : `Gallery image ${index + 1}`}
                                </p>
                                <button
                                  type="button"
                                  onClick={() => handleSetPrimaryImage(src)}
                                  className="rounded-full border border-emerald-950/10 px-2 py-1 text-[11px] font-semibold text-slate-700 hover:border-emerald-300 hover:text-emerald-900"
                                >
                                  Use main
                                </button>
                              </div>
                              <input
                                value={src}
                                onChange={(event) => {
                                  const nextImages = [...galleryImages]
                                  nextImages[index] = event.target.value
                                  updateGalleryImages(nextImages)
                                }}
                                className="mt-2 h-10 w-full rounded-xl border border-emerald-950/10 bg-[#f7f7f3] px-3 text-xs text-slate-900 outline-none"
                              />
                              <div className="mt-2 flex items-center gap-2">
                                <button
                                  type="button"
                                  onClick={() => handleMoveGalleryImage(index, 'up')}
                                  disabled={index === 0}
                                  className="inline-flex items-center gap-1 rounded-full border border-emerald-950/10 px-2.5 py-1 text-[11px] font-semibold text-slate-700 disabled:cursor-not-allowed disabled:opacity-40"
                                >
                                  <ChevronUp className="h-3.5 w-3.5" />
                                  Up
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleMoveGalleryImage(index, 'down')}
                                  disabled={index === galleryImages.length - 1}
                                  className="inline-flex items-center gap-1 rounded-full border border-emerald-950/10 px-2.5 py-1 text-[11px] font-semibold text-slate-700 disabled:cursor-not-allowed disabled:opacity-40"
                                >
                                  <ChevronDown className="h-3.5 w-3.5" />
                                  Down
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleRemoveGalleryImage(index)}
                                  className="inline-flex items-center gap-1 rounded-full border border-rose-200 px-2.5 py-1 text-[11px] font-semibold text-rose-600 hover:bg-rose-50"
                                >
                                  <Trash2 className="h-3.5 w-3.5" />
                                  Remove
                                </button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <label className="grid gap-2">
                    <FieldLabel>Badge</FieldLabel>
                    <input
                      value={currentProduct.badge}
                      onChange={(event) =>
                        updateProduct(currentProduct.slug, { badge: event.target.value })
                      }
                      className="h-11 rounded-2xl border border-emerald-950/10 bg-[#f7f7f3] px-4 text-sm text-slate-900 outline-none"
                    />
                  </label>
                  <label className="grid gap-2">
                    <FieldLabel>Stock</FieldLabel>
                    <select
                      value={currentProduct.stock}
                      onChange={(event) =>
                        updateProduct(currentProduct.slug, {
                          stock: event.target.value as Product['stock'],
                        })
                      }
                      className="h-11 rounded-2xl border border-emerald-950/10 bg-[#f7f7f3] px-4 text-sm text-slate-900 outline-none"
                    >
                      {stockOptions.map((option) => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>
                  </label>
                </div>

                <label className="grid gap-2">
                  <FieldLabel>Summary</FieldLabel>
                  <textarea
                    value={currentProduct.summary}
                    onChange={(event) =>
                      updateProduct(currentProduct.slug, { summary: event.target.value })
                    }
                    rows={4}
                    className="rounded-2xl border border-emerald-950/10 bg-[#f7f7f3] px-4 py-3 text-sm text-slate-900 outline-none"
                  />
                </label>

                <label className="grid gap-2">
                  <FieldLabel>Delivery</FieldLabel>
                  <textarea
                    value={currentProduct.delivery}
                    onChange={(event) =>
                      updateProduct(currentProduct.slug, { delivery: event.target.value })
                    }
                    rows={3}
                    className="rounded-2xl border border-emerald-950/10 bg-[#f7f7f3] px-4 py-3 text-sm text-slate-900 outline-none"
                  />
                </label>

                <div className="grid gap-4 sm:grid-cols-2">
                  <label className="grid gap-2">
                    <FieldLabel>Price</FieldLabel>
                    <input
                      type="number"
                      value={currentProduct.price}
                      onChange={(event) =>
                        updateProduct(currentProduct.slug, { price: Number(event.target.value) })
                      }
                      className="h-11 rounded-2xl border border-emerald-950/10 bg-[#f7f7f3] px-4 text-sm text-slate-900 outline-none"
                    />
                  </label>
                  <label className="grid gap-2">
                    <FieldLabel>MRP</FieldLabel>
                    <input
                      type="number"
                      value={currentProduct.mrp}
                      onChange={(event) =>
                        updateProduct(currentProduct.slug, { mrp: Number(event.target.value) })
                      }
                      className="h-11 rounded-2xl border border-emerald-950/10 bg-[#f7f7f3] px-4 text-sm text-slate-900 outline-none"
                    />
                  </label>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <label className="grid gap-2">
                    <FieldLabel>Rating</FieldLabel>
                    <input
                      type="number"
                      step="0.1"
                      min="0"
                      max="5"
                      value={currentProduct.rating}
                      onChange={(event) =>
                        updateProduct(currentProduct.slug, { rating: Number(event.target.value) })
                      }
                      className="h-11 rounded-2xl border border-emerald-950/10 bg-[#f7f7f3] px-4 text-sm text-slate-900 outline-none"
                    />
                  </label>
                  <label className="grid gap-2">
                    <FieldLabel>Reviews</FieldLabel>
                    <input
                      type="number"
                      min="0"
                      value={currentProduct.reviews}
                      onChange={(event) =>
                        updateProduct(currentProduct.slug, { reviews: Number(event.target.value) })
                      }
                      className="h-11 rounded-2xl border border-emerald-950/10 bg-[#f7f7f3] px-4 text-sm text-slate-900 outline-none"
                    />
                  </label>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <label className="grid gap-2">
                    <FieldLabel>Colors</FieldLabel>
                    <input
                      value={listToCsv(currentProduct.colors)}
                      onChange={(event) =>
                        updateProduct(currentProduct.slug, { colors: csvToList(event.target.value) })
                      }
                      className="h-11 rounded-2xl border border-emerald-950/10 bg-[#f7f7f3] px-4 text-sm text-slate-900 outline-none"
                    />
                  </label>
                  <label className="grid gap-2">
                    <FieldLabel>Sizes</FieldLabel>
                    <input
                      value={listToCsv(currentProduct.sizes)}
                      onChange={(event) =>
                        updateProduct(currentProduct.slug, { sizes: csvToList(event.target.value) })
                      }
                      className="h-11 rounded-2xl border border-emerald-950/10 bg-[#f7f7f3] px-4 text-sm text-slate-900 outline-none"
                    />
                  </label>
                </div>
              </div>
            </section>
          </div>
        </div>

        <section className="mt-6 rounded-[2rem] border border-emerald-950/10 bg-white p-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-slate-500">Orders</p>
              <h3 className="mt-2 text-2xl font-semibold text-slate-950">All orders</h3>
            </div>
            <div className="rounded-full bg-emerald-950 px-4 py-2 text-xs font-semibold text-white">
              {orders.length} total
            </div>
          </div>

          <div className="mt-5 grid gap-4">
            {orders.length ? (
              orders.map((order) => (
                <div
                  key={order.id}
                  className="rounded-[1.5rem] border border-emerald-950/10 bg-[#f7f7f3] p-5"
                >
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <div>
                      <p className="text-xs uppercase tracking-[0.24em] text-slate-500">
                        Order #{order.id.slice(-8)}
                      </p>
                      <p className="mt-2 text-sm font-medium text-slate-800">
                        {order.customer.name || 'Guest customer'}
                      </p>
                      <p className="mt-1 text-sm text-slate-600">
                        {order.customer.phone || 'No phone'} · {order.customer.email || 'No email'}
                      </p>
                      <h4 className="mt-2 text-lg font-semibold text-slate-950">
                        {order.items.length} items
                      </h4>
                      <p className="mt-1 text-sm text-slate-600">
                        {new Date(order.createdAt).toLocaleString('en-IN')}
                      </p>
                    </div>
                    <div className="text-right">
                      <select
                        value={order.status}
                        onChange={(event) =>
                          updateOrderStatus(order.id, event.target.value as typeof order.status)
                        }
                        className="rounded-full border border-emerald-950/10 bg-white px-3 py-2 text-xs font-semibold text-slate-800 outline-none"
                      >
                        {['Placed', 'Processing', 'Shipped', 'Delivered', 'Cancelled'].map((status) => (
                          <option key={status} value={status}>
                            {status}
                          </option>
                        ))}
                      </select>
                      <p className="mt-3 text-lg font-semibold text-slate-950">
                        Rs {order.total.toLocaleString('en-IN')}
                      </p>
                    </div>
                  </div>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {order.items.map((item) => (
                      <span
                        key={item.slug}
                        className="rounded-full border border-emerald-950/10 bg-white px-3 py-1 text-xs text-slate-700"
                      >
                        {item.name} x {item.quantity}
                      </span>
                    ))}
                  </div>
                </div>
              ))
            ) : (
              <div className="rounded-[1.5rem] border border-dashed border-emerald-950/15 bg-[#f7f7f3] p-6 text-sm text-slate-600">
                No orders yet. Once checkout is completed, the order history will show here.
              </div>
            )}
          </div>
        </section>

        <section className="mt-6 rounded-[2rem] border border-emerald-950/10 bg-white p-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-slate-500">Customers</p>
              <h3 className="mt-2 text-2xl font-semibold text-slate-950">Customer overview</h3>
            </div>
            <div className="rounded-full bg-emerald-950 px-4 py-2 text-xs font-semibold text-white">
              {customers.length} customers
            </div>
          </div>

          <div className="mt-5 grid gap-4">
            {customers.length ? (
              customers.map((customer) => (
                <div
                  key={customer.key}
                  className="rounded-[1.5rem] border border-emerald-950/10 bg-[#f7f7f3] p-5"
                >
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <div>
                      <h4 className="text-lg font-semibold text-slate-950">{customer.name}</h4>
                      <p className="mt-1 text-sm text-slate-600">{customer.email}</p>
                      <p className="mt-1 text-sm text-slate-600">{customer.phone}</p>
                    </div>
                    <div className="text-right text-sm text-slate-700">
                      <p>Orders: {customer.orderCount}</p>
                      <p className="mt-1 font-semibold text-slate-950">
                        Rs {customer.totalSpent.toLocaleString('en-IN')}
                      </p>
                    </div>
                  </div>
                  <p className="mt-3 text-xs uppercase tracking-[0.24em] text-slate-500">
                    Last order {new Date(customer.lastOrder).toLocaleString('en-IN')}
                  </p>
                </div>
              ))
            ) : (
              <div className="rounded-[1.5rem] border border-dashed border-emerald-950/15 bg-[#f7f7f3] p-6 text-sm text-slate-600">
                No customers yet. Customer data appears after checkout orders are placed.
              </div>
            )}
          </div>
        </section>
      </div>
    </section>
  )
}
