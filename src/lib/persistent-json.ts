import 'server-only'

import fs from 'node:fs'
import path from 'node:path'

const DATA_DIR = path.join(process.cwd(), '.data')

function ensureDataDir() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true })
  }
}

function resolveFile(name: string) {
  ensureDataDir()
  return path.join(DATA_DIR, name)
}

export function readJsonFile<T>(name: string, fallback: T): T {
  const filePath = resolveFile(name)

  if (!fs.existsSync(filePath)) {
    return fallback
  }

  try {
    const raw = fs.readFileSync(filePath, 'utf8')
    if (!raw.trim()) {
      return fallback
    }
    return JSON.parse(raw) as T
  } catch {
    return fallback
  }
}

export function writeJsonFile(name: string, data: unknown) {
  const filePath = resolveFile(name)
  const tempPath = `${filePath}.tmp`
  fs.writeFileSync(tempPath, `${JSON.stringify(data, null, 2)}\n`, 'utf8')
  if (fs.existsSync(filePath)) {
    fs.unlinkSync(filePath)
  }
  fs.renameSync(tempPath, filePath)
}

export function deleteJsonFile(name: string) {
  const filePath = resolveFile(name)
  if (fs.existsSync(filePath)) {
    fs.unlinkSync(filePath)
  }
}
