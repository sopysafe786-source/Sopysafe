import type { Metadata } from 'next'
import { HomeRenderer } from '@/components/catalog-sections'
import { defaultDescription, siteName, siteTagline, siteUrl } from '@/lib/site'

export const metadata: Metadata = {
  title: `${siteName} | ${siteTagline}`,
  description: defaultDescription,
  alternates: {
    canonical: siteUrl('/'),
  },
  openGraph: {
    title: `${siteName} | ${siteTagline}`,
    description: defaultDescription,
    url: siteUrl('/'),
  },
}

export default function HomePage() {
  return <HomeRenderer />
}
