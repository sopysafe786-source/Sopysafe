import 'server-only'

type OtpChannel = 'sms' | 'email'

type TwilioVerifyResponse = {
  sid?: string
  status?: string
  valid?: boolean
  channel?: string
  to?: string
}

function getConfig() {
  const accountSid = process.env.TWILIO_ACCOUNT_SID?.trim()
  const authToken = process.env.TWILIO_AUTH_TOKEN?.trim()
  const serviceSid = process.env.TWILIO_VERIFY_SERVICE_SID?.trim()

  if (!accountSid || !authToken || !serviceSid) {
    return null
  }

  return {
    accountSid,
    authToken,
    serviceSid,
  }
}

function authHeader(accountSid: string, authToken: string) {
  return `Basic ${Buffer.from(`${accountSid}:${authToken}`).toString('base64')}`
}

function getDestination(identifier: string): { to: string; channel: OtpChannel } {
  const trimmed = identifier.trim()
  if (trimmed.includes('@')) {
    return { to: trimmed.toLowerCase(), channel: 'email' }
  }

  const digits = trimmed.replace(/[^\d+]/g, '')
  if (digits.startsWith('+')) {
    return { to: digits, channel: 'sms' }
  }

  if (digits.length === 10) {
    return { to: `+91${digits}`, channel: 'sms' }
  }

  if (digits.length === 12 && digits.startsWith('91')) {
    return { to: `+${digits}`, channel: 'sms' }
  }

  return {
    to: digits,
    channel: 'sms',
  }
}

export function isTwilioOtpConfigured() {
  return Boolean(getConfig())
}

export async function sendOtpToIdentifier(identifier: string) {
  const config = getConfig()
  if (!config) {
    return { configured: false as const }
  }

  const destination = getDestination(identifier)
  const response = await fetch(
    `https://verify.twilio.com/v2/Services/${config.serviceSid}/Verifications`,
    {
      method: 'POST',
      headers: {
        Authorization: authHeader(config.accountSid, config.authToken),
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        To: destination.to,
        Channel: destination.channel,
      }),
    },
  )

  if (!response.ok) {
    throw new Error('Unable to send verification code')
  }

  return { configured: true as const }
}

export async function verifyOtpForIdentifier(identifier: string, code: string) {
  const config = getConfig()
  if (!config) {
    return { configured: false as const, valid: false }
  }

  const destination = getDestination(identifier)
  const response = await fetch(
    `https://verify.twilio.com/v2/Services/${config.serviceSid}/VerificationCheck`,
    {
      method: 'POST',
      headers: {
        Authorization: authHeader(config.accountSid, config.authToken),
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        To: destination.to,
        Code: code.trim(),
      }),
    },
  )

  if (!response.ok) {
    return { configured: true as const, valid: false }
  }

  const payload = (await response.json()) as TwilioVerifyResponse
  return {
    configured: true as const,
    valid: payload.valid === true || payload.status === 'approved',
  }
}
