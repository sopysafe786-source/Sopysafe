export const siteName = 'SopySafe'
export const siteTagline = 'Shop Smart, Shop Safe'
export const defaultDescription =
  'SopySafe is a premium, trust-first Indian e-commerce experience with fast discovery, secure checkout, and luxury-inspired design.'

export const navigation = [
  { href: '/', label: 'Home' },
  { href: '/shop', label: 'Shop' },
  { href: '/categories', label: 'Categories' },
  { href: '/search', label: 'Search' },
  { href: '/track-order', label: 'Track Order' },
]

export const customerLinks = [
  { href: '/orders', label: 'My Orders' },
  { href: '/account', label: 'My Account' },
  { href: '/wishlist', label: 'Wishlist' },
  { href: '/compare', label: 'Compare' },
  { href: '/cart', label: 'Cart' },
]

export const policyLinks = [
  { href: '/privacy-policy', label: 'Privacy Policy' },
  { href: '/refund-policy', label: 'Refund Policy' },
  { href: '/shipping-policy', label: 'Shipping Policy' },
  { href: '/return-policy', label: 'Return Policy' },
  { href: '/terms', label: 'Terms & Conditions' },
]

export function siteUrl(path = '/') {
  const base =
    process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, '') ||
    'http://localhost:3000'
  return `${base}${path.startsWith('/') ? path : `/${path}`}`
}
