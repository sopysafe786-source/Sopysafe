import crypto from 'node:crypto'
import {
  buildGoogleAuthUrl,
  createCodeChallenge,
  createGoogleOAuthState,
  decodeGoogleOAuthState,
  decodeSession,
  encodeSession,
  exchangeGoogleCode,
  fetchGoogleProfile,
  getGoogleStateCookieName,
  getSessionCookieName,
} from '@/lib/auth-otp-store'
import { deleteMySqlState, readMySqlState, writeMySqlState } from '@/server/db/mysql-state'

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

type AuthSession = {
  id: string
  name: string
  identifier: string
  image?: string | null
  provider: 'otp' | 'google'
}

type GoogleProfile = {
  sub: string
  name?: string
  email?: string
  picture?: string
  email_verified?: boolean
}

type FinalizeInput = {
  name?: string
  image?: string
  providerAccountId?: string
}

const AUTH_STATE_KEY = 'auth_state'

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

function getIdentityShape(identifier: string) {
  const normalized = normalizeIdentifier(identifier)
  return normalized.includes('@')
    ? { email: normalized, phone: undefined }
    : { email: undefined, phone: normalizePhone(normalized) }
}

function resolveDisplayName(identifier: string, name?: string) {
  if (name?.trim()) return name.trim()
  if (identifier.includes('@')) {
    return identifier.split('@')[0]?.replace(/[^a-z0-9]+/gi, ' ').trim() || 'Customer'
  }
  return `Customer ${identifier.slice(-4)}`
}

async function loadState() {
  return readMySqlState<AuthState>(AUTH_STATE_KEY, createDefaultState())
}

async function saveState(state: AuthState) {
  return writeMySqlState(AUTH_STATE_KEY, state)
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

function resolvePendingName(state: AuthState, identifier: string, fallback?: string) {
  const normalized = normalizeIdentifier(identifier)
  const profile = state.pendingProfiles[normalized]
  if (!profile) {
    return fallback
  }
  if (profile.expiresAt < Date.now()) {
    delete state.pendingProfiles[normalized]
    return fallback
  }

  delete state.pendingProfiles[normalized]
  return profile.name || fallback
}

function finalizeSessionFromState(
  state: AuthState,
  identifier: string,
  provider: 'otp' | 'google',
  extra?: FinalizeInput,
) {
  const normalized = normalizeIdentifier(identifier)
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

  return {
    id: user.id,
    name: user.name || resolveDisplayName(normalized, pendingName),
    identifier: normalized,
    image: user.image ?? null,
    provider,
  } satisfies AuthSession
}

export {
  buildGoogleAuthUrl,
  createCodeChallenge,
  createGoogleOAuthState,
  decodeGoogleOAuthState,
  decodeSession,
  encodeSession,
  exchangeGoogleCode,
  fetchGoogleProfile,
  getGoogleStateCookieName,
  getSessionCookieName,
}

export async function createOtp(identifier: string, name?: string) {
  const state = await loadState()
  const normalized = normalizeIdentifier(identifier)
  const code = String(Math.floor(100000 + Math.random() * 900000))

  state.otps[normalized] = {
    identifier: normalized,
    name: name?.trim() || undefined,
    code,
    expiresAt: Date.now() + 5 * 60 * 1000,
  }

  await saveState(state)
  return code
}

export async function rememberPendingProfile(identifier: string, name?: string) {
  const normalized = normalizeIdentifier(identifier)
  const state = await loadState()
  state.pendingProfiles[normalized] = {
    name: name?.trim() || undefined,
    expiresAt: Date.now() + 10 * 60 * 1000,
  }
  await saveState(state)
}

export async function consumeOtp(identifier: string, code: string) {
  const normalized = normalizeIdentifier(identifier)
  const state = await loadState()
  const record = state.otps[normalized]

  if (!record) return null
  if (record.expiresAt < Date.now()) {
    delete state.otps[normalized]
    await saveState(state)
    return null
  }

  if (record.code !== code.trim()) {
    return null
  }

  delete state.otps[normalized]
  await saveState(state)

  return finalizeSessionFromState(state, record.identifier, 'otp', {
    name: record.name,
  })
}

export async function finalizeSessionFromIdentifier(
  identifier: string,
  provider: 'otp' | 'google',
  extra?: FinalizeInput,
) {
  const state = await loadState()
  const session = finalizeSessionFromState(state, identifier, provider, extra)
  await saveState(state)
  return session
}

export async function upsertGoogleSession(profile: GoogleProfile) {
  const state = await loadState()
  const email = profile.email?.trim().toLowerCase()
  const user = upsertUser(state, {
    name: resolvePendingName(state, email ?? profile.sub, profile.name || profile.email || 'Google User'),
    email,
    image: profile.picture,
    provider: 'google',
    providerAccountId: profile.sub,
  })

  await saveState(state)

  return {
    id: user.id,
    name: user.name,
    identifier: email || profile.sub,
    image: user.image ?? null,
    provider: 'google' as const,
  }
}

export async function clearAuthStateForTests() {
  await deleteMySqlState(AUTH_STATE_KEY)
}
