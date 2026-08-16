import type { Metadata } from 'next'
import { AuthSurface } from '@/components/auth-surface'
import { siteName, siteUrl } from '@/lib/site'

export const metadata: Metadata = {
  title: 'Create account',
  description: `Create your ${siteName} account for faster shopping and order tracking.`,
  alternates: {
    canonical: siteUrl('/register'),
  },
}

export default function RegisterPage() {
  return <AuthSurface mode="register" />
}
