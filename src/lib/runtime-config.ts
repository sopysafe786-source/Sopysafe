import 'server-only'

export function getRuntimeConfigStatus() {
  const googleClientId = process.env.GOOGLE_CLIENT_ID?.trim()
  const googleClientSecret = process.env.GOOGLE_CLIENT_SECRET?.trim()
  const googleRedirectUri = process.env.GOOGLE_REDIRECT_URI?.trim()
  const twilioAccountSid = process.env.TWILIO_ACCOUNT_SID?.trim()
  const twilioAuthToken = process.env.TWILIO_AUTH_TOKEN?.trim()
  const twilioVerifyServiceSid = process.env.TWILIO_VERIFY_SERVICE_SID?.trim()
  const razorpayWebhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET?.trim()
  const authSecret = process.env.AUTH_SECRET?.trim() ?? process.env.NEXTAUTH_SECRET?.trim()
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL?.trim()

  return {
    auth: {
      secretConfigured: Boolean(authSecret),
      googleConfigured: Boolean(googleClientId && googleClientSecret),
      googleRedirectUriConfigured: Boolean(googleRedirectUri),
      otpConfigured: Boolean(twilioAccountSid && twilioAuthToken && twilioVerifyServiceSid),
    },
    payment: {
      razorpayWebhookConfigured: Boolean(razorpayWebhookSecret),
    },
    site: {
      publicUrlConfigured: Boolean(siteUrl),
    },
  }
}

export function getMissingRuntimeConfigKeys() {
  const missing: string[] = []
  const status = getRuntimeConfigStatus()

  if (!status.auth.secretConfigured) missing.push('AUTH_SECRET or NEXTAUTH_SECRET')
  if (!status.auth.googleConfigured) missing.push('GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET')
  if (!status.auth.googleRedirectUriConfigured) missing.push('GOOGLE_REDIRECT_URI')
  if (!status.auth.otpConfigured) missing.push('TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, TWILIO_VERIFY_SERVICE_SID')
  if (!status.payment.razorpayWebhookConfigured) missing.push('RAZORPAY_WEBHOOK_SECRET')
  if (!status.site.publicUrlConfigured) missing.push('NEXT_PUBLIC_SITE_URL')

  return missing
}

