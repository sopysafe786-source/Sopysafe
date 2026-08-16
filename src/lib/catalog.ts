export {
  categories,
  defaultHomeSectionOrder,
  defaultSiteContent,
  featuredBrands,
  getProduct,
  products,
} from '@/lib/storefront-data'

export type { Category, HomeSectionId, Product, SiteContent } from '@/lib/storefront-data'

export const faqItems = [
  {
    question: 'How does SopySafe keep checkout secure?',
    answer:
      'We design for secure-by-default payments, encrypted sessions, audit logging, rate limiting, and provider-safe webhook validation.',
  },
  {
    question: 'Which payment methods are supported?',
    answer:
      'The architecture is ready for Razorpay first, with support paths for UPI, cards, wallets, cash on delivery, and future Indian providers.',
  },
  {
    question: 'Can this scale to a large catalog?',
    answer:
      'Yes. The app is structured for CDN delivery, product caching, server-side rendering, and a PostgreSQL plus Redis backend model.',
  },
]
