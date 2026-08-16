import type { Metadata } from 'next'
import { AuthSurface } from '@/components/auth-surface'
import { siteName, siteUrl } from '@/lib/site'

export const metadata: Metadata = {
  title: 'Sign in',
  description: `Sign in to ${siteName} for orders, wishlist, and faster checkout.`,
  alternates: {
    canonical: siteUrl('/login'),
  },
}

export default function LoginPage() {
  return <AuthSurface mode="login" />
}
