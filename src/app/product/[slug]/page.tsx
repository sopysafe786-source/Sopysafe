import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { ProductDetail } from '@/components/product-detail'
import { findCatalogProduct, listCatalogProducts } from '@/server/services/catalog-service'
import { siteName, siteUrl } from '@/lib/site'

export async function generateStaticParams() {
  return (await listCatalogProducts()).map((product) => ({ slug: product.slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const product = await findCatalogProduct(slug)

  if (!product) {
    return {
      title: 'Product not found',
    }
  }

  return {
    title: product.name,
    description: product.summary,
    openGraph: {
      title: `${product.name} | ${siteName}`,
      description: product.summary,
      url: siteUrl(`/product/${product.slug}`),
    },
  }
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const product = await findCatalogProduct(slug)

  if (!product) notFound()

  return (
    <ProductDetail slug={slug} />
  )
}
