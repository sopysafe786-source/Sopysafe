import { NextResponse } from 'next/server'
import { requestOtp } from '@/server/services/auth-service'
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

  try {
    const delivery = await requestOtp(identifier, name)

    if (!delivery.configured && process.env.NODE_ENV === 'production') {
      return NextResponse.json(
        {
          error: 'OTP delivery is not configured',
          missing: getMissingRuntimeConfigKeys().filter((item) => item.includes('TWILIO_')),
        },
        { status: 503 },
      )
    }

    return NextResponse.json({
      ok: true,
      maskedIdentifier: delivery.maskedIdentifier,
      channel: delivery.channel,
      devOtp: delivery.devOtp,
    })
  } catch (error) {
    if (process.env.NODE_ENV === 'production') {
      const message = error instanceof Error ? error.message : 'Unable to send verification code'
      return NextResponse.json({ error: message }, { status: 500 })
    }

    const message = error instanceof Error ? error.message : 'Unable to send verification code'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
