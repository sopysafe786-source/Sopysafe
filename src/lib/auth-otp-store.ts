import 'server-only'

import crypto from 'node:crypto'
import { deleteJsonFile, readJsonFile, writeJsonFile } from '@/lib/persistent-json'

type OtpRecord = {
  identifier: string
  name?: string
  code: string
  expiresAt: number
}

type StoredUser = {
  id: string
  name: string
  email?: string
  phone?: string
  image?: string
  createdAt: string
  updatedAt: string
}

type StoredAccount = {
  provider: 'google'
  providerAccountId: string
  userId: string
}

type AuthState = {
  users: StoredUser[]
  accounts: StoredAccount[]
  otps: Record<string, OtpRecord>
  pendingProfiles: Record<string, { name?: string; expiresAt: number }>
}

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

const AUTH_STATE_FILE = 'auth-state.json'
const SESSION_COOKIE = 'sopysafe-auth-session'
const GOOGLE_STATE_COOKIE = 'sopysafe-google-oauth'
const SIGNING_SECRET = process.env.AUTH_SECRET ?? process.env.NEXTAUTH_SECRET ?? 'sopysafe-dev-secret'

function normalizeIdentifier(identifier: string) {
  return identifier.trim().toLowerCase()
}

function normalizePhone(identifier: string) {
  return identifier.replace(/[^\d+]/g, '')
}

function createDefaultState(): AuthState {
  return {
    users: [],
    accounts: [],
    otps: {},
    pendingProfiles: {},
  }
}

function loadState(): AuthState {
  return readJsonFile<AuthState>(AUTH_STATE_FILE, createDefaultState())
}

function saveState(state: AuthState) {
  writeJsonFile(AUTH_STATE_FILE, state)
}

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

function createUserIdentifier(name: string) {
  return name.trim().replace(/[^a-z0-9]+/gi, '-').toLowerCase().replace(/^-+|-+$/g, '') || 'customer'
}

function getDisplayName(identifier: string, name?: string) {
  if (name?.trim()) return name.trim()
  if (identifier.includes('@')) {
    return identifier.split('@')[0]?.replace(/[^a-z0-9]+/gi, ' ').trim() || 'Customer'
  }
  return `Customer ${identifier.slice(-4)}`
}

function getIdentityShape(identifier: string) {
  const normalized = normalizeIdentifier(identifier)
  return normalized.includes('@')
    ? { email: normalized, phone: undefined }
    : { email: undefined, phone: normalizePhone(normalized) }
}

function upsertUser(
  state: AuthState,
  input: {
    name?: string
    email?: string
    phone?: string
    image?: string
    provider?: 'google' | 'otp'
    providerAccountId?: string
  },
) {
  const existingAccount =
    input.provider && input.providerAccountId
      ? state.accounts.find(
          (account) =>
            account.provider === input.provider && account.providerAccountId === input.providerAccountId,
        )
      : undefined

  let user = existingAccount ? state.users.find((item) => item.id === existingAccount.userId) : undefined

  if (!user && input.email) {
    user = state.users.find((item) => item.email?.toLowerCase() === input.email?.toLowerCase())
  }

  if (!user && input.phone) {
    user = state.users.find((item) => item.phone === input.phone)
  }

  if (!user) {
    const now = new Date().toISOString()
    user = {
      id: crypto.randomUUID(),
      name: input.name?.trim() || input.email?.split('@')[0] || input.phone?.slice(-4) || 'Customer',
      email: input.email?.trim() || undefined,
      phone: input.phone?.trim() || undefined,
      image: input.image,
      createdAt: now,
      updatedAt: now,
    }
    state.users.unshift(user)
  } else {
    user.name = input.name?.trim() || user.name
    user.email = input.email?.trim() || user.email
    user.phone = input.phone?.trim() || user.phone
    user.image = input.image ?? user.image
    user.updatedAt = new Date().toISOString()
  }

  if (input.provider === 'google' && input.providerAccountId) {
    const currentAccount = state.accounts.find(
      (account) => account.provider === input.provider && account.providerAccountId === input.providerAccountId,
    )

    if (!currentAccount) {
      state.accounts.unshift({
        provider: input.provider,
        providerAccountId: input.providerAccountId,
        userId: user.id,
      })
    } else {
      currentAccount.userId = user.id
    }
  }

  return user
}

export function createOtp(identifier: string, name?: string) {
  const normalized = normalizeIdentifier(identifier)
  const code = String(Math.floor(100000 + Math.random() * 900000))
  const state = loadState()

  state.otps[normalized] = {
    identifier: normalized,
    name: name?.trim() || undefined,
    code,
    expiresAt: Date.now() + 5 * 60 * 1000,
  }

  saveState(state)
  return code
}

export function rememberPendingProfile(identifier: string, name?: string) {
  const normalized = normalizeIdentifier(identifier)
  const state = loadState()
  state.pendingProfiles[normalized] = {
    name: name?.trim() || undefined,
    expiresAt: Date.now() + 10 * 60 * 1000,
  }
  saveState(state)
}

function resolvePendingName(state: AuthState, identifier: string, fallback?: string) {
  const normalized = normalizeIdentifier(identifier)
  const profile = state.pendingProfiles[normalized]
  if (!profile) {
    return fallback
  }
  if (profile.expiresAt < Date.now()) {
    delete state.pendingProfiles[normalized]
    saveState(state)
    return fallback
  }

  delete state.pendingProfiles[normalized]
  return profile.name || fallback
}

export function finalizeSessionFromIdentifier(
  identifier: string,
  provider: 'otp' | 'google',
  extra?: { name?: string; image?: string; providerAccountId?: string },
) {
  const normalized = normalizeIdentifier(identifier)
  const state = loadState()
  const pendingName = resolvePendingName(state, normalized, extra?.name)
  const identity = getIdentityShape(normalized)
  const user = upsertUser(state, {
    name: pendingName,
    email: identity.email,
    phone: identity.phone,
    image: extra?.image,
    provider: provider === 'google' ? 'google' : 'otp',
    providerAccountId: extra?.providerAccountId,
  })
  saveState(state)

  return {
    id: user.id,
    name: user.name || getDisplayName(normalized, pendingName),
    identifier: normalized,
    image: user.image ?? null,
    provider,
  } satisfies AuthSession
}

export function consumeOtp(identifier: string, code: string) {
  const normalized = normalizeIdentifier(identifier)
  const state = loadState()
  const record = state.otps[normalized]

  if (!record) return null
  if (record.expiresAt < Date.now()) {
    delete state.otps[normalized]
    saveState(state)
    return null
  }

  if (record.code !== code.trim()) {
    return null
  }

  delete state.otps[normalized]
  saveState(state)

  return finalizeSessionFromIdentifier(record.identifier, 'otp', {
    name: record.name,
  })
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

export function upsertGoogleSession(profile: GoogleProfile) {
  const state = loadState()
  const email = profile.email?.trim().toLowerCase()
  const user = upsertUser(state, {
    name: resolvePendingName(state, email ?? profile.sub, profile.name || profile.email || 'Google User'),
    email,
    image: profile.picture,
    provider: 'google',
    providerAccountId: profile.sub,
  })

  saveState(state)

  return {
    id: user.id,
    name: user.name,
    identifier: email || profile.sub,
    image: user.image ?? null,
    provider: 'google' as const,
  } satisfies AuthSession
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

export function clearAuthStateForTests() {
  deleteJsonFile(AUTH_STATE_FILE)
}
