import { NextResponse } from 'next/server'
import { getMissingRuntimeConfigKeys, getRuntimeConfigStatus } from '@/server/config/runtime-config'

export function GET() {
  const status = getRuntimeConfigStatus()
  const missing = getMissingRuntimeConfigKeys()

  return NextResponse.json({
    ok: true,
    service: 'sopysafe',
    status: missing.length === 0 ? 'ready' : 'needs-config',
    missing,
    runtime: status,
    timestamp: new Date().toISOString(),
  })
}
