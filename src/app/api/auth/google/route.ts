import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import {
  buildGoogleAuthUrl,
  createCodeChallenge,
  createGoogleOAuthState,
  decodeGoogleOAuthState,
  encodeSession,
  exchangeGoogleCode,
  fetchGoogleProfile,
  getGoogleStateCookieName,
  getSessionCookieName,
  upsertGoogleSession,
} from '@/server/auth/auth-otp-store'
import { siteUrl } from '@/lib/site'
import { getMissingRuntimeConfigKeys } from '@/server/config/runtime-config'

export async function GET(request: Request) {
  const url = new URL(request.url)
  const startRequested = url.searchParams.get('start') === '1'
  const code = url.searchParams.get('code')?.trim()
  const state = url.searchParams.get('state')?.trim()

  if (startRequested) {
    const returnTo = url.searchParams.get('returnTo')?.trim() || '/account'
    const clientId = process.env.GOOGLE_CLIENT_ID?.trim()

    if (!clientId) {
      return NextResponse.json(
        {
          error: 'Google OAuth is not configured',
          missing: getMissingRuntimeConfigKeys().filter((item) => item.includes('GOOGLE_')),
        },
        { status: 503 },
      )
    }

    const stateToken = createGoogleOAuthState(returnTo)
    const parsedState = decodeGoogleOAuthState(stateToken)
    if (!parsedState) {
      return NextResponse.json({ error: 'Unable to start Google OAuth' }, { status: 500 })
    }

    const redirectUri = process.env.GOOGLE_REDIRECT_URI?.trim() || siteUrl('/api/auth/google')
    const authUrl = buildGoogleAuthUrl({
      clientId,
      redirectUri,
      state: parsedState.state,
      codeChallenge: createCodeChallenge(parsedState.verifier),
    })

    const response = NextResponse.redirect(authUrl)
    response.cookies.set(getGoogleStateCookieName(), stateToken, {
      httpOnly: true,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
      path: '/',
      maxAge: 60 * 10,
    })

    return response
  }

  if (!code || !state) {
    return NextResponse.redirect(siteUrl('/login?error=missing_google_code'))
  }

  const cookieStore = await cookies()
  const stateToken = cookieStore.get(getGoogleStateCookieName())?.value
  const storedState = decodeGoogleOAuthState(stateToken)

  if (!storedState || storedState.state !== state) {
    return NextResponse.redirect(siteUrl('/login?error=invalid_google_state'))
  }

  const clientId = process.env.GOOGLE_CLIENT_ID?.trim()
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET?.trim()
  const redirectUri = process.env.GOOGLE_REDIRECT_URI?.trim() || siteUrl('/api/auth/google')

  if (!clientId || !clientSecret) {
    return NextResponse.redirect(
      siteUrl('/login?error=google_not_configured&missing=' + encodeURIComponent(getMissingRuntimeConfigKeys().join(','))),
    )
  }

  try {
    const tokenResponse = await exchangeGoogleCode({
      code,
      clientId,
      clientSecret,
      redirectUri,
      codeVerifier: storedState.verifier,
    })

    const profile = await fetchGoogleProfile(tokenResponse.access_token)
    const session = upsertGoogleSession(profile)

    const response = NextResponse.redirect(siteUrl(storedState.returnTo || '/account'))
    response.cookies.set(getSessionCookieName(), encodeSession(session), {
      httpOnly: true,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
      path: '/',
      maxAge: 60 * 60 * 24 * 30,
    })
    response.cookies.set(getGoogleStateCookieName(), '', {
      httpOnly: true,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
      path: '/',
      maxAge: 0,
    })
    return response
  } catch {
    return NextResponse.redirect(siteUrl('/login?error=google_login_failed'))
  }
}
