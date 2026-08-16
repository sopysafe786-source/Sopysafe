import type { Metadata } from 'next'
import { ShopBrowser } from '@/components/storefront-browser'
import { siteName, siteUrl } from '@/lib/site'

export const metadata: Metadata = {
  title: 'Shop',
  description:
    'Browse the complete SopySafe catalog with compact marketplace shelves, category-first discovery, and direct product access.',
  alternates: {
    canonical: siteUrl('/shop'),
  },
  openGraph: {
    title: `Shop | ${siteName}`,
    description:
      'Browse the complete SopySafe catalog with compact marketplace shelves, category-first discovery, and direct product access.',
    url: siteUrl('/shop'),
  },
}

export default function ShopPage() {
  return <ShopBrowser />
}
