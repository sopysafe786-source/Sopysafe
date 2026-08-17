import fs from 'node:fs/promises'
import path from 'node:path'
import mysql from 'mysql2/promise'
import {
  categories as defaultCategories,
  defaultHomeSectionOrder,
  defaultSiteContent,
  products as defaultProducts,
} from '../src/lib/storefront-data.ts'

const ROOT_DIR = process.cwd()
const DATA_DIR = path.join(ROOT_DIR, '.data')
const CATALOG_FILE = path.join(DATA_DIR, 'catalog.json')
const ORDERS_FILE = path.join(DATA_DIR, 'orders.json')

function getMySqlUrl() {
  return process.env.MYSQL_URL?.trim() || process.env.DATABASE_URL?.trim() || ''
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

function normalizeCatalogState(state) {
  const fallback = createDefaultCatalogState()
  return {
    site: { ...defaultSiteContent, ...(state?.site ?? {}) },
    categories: Array.isArray(state?.categories) && state.categories.length ? state.categories : fallback.categories,
    products:
      Array.isArray(state?.products) && state.products.length
        ? state.products.map(normalizeProduct)
        : fallback.products,
    homeSectionOrder:
      Array.isArray(state?.homeSectionOrder) && state.homeSectionOrder.length
        ? state.homeSectionOrder
        : fallback.homeSectionOrder,
    updatedAt:
      typeof state?.updatedAt === 'string' && state.updatedAt.trim() ? state.updatedAt.trim() : new Date().toISOString(),
  }
}

async function readJsonFile(filePath) {
  try {
    const raw = await fs.readFile(filePath, 'utf8')
    return JSON.parse(raw)
  } catch {
    return null
  }
}

async function readSeedState() {
  const catalogState = normalizeCatalogState(await readJsonFile(CATALOG_FILE))
  const ordersJson = await readJsonFile(ORDERS_FILE)
  const ordersState = {
    orders: Array.isArray(ordersJson?.orders) ? ordersJson.orders : [],
  }

  const authState = {
    users: [],
    accounts: [],
    otps: {},
    pendingProfiles: {},
  }

  return {
    catalogState,
    ordersState,
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
    throw new Error('MYSQL_URL or DATABASE_URL is required before seeding MySQL.')
  }

  const pool = mysql.createPool(mysqlUrl)
  const shouldReset = process.argv.includes('--reset')

  try {
    await ensureSchema(pool)

    if (shouldReset) {
      await pool.execute('DELETE FROM app_state')
    }

    const { catalogState, ordersState, authState } = await readSeedState()

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
