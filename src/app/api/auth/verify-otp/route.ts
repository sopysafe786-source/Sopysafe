import { NextResponse } from 'next/server'
import {
  consumeOtp,
  encodeSession,
  finalizeSessionFromIdentifier,
  getSessionCookieName,
} from '@/server/auth/auth-otp-store'
import { verifyOtpForIdentifier } from '@/server/auth/twilio-otp'

export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as
    | { identifier?: string; code?: string }
    | null

  const identifier = body?.identifier?.trim()
  const code = body?.code?.trim()

  if (!identifier || !code) {
    return NextResponse.json({ error: 'Identifier and code are required' }, { status: 400 })
  }

  let session = null

  try {
    const twilioCheck = await verifyOtpForIdentifier(identifier, code)
    session = twilioCheck.configured
      ? twilioCheck.valid
        ? finalizeSessionFromIdentifier(identifier, 'otp')
        : null
      : consumeOtp(identifier, code)
  } catch {
    if (process.env.NODE_ENV !== 'production') {
      session = consumeOtp(identifier, code)
    } else {
      return NextResponse.json({ error: 'Unable to verify code right now' }, { status: 503 })
    }
  }

  if (!session) {
    return NextResponse.json({ error: 'Invalid or expired code' }, { status: 401 })
  }

  const response = NextResponse.json({ ok: true, session })
  response.cookies.set(getSessionCookieName(), encodeSession(session), {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: 60 * 60 * 24 * 30,
  })

  return response
}
