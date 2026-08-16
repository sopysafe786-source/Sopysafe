import type { MetadataRoute } from 'next'
import { categories, products } from '@/lib/catalog'
import { siteUrl } from '@/lib/site'

const staticRoutes = [
  '/',
  '/shop',
  '/categories',
  '/search',
  '/wishlist',
  '/compare',
  '/cart',
  '/checkout',
  '/checkout/success',
  '/checkout/failed',
  '/track-order',
  '/orders',
  '/account',
  '/account/profile',
  '/account/addresses',
  '/account/wishlist',
  '/account/notifications',
  '/login',
  '/register',
  '/forgot-password',
  '/about',
  '/contact',
  '/faq',
  '/blog',
  '/privacy-policy',
  '/refund-policy',
  '/shipping-policy',
  '/return-policy',
  '/terms',
]

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    ...staticRoutes.map((route) => ({ url: siteUrl(route), lastModified: new Date() })),
    ...categories.map((category) => ({
      url: siteUrl(`/category/${category.slug}`),
      lastModified: new Date(),
    })),
    ...products.map((product) => ({
      url: siteUrl(`/product/${product.slug}`),
      lastModified: new Date(),
    })),
    ...products.map((product) => ({
      url: siteUrl(`/buy/${product.slug}`),
      lastModified: new Date(),
    })),
  ]
}
