import crypto from 'node:crypto'

export type AuthSession = {
  id: string
  name: string
  identifier: string
  image?: string | null
  provider: 'otp' | 'google'
}

export type GoogleOAuthState = {
  state: string
  verifier: string
  returnTo: string
  createdAt: number
}

export type GoogleProfile = {
  sub: string
  name?: string
  email?: string
  picture?: string
  email_verified?: boolean
}

const SESSION_COOKIE = 'sopysafe-auth-session'
const GOOGLE_STATE_COOKIE = 'sopysafe-google-oauth'
const SIGNING_SECRET = process.env.AUTH_SECRET ?? process.env.NEXTAUTH_SECRET ?? 'sopysafe-dev-secret'

function signPayload(value: string) {
  return crypto.createHmac('sha256', SIGNING_SECRET).update(value).digest('base64url')
}

function encodePayload<T>(payload: T) {
  const body = Buffer.from(JSON.stringify(payload)).toString('base64url')
  return `${body}.${signPayload(body)}`
}

function decodePayload<T>(value?: string | null) {
  if (!value) return null

  const [body, sig] = value.split('.')
  if (!body || !sig) return null
  if (signPayload(body) !== sig) return null

  try {
    return JSON.parse(Buffer.from(body, 'base64url').toString('utf8')) as T
  } catch {
    return null
  }
}

export function createGoogleOAuthState(returnTo = '/account') {
  return encodePayload<GoogleOAuthState>({
    state: crypto.randomBytes(16).toString('base64url'),
    verifier: crypto.randomBytes(32).toString('base64url'),
    returnTo,
    createdAt: Date.now(),
  })
}

export function decodeGoogleOAuthState(value?: string | null) {
  const decoded = decodePayload<GoogleOAuthState>(value)
  if (!decoded) return null
  if (typeof decoded.state !== 'string' || typeof decoded.verifier !== 'string' || typeof decoded.returnTo !== 'string') {
    return null
  }
  if (Date.now() - decoded.createdAt > 10 * 60 * 1000) {
    return null
  }
  return decoded
}

export function buildGoogleAuthUrl(params: {
  clientId: string
  redirectUri: string
  scope?: string
  state: string
  codeChallenge: string
  loginHint?: string
}) {
  const url = new URL('https://accounts.google.com/o/oauth2/v2/auth')
  url.searchParams.set('client_id', params.clientId)
  url.searchParams.set('redirect_uri', params.redirectUri)
  url.searchParams.set('response_type', 'code')
  url.searchParams.set('scope', params.scope ?? 'openid email profile')
  url.searchParams.set('state', params.state)
  url.searchParams.set('code_challenge', params.codeChallenge)
  url.searchParams.set('code_challenge_method', 'S256')
  url.searchParams.set('access_type', 'offline')
  url.searchParams.set('prompt', 'consent')
  if (params.loginHint) {
    url.searchParams.set('login_hint', params.loginHint)
  }
  return url.toString()
}

export function createCodeChallenge(verifier: string) {
  return crypto.createHash('sha256').update(verifier).digest('base64url')
}

export async function exchangeGoogleCode(input: {
  code: string
  clientId: string
  clientSecret: string
  redirectUri: string
  codeVerifier: string
}) {
  const response = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      code: input.code,
      client_id: input.clientId,
      client_secret: input.clientSecret,
      redirect_uri: input.redirectUri,
      grant_type: 'authorization_code',
      code_verifier: input.codeVerifier,
    }),
  })

  if (!response.ok) {
    throw new Error('Unable to exchange Google authorization code')
  }

  return (await response.json()) as {
    access_token: string
    expires_in: number
    id_token?: string
    scope?: string
    token_type: string
  }
}

export async function fetchGoogleProfile(accessToken: string) {
  const response = await fetch('https://openidconnect.googleapis.com/v1/userinfo', {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  })

  if (!response.ok) {
    throw new Error('Unable to fetch Google profile')
  }

  return (await response.json()) as GoogleProfile
}

export function encodeSession(session: AuthSession) {
  return encodePayload(session)
}

export function decodeSession(value?: string | null) {
  const decoded = decodePayload<AuthSession>(value)
  if (!decoded) return null
  if (
    typeof decoded.id !== 'string' ||
    typeof decoded.name !== 'string' ||
    typeof decoded.identifier !== 'string' ||
    (decoded.provider !== 'otp' && decoded.provider !== 'google')
  ) {
    return null
  }
  return {
    id: decoded.id,
    name: decoded.name,
    identifier: decoded.identifier,
    image: decoded.image ?? null,
    provider: decoded.provider,
  } satisfies AuthSession
}

export function getSessionCookieName() {
  return SESSION_COOKIE
}

export function getGoogleStateCookieName() {
  return GOOGLE_STATE_COOKIE
}
