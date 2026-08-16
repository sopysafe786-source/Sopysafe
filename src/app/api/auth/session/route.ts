import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import { decodeSession, getSessionCookieName } from '@/server/auth/auth-otp-store'

export async function GET() {
  const cookieStore = await cookies()
  const session = decodeSession(cookieStore.get(getSessionCookieName())?.value)
  return NextResponse.json({ session })
}
