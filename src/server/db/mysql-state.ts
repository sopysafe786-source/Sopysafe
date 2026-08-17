import 'server-only'

import type { RowDataPacket } from 'mysql2/promise'
import { ensureMySqlSchema, getMySqlPool, isMySqlConfigured } from '@/server/db/mysql'

function parsePayload<T>(value: unknown, fallback: T) {
  if (typeof value === 'string') {
    try {
      return JSON.parse(value) as T
    } catch {
      return fallback
    }
  }

  if (value && typeof value === 'object') {
    return value as T
  }

  return fallback
}

export async function readMySqlState<T>(stateKey: string, fallback: T) {
  if (!isMySqlConfigured()) {
    return fallback
  }

  try {
    const pool = getMySqlPool()
    if (!pool) {
      return fallback
    }

    await ensureMySqlSchema()
    const [rows] = await pool.execute<RowDataPacket[]>(
      'SELECT payload FROM app_state WHERE state_key = ? LIMIT 1',
      [stateKey],
    )
    const row = rows[0] as RowDataPacket & { payload?: unknown } | undefined
    if (!row) {
      return fallback
    }

    return parsePayload<T>(row.payload, fallback)
  } catch {
    return fallback
  }
}

export async function writeMySqlState<T>(stateKey: string, payload: T) {
  if (!isMySqlConfigured()) {
    return payload
  }

  try {
    const pool = getMySqlPool()
    if (!pool) {
      return payload
    }

    await ensureMySqlSchema()
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

    return payload
  } catch {
    return payload
  }
}

export async function deleteMySqlState(stateKey: string) {
  if (!isMySqlConfigured()) {
    return
  }

  try {
    const pool = getMySqlPool()
    if (!pool) {
      return
    }

    await ensureMySqlSchema()
    await pool.execute('DELETE FROM app_state WHERE state_key = ?', [stateKey])
  } catch {
    return
  }
}
