export type Product = {
  slug: string
  name: string
  category: string
  brand: string
  image: string
  galleryImages: string[]
  price: number
  mrp: number
  rating: number
  reviews: number
  badge: string
  summary: string
  colors: string[]
  sizes: string[]
  stock: 'In stock' | 'Low stock'
  delivery: string
}

export type Category = {
  slug: string
  name: string
  description: string
  accent: string
}

export type SiteContent = {
  heroEyebrow: string
  heroTitle: string
  heroDescription: string
  heroNote: string
  footerNote: string
}

export type HomeSectionId = 'hero' | 'quickAccess' | 'categories' | 'bestSellers' | 'trending'

export const defaultSiteContent: SiteContent = {
  heroEyebrow: 'Premium Indian commerce',
  heroTitle: 'Simple, professional shopping for everyday needs.',
  heroDescription:
    'SopySafe keeps the storefront clean, the product images clear, and the checkout flow easy to trust.',
  heroNote: 'Clean product pages, clear pricing, and a simple professional layout.',
  footerNote: 'Premium Indian e-commerce with a simple, trustworthy shopping experience.',
}

export const defaultHomeSectionOrder: HomeSectionId[] = [
  'hero',
  'quickAccess',
  'categories',
  'bestSellers',
  'trending',
]

export const categories: Category[] = [
  {
    slug: 'electronics',
    name: 'Electronics',
    description: 'Premium gadgets, audio, and smart devices for modern living.',
    accent: 'from-emerald-400 to-emerald-700',
  },
  {
    slug: 'beauty-shringar',
    name: 'Beauty & Shringar',
    description: 'Elegant essentials for daily grooming and celebration-ready styling.',
    accent: 'from-amber-300 to-emerald-600',
  },
  {
    slug: 'fashion',
    name: 'Fashion',
    description: 'Statement styles with refined silhouettes and elevated comfort.',
    accent: 'from-slate-700 to-emerald-500',
  },
  {
    slug: 'home-kitchen',
    name: 'Home & Kitchen',
    description: 'Beautifully functional products that make every room feel finished.',
    accent: 'from-stone-300 to-emerald-700',
  },
  {
    slug: 'grocery',
    name: 'Grocery',
    description: 'Everyday staples sourced for reliability, freshness, and value.',
    accent: 'from-lime-300 to-emerald-700',
  },
  {
    slug: 'mobile-accessories',
    name: 'Mobile Accessories',
    description: 'Chargers, cases, and wear-ready add-ons with precision fit.',
    accent: 'from-cyan-300 to-emerald-700',
  },
]

export const featuredBrands = [
  'Aurelia',
  'VerdeHaus',
  'NovaCore',
  'Saffron Lane',
  'PureNest',
  'Mira Skin',
]

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

function ensureUniqueSlug(base: string, existing: string[], fallbackPrefix: string) {
  const seed = slugify(base) || fallbackPrefix
  let candidate = seed
  let suffix = 2

  while (existing.includes(candidate)) {
    candidate = `${seed}-${suffix}`
    suffix += 1
  }

  return candidate
}

const featuredProducts: Product[] = [
  {
    slug: 'aurora-noise-canceling-headphones',
    name: 'Aurora Noise-Canceling Headphones',
    category: 'electronics',
    brand: 'NovaCore',
    image: '/products/aurora-headphones.svg',
    galleryImages: [
      '/products/aurora-headphones.svg',
      '/products/aurora-headphones.svg',
      '/products/aurora-headphones.svg',
      '/products/aurora-headphones.svg',
    ],
    price: 8999,
    mrp: 14999,
    rating: 4.8,
    reviews: 428,
    badge: 'Best Seller',
    summary:
      'Adaptive ANC, premium memory foam, and crystal-clear calls tuned for Indian commute conditions.',
    colors: ['Emerald', 'Graphite', 'Ivory'],
    sizes: ['One Size'],
    stock: 'In stock',
    delivery: 'Delivery by tomorrow in metro cities',
  },
  {
    slug: 'saffron-glow-facial-kit',
    name: 'Saffron Glow Facial Kit',
    category: 'beauty-shringar',
    brand: 'Mira Skin',
    image: '/products/saffron-glow-kit.svg',
    galleryImages: [
      '/products/saffron-glow-kit.svg',
      '/products/saffron-glow-kit.svg',
      '/products/saffron-glow-kit.svg',
      '/products/saffron-glow-kit.svg',
    ],
    price: 1299,
    mrp: 1999,
    rating: 4.7,
    reviews: 912,
    badge: 'Top Rated',
    summary:
      'A salon-inspired ritual with saffron, turmeric, and niacinamide for a bright polished finish.',
    colors: ['Gold', 'Rose', 'Cream'],
    sizes: ['Travel', 'Regular'],
    stock: 'In stock',
    delivery: 'Ships today from the nearest fulfillment center',
  },
  {
    slug: 'heritage-leather-sling-bag',
    name: 'Heritage Leather Sling Bag',
    category: 'fashion',
    brand: 'Aurelia',
    image: '/products/heritage-bag.svg',
    galleryImages: [
      '/products/heritage-bag.svg',
      '/products/heritage-bag.svg',
      '/products/heritage-bag.svg',
      '/products/heritage-bag.svg',
    ],
    price: 3499,
    mrp: 5999,
    rating: 4.9,
    reviews: 186,
    badge: 'Luxury Pick',
    summary:
      'Structured form, soft-touch finish, and polished hardware for day-to-night versatility.',
    colors: ['Forest', 'Cocoa', 'Black'],
    sizes: ['Mini', 'Classic'],
    stock: 'Low stock',
    delivery: 'Express delivery available',
  },
  {
    slug: 'verde-smart-kitchen-jar-set',
    name: 'Verde Smart Kitchen Jar Set',
    category: 'home-kitchen',
    brand: 'VerdeHaus',
    image: '/products/kitchen-jar-set.svg',
    galleryImages: [
      '/products/kitchen-jar-set.svg',
      '/products/kitchen-jar-set.svg',
      '/products/kitchen-jar-set.svg',
      '/products/kitchen-jar-set.svg',
    ],
    price: 2199,
    mrp: 3499,
    rating: 4.6,
    reviews: 304,
    badge: 'Flash Sale',
    summary:
      'A modular airtight jar set with labels, stackable bodies, and shelf-ready clarity.',
    colors: ['Olive', 'Clear', 'Charcoal'],
    sizes: ['Set of 6'],
    stock: 'In stock',
    delivery: 'Standard delivery in 2 to 4 days',
  },
  {
    slug: 'purenest-ceramic-mug-set',
    name: 'PureNest Ceramic Mug Set',
    category: 'home-kitchen',
    brand: 'PureNest',
    image: '/products/ceramic-mugs.svg',
    galleryImages: [
      '/products/ceramic-mugs.svg',
      '/products/ceramic-mugs.svg',
      '/products/ceramic-mugs.svg',
      '/products/ceramic-mugs.svg',
    ],
    price: 1499,
    mrp: 2299,
    rating: 4.5,
    reviews: 155,
    badge: 'New Arrival',
    summary:
      'Minimal mugs with insulated comfort and a balanced hand-feel for everyday tea rituals.',
    colors: ['Ivory', 'Slate', 'Emerald'],
    sizes: ['Set of 4'],
    stock: 'In stock',
    delivery: 'Ships within 24 hours',
  },
  {
    slug: 'daily-balance-grocery-care-pack',
    name: 'Daily Balance Grocery Care Pack',
    category: 'grocery',
    brand: 'SopySafe Select',
    image: '/products/grocery-care-pack.svg',
    galleryImages: [
      '/products/grocery-care-pack.svg',
      '/products/grocery-care-pack.svg',
      '/products/grocery-care-pack.svg',
      '/products/grocery-care-pack.svg',
    ],
    price: 999,
    mrp: 1299,
    rating: 4.4,
    reviews: 77,
    badge: 'Value Pack',
    summary:
      'A curated essentials bundle for weekly households that want quality without friction.',
    colors: ['Multi-pack'],
    sizes: ['10 items'],
    stock: 'In stock',
    delivery: 'Next-day dispatch where available',
  },
]

type DemoBlueprint = {
  category: Category['slug']
  brands: string[]
  adjectives: string[]
  nouns: string[]
  badges: string[]
  colors: string[]
  sizes: string[]
  image: string
  count: number
  priceBase: number
  priceStep: number
  mrpOffset: number
  reviewBase: number
  delivery: string[]
  summary: string
}

const demoBlueprints: DemoBlueprint[] = [
  {
    category: 'electronics',
    brands: ['NovaCore', 'ApexWave', 'VoltZen', 'EkoTech'],
    adjectives: ['Smart', 'Wireless', 'Portable', 'Compact', 'Elite', 'Ultra', 'Pro', 'Neo'],
    nouns: ['Earbuds', 'Speaker', 'Charger', 'Headset', 'Tracker', 'Dock', 'Lamp', 'Hub'],
    badges: ['Best Seller', 'Top Rated', 'Hot Deal', 'New Launch'],
    colors: ['Emerald', 'Graphite', 'Ivory'],
    sizes: ['One Size'],
    image: '/products/aurora-headphones.svg',
    count: 40,
    priceBase: 1299,
    priceStep: 173,
    mrpOffset: 620,
    reviewBase: 86,
    delivery: ['Next-day delivery', 'Ships in 24 hours', 'Arrives in 2 days'],
    summary: 'Modern electronics designed for everyday speed, clarity, and practical use.',
  },
  {
    category: 'beauty-shringar',
    brands: ['Mira Skin', 'Saffron Lane', 'GlowNest', 'BloomAura'],
    adjectives: ['Glow', 'Radiance', 'Herbal', 'Silk', 'Pure', 'Soft', 'Bright', 'Calm'],
    nouns: ['Serum', 'Kit', 'Mist', 'Cream', 'Cleanser', 'Masque', 'Oil', 'Toner'],
    badges: ['Top Rated', 'Bestseller', 'Beauty Edit', 'Fresh Pick'],
    colors: ['Gold', 'Rose', 'Cream'],
    sizes: ['Travel', 'Regular'],
    image: '/products/saffron-glow-kit.svg',
    count: 40,
    priceBase: 499,
    priceStep: 67,
    mrpOffset: 310,
    reviewBase: 120,
    delivery: ['Ships today', 'Dispatch in 24 hours', 'Delivery by tomorrow'],
    summary: 'Premium beauty essentials with a clean routine-first presentation.',
  },
  {
    category: 'fashion',
    brands: ['Aurelia', 'SageThread', 'UrbanMuse', 'Velora'],
    adjectives: ['Classic', 'Everyday', 'Tailored', 'Elegant', 'Smart', 'Modern', 'Refined', 'Minimal'],
    nouns: ['Bag', 'Shirt', 'Kurta', 'Dress', 'Sneaker', 'Set', 'Tote', 'Jacket'],
    badges: ['Luxury Pick', 'Style Edit', 'New Drop', 'Editor Choice'],
    colors: ['Forest', 'Cocoa', 'Black'],
    sizes: ['XS', 'S', 'M', 'L'],
    image: '/products/heritage-bag.svg',
    count: 40,
    priceBase: 899,
    priceStep: 91,
    mrpOffset: 520,
    reviewBase: 64,
    delivery: ['Express delivery', 'Ships in 24 hours', 'Arrives in 3 days'],
    summary: 'Fashion staples with polished silhouettes and balanced everyday comfort.',
  },
  {
    category: 'home-kitchen',
    brands: ['VerdeHaus', 'PureNest', 'HomeCraft', 'KitchenForm'],
    adjectives: ['Smart', 'Compact', 'Useful', 'Airtight', 'Elegant', 'Stackable', 'Clean', 'Utility'],
    nouns: ['Jar Set', 'Mug Set', 'Storage Box', 'Organizer', 'Cookware Set', 'Lunch Box', 'Tray', 'Bottle Set'],
    badges: ['Flash Sale', 'New Arrival', 'Daily Value', 'Home Essential'],
    colors: ['Olive', 'Clear', 'Charcoal'],
    sizes: ['Set of 2', 'Set of 4', 'Set of 6'],
    image: '/products/kitchen-jar-set.svg',
    count: 34,
    priceBase: 399,
    priceStep: 79,
    mrpOffset: 260,
    reviewBase: 48,
    delivery: ['Ships within 24 hours', 'Standard delivery', 'Delivery in 2 to 4 days'],
    summary: 'Functional home and kitchen products made to feel clean and dependable.',
  },
  {
    category: 'grocery',
    brands: ['SopySafe Select', 'DailyCart', 'FreshTrail', 'HarvestOne'],
    adjectives: ['Daily', 'Fresh', 'Balanced', 'Essentials', 'Value', 'Smart', 'Pure', 'Family'],
    nouns: ['Care Pack', 'Pantry Pack', 'Staples Box', 'Essentials Kit', 'Snack Box', 'Tea Pack', 'Health Pack', 'Value Bundle'],
    badges: ['Value Pack', 'Grocery Deal', 'Everyday Buy', 'Weekly Need'],
    colors: ['Multi-pack'],
    sizes: ['5 items', '10 items', '12 items'],
    image: '/products/grocery-care-pack.svg',
    count: 20,
    priceBase: 199,
    priceStep: 59,
    mrpOffset: 120,
    reviewBase: 18,
    delivery: ['Next-day dispatch', 'Ships today', 'Delivery in 2 days'],
    summary: 'Reliable grocery essentials for quick replenishment and daily household buying.',
  },
  {
    category: 'mobile-accessories',
    brands: ['PocketVolt', 'MobiFlex', 'ChargeMate', 'GripLine'],
    adjectives: ['Fast', 'Magnetic', 'Slim', 'Durable', 'Compact', 'Clear', 'Pro', 'Everyday'],
    nouns: ['Charger', 'Case', 'Cable', 'Stand', 'Holder', 'Power Bank', 'Lens Kit', 'Screen Guard'],
    badges: ['Tech Value', 'New Accessory', 'Top Pick', 'Work Ready'],
    colors: ['Black', 'White', 'Blue'],
    sizes: ['One Size'],
    image: '/products/aurora-headphones.svg',
    count: 20,
    priceBase: 149,
    priceStep: 42,
    mrpOffset: 90,
    reviewBase: 30,
    delivery: ['Ships today', 'Dispatch in 24 hours', 'Fast delivery'],
    summary: 'Practical mobile accessories that keep devices ready and protected.',
  },
]

function generateDemoProducts() {
  const items: Product[] = []

  demoBlueprints.forEach((blueprint) => {
    for (let index = 0; index < blueprint.count; index += 1) {
      const sequence = index + 1
      const adjective = blueprint.adjectives[index % blueprint.adjectives.length]
      const noun = blueprint.nouns[index % blueprint.nouns.length]
      const brand = blueprint.brands[index % blueprint.brands.length]
      const badge = blueprint.badges[index % blueprint.badges.length]
      const image = blueprint.image
      const price = blueprint.priceBase + index * blueprint.priceStep
      const mrp = price + blueprint.mrpOffset + ((index % 5) * 25)

      items.push({
        slug: ensureUniqueSlug(
          `${brand} ${adjective} ${noun} ${String(sequence).padStart(2, '0')}`,
          items.map((item) => item.slug),
          'product',
        ),
        name: `${brand} ${adjective} ${noun} ${String(sequence).padStart(2, '0')}`,
        category: blueprint.category,
        brand,
        image,
        galleryImages: [image, image, image, image],
        price,
        mrp,
        rating: Number((4.1 + ((index % 8) * 0.1)).toFixed(1)),
        reviews: blueprint.reviewBase + index * 7,
        badge,
        summary: blueprint.summary,
        colors: blueprint.colors,
        sizes: blueprint.sizes,
        stock: index % 6 === 0 ? 'Low stock' : 'In stock',
        delivery: blueprint.delivery[index % blueprint.delivery.length],
      })
    }
  })

  return items
}

export const products: Product[] = [...featuredProducts, ...generateDemoProducts()]

export function getProduct(slug: string) {
  return products.find((product) => product.slug === slug)
}
