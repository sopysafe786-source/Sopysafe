import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { PageChrome } from '@/components/site-shell'
import { QuickBuyStudio } from '@/components/quick-buy-studio'
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
      title: 'Buy product not found',
    }
  }

  return {
    title: `Buy ${product.name}`,
    description: product.summary,
    openGraph: {
      title: `Buy ${product.name} | ${siteName}`,
      description: product.summary,
      url: siteUrl(`/buy/${product.slug}`),
    },
  }
}

export default async function BuyPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const product = await findCatalogProduct(slug)

  if (!product) notFound()

  return (
    <>
      <PageChrome eyebrow="Buy Now" title={product.name} description="A dedicated purchase page for a fast, focused checkout." />
      <QuickBuyStudio slug={slug} />
    </>
  )
}
