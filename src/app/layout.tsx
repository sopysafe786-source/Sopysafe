import type { Metadata } from 'next'
import './globals.css'
import { AppShell } from '@/components/app-shell'
import { StorefrontProvider } from '@/components/storefront-provider'
import { defaultDescription, siteName, siteTagline, siteUrl } from '@/lib/site'

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl('/')),
  title: {
    default: `${siteName} | ${siteTagline}`,
    template: `%s | ${siteName}`,
  },
  description: defaultDescription,
  openGraph: {
    title: `${siteName} | ${siteTagline}`,
    description: defaultDescription,
    url: siteUrl('/'),
    siteName,
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: `${siteName} | ${siteTagline}`,
    description: defaultDescription,
  },
  icons: {
    icon: '/favicon.svg',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        <StorefrontProvider>
          <AppShell>{children}</AppShell>
        </StorefrontProvider>
      </body>
    </html>
  )
}
