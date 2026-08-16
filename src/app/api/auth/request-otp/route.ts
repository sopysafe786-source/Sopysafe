import { NextResponse } from 'next/server'
import { createOtp, rememberPendingProfile } from '@/server/auth/auth-otp-store'
import { sendOtpToIdentifier } from '@/server/auth/twilio-otp'
import { getMissingRuntimeConfigKeys } from '@/server/config/runtime-config'

export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as
    | { identifier?: string; name?: string }
    | null

  const identifier = body?.identifier?.trim()
  const name = body?.name?.trim()

  if (!identifier) {
    return NextResponse.json({ error: 'Identifier is required' }, { status: 400 })
  }

  rememberPendingProfile(identifier, name)

  const maskedIdentifier = identifier.includes('@')
    ? identifier.replace(/^(.).+(@.+)$/, '$1***$2')
    : identifier.replace(/(\d{2})\d+(\d{2})/, '$1******$2')

  try {
    const delivery = await sendOtpToIdentifier(identifier)

    if (!delivery.configured) {
      if (process.env.NODE_ENV === 'production') {
        return NextResponse.json(
          {
            error: 'OTP delivery is not configured',
            missing: getMissingRuntimeConfigKeys().filter((item) => item.includes('TWILIO_')),
          },
          { status: 503 },
        )
      }

      const otp = createOtp(identifier, name)
      return NextResponse.json({
        ok: true,
        maskedIdentifier,
        channel: identifier.includes('@') ? 'email' : 'sms',
        devOtp: otp,
      })
    }

    return NextResponse.json({
      ok: true,
      maskedIdentifier,
      channel: identifier.includes('@') ? 'email' : 'sms',
      devOtp: undefined,
    })
  } catch (error) {
    if (process.env.NODE_ENV === 'production') {
      const message = error instanceof Error ? error.message : 'Unable to send verification code'
      return NextResponse.json({ error: message }, { status: 500 })
    }

    const otp = createOtp(identifier, name)
    return NextResponse.json({
      ok: true,
      maskedIdentifier,
      channel: identifier.includes('@') ? 'email' : 'sms',
      devOtp: otp,
    })
  }
}
