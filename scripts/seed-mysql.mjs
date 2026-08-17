import mysql from 'mysql2/promise'
import {
  categories as defaultCategories,
  defaultHomeSectionOrder,
  defaultSiteContent,
  products as defaultProducts,
} from '../src/lib/storefront-data.ts'

function getMySqlUrl() {
  return process.env.MYSQL_URL?.trim() || ''
}

function normalizeProduct(product) {
  return {
    ...product,
    galleryImages:
      Array.isArray(product.galleryImages) && product.galleryImages.length ? product.galleryImages : [product.image],
  }
}

function createDefaultCatalogState() {
  return {
    site: defaultSiteContent,
    categories: defaultCategories,
    products: defaultProducts.map(normalizeProduct),
    homeSectionOrder: defaultHomeSectionOrder,
    updatedAt: new Date().toISOString(),
  }
}

function createSeedState() {
  const authState = {
    users: [],
    accounts: [],
    otps: {},
    pendingProfiles: {},
  }

  return {
    catalogState: createDefaultCatalogState(),
    ordersState: { orders: [] },
    authState,
  }
}

async function ensureSchema(pool) {
  await pool.execute(`
    CREATE TABLE IF NOT EXISTS app_state (
      state_key VARCHAR(191) NOT NULL PRIMARY KEY,
      payload JSON NOT NULL,
      updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    )
  `)
}

async function writeState(pool, stateKey, payload) {
  await pool.execute(
    `
      INSERT INTO app_state (state_key, payload)
      VALUES (?, CAST(? AS JSON))
      ON DUPLICATE KEY UPDATE
        payload = VALUES(payload),
        updated_at = CURRENT_TIMESTAMP
    `,
    [stateKey, JSON.stringify(payload)],
  )
}

async function main() {
  const mysqlUrl = getMySqlUrl()
  if (!mysqlUrl) {
    throw new Error('MYSQL_URL is required before seeding MySQL.')
  }

  const pool = mysql.createPool(mysqlUrl)
  const shouldReset = process.argv.includes('--reset')

  try {
    await ensureSchema(pool)

    if (shouldReset) {
      await pool.execute('DELETE FROM app_state')
    }

    const { catalogState, ordersState, authState } = createSeedState()

    await writeState(pool, 'catalog_state', catalogState)
    await writeState(pool, 'orders_state', ordersState)
    await writeState(pool, 'auth_state', authState)

    const [rows] = await pool.execute('SELECT state_key FROM app_state ORDER BY state_key')
    const keys = rows.map((row) => String(row.state_key)).join(', ')
    console.log(`Seeded MySQL app_state rows: ${keys}`)
    console.log(`Catalog products seeded: ${catalogState.products.length}`)
    console.log(`Orders seeded: ${ordersState.orders.length}`)
  } finally {
    await pool.end()
  }
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error)
  process.exit(1)
})
