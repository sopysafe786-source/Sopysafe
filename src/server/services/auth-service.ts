import { createOtp, rememberPendingProfile } from '@/server/auth/auth-otp-store'
import { sendOtpToIdentifier, verifyOtpForIdentifier } from '@/server/auth/twilio-otp'

export async function requestOtp(identifier: string, name?: string) {
  await rememberPendingProfile(identifier, name)
  const maskedIdentifier = identifier.includes('@')
    ? identifier.replace(/^(.).+(@.+)$/, '$1***$2')
    : identifier.replace(/(\d{2})\d+(\d{2})/, '$1******$2')

  try {
    const delivery = await sendOtpToIdentifier(identifier)

    if (!delivery.configured) {
      const devOtp = await createOtp(identifier, name)
      return {
        configured: false,
        maskedIdentifier,
        channel: identifier.includes('@') ? 'email' : 'sms',
        devOtp,
      }
    }

    return {
      configured: true,
      maskedIdentifier,
      channel: identifier.includes('@') ? 'email' : 'sms',
      devOtp: undefined as string | undefined,
    }
  } catch (error) {
    if (process.env.NODE_ENV === 'production') {
      throw error
    }

    const devOtp = await createOtp(identifier, name)
    return {
      configured: false,
      maskedIdentifier,
      channel: identifier.includes('@') ? 'email' : 'sms',
      devOtp,
    }
  }
}

export async function verifyOtp(identifier: string, code: string) {
  return verifyOtpForIdentifier(identifier, code)
}
