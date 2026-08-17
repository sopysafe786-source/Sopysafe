import 'server-only'

import mysql, { type Pool } from 'mysql2/promise'

let pool: Pool | null = null
let schemaReady: Promise<void> | null = null

export function getMySqlUrl() {
  return process.env.MYSQL_URL?.trim() || ''
}

export function isMySqlConfigured() {
  return Boolean(getMySqlUrl())
}

export function getMySqlPool() {
  const url = getMySqlUrl()
  if (!url) {
    return null
  }

  if (!pool) {
    pool = mysql.createPool(url)
  }

  return pool
}

async function ensureSchema() {
  const pool = getMySqlPool()
  if (!pool) return

  await pool.execute(`
    CREATE TABLE IF NOT EXISTS app_state (
      state_key VARCHAR(191) NOT NULL PRIMARY KEY,
      payload JSON NOT NULL,
      updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    )
  `)
}

export async function ensureMySqlSchema() {
  if (!schemaReady) {
    schemaReady = ensureSchema().catch((error) => {
      schemaReady = null
      throw error
    })
  }

  return schemaReady
}
