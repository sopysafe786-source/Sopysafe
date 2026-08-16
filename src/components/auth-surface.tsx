'use client'

import type { FormEvent } from 'react'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowRight, CircleUserRound, Mail, Phone, ShieldCheck, Sparkles } from 'lucide-react'
import { useStorefront } from '@/components/storefront-provider'

type AuthMode = 'login' | 'register'

export function AuthSurface({ mode }: { mode: AuthMode }) {
  const router = useRouter()
  const { authSession, signIn } = useStorefront()
  const [name, setName] = useState('')
  const [identifier, setIdentifier] = useState('')
  const [otp, setOtp] = useState('')
  const [identifierMode, setIdentifierMode] = useState<'mobile' | 'email'>('mobile')
  const [step, setStep] = useState<'identity' | 'otp'>('identity')
  const [maskedIdentifier, setMaskedIdentifier] = useState('')
  const [devOtp, setDevOtp] = useState('')
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)

  const isLogin = mode === 'login'
  const identifierLabel = identifierMode === 'email' ? 'Email address' : 'Mobile number'
  const identifierPlaceholder =
    identifierMode === 'email' ? 'Enter your email address' : 'Enter your mobile number'
  const identifierInputMode = identifierMode === 'email' ? 'email' : 'tel'
  const handleGoogleLogin = () => {
    window.location.href = '/api/auth/google?start=1&returnTo=/account'
  }

  const requestOtp = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setLoading(true)
    setMessage('')

    const trimmedIdentifier = identifier.trim()
    const trimmedName = name.trim()

    if (!trimmedIdentifier) {
      setMessage('Please enter your email or mobile number.')
      setLoading(false)
      return
    }

    if (!isLogin && !trimmedName) {
      setMessage('Please enter your name to create an account.')
      setLoading(false)
      return
    }

    try {
      const response = await fetch('/api/auth/request-otp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          identifier: trimmedIdentifier,
          name: isLogin ? undefined : trimmedName,
        }),
      })

      const payload = (await response.json().catch(() => null)) as
        | { ok?: boolean; error?: string; maskedIdentifier?: string; devOtp?: string }
        | null

      if (!response.ok) {
        setMessage(payload?.error ?? 'Unable to request code')
        return
      }

      setMaskedIdentifier(payload?.maskedIdentifier ?? trimmedIdentifier)
      setDevOtp(payload?.devOtp ?? '')
      setStep('otp')
      setMessage('Code sent. Enter it to continue.')
    } finally {
      setLoading(false)
    }
  }

  const verifyOtp = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setLoading(true)
    setMessage('')

    try {
      const response = await fetch('/api/auth/verify-otp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          identifier: identifier.trim(),
          code: otp,
        }),
      })

      const payload = (await response.json().catch(() => null)) as
        | { ok?: boolean; error?: string; session?: { name: string; identifier: string } }
        | null

      if (!response.ok || !payload?.session) {
        setMessage(payload?.error ?? 'Invalid or expired code')
        return
      }

      signIn(payload.session)
      router.push('/account')
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className="bg-[#f7f7f3]">
      <div className="mx-auto grid max-w-7xl gap-6 px-4 py-8 sm:px-6 sm:py-12 lg:grid-cols-[1.05fr_0.95fr] lg:px-8 lg:py-14">
        <div className="space-y-4 sm:space-y-6">
          <div className="inline-flex items-center gap-2 rounded-full border border-emerald-950/10 bg-white px-3 py-2 text-xs font-semibold uppercase tracking-[0.24em] text-emerald-800">
            <Sparkles className="h-4 w-4" />
            {isLogin ? 'Welcome back' : 'Create account'}
          </div>

          <div className="space-y-2">
            <h1 className="text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">
              {isLogin ? 'Sign in with a code.' : 'Create your shopping account.'}
            </h1>
            <p className="max-w-2xl text-sm leading-6 text-slate-600 sm:text-base sm:leading-7">
              {isLogin
                ? 'Use email or mobile OTP to return to your account.'
                : 'Register once and keep orders, addresses, and wishlist together.'}
            </p>
          </div>

          {authSession ? (
            <div className="rounded-[1.25rem] border border-emerald-950/10 bg-emerald-50 p-4 text-sm text-emerald-900">
              You are already signed in as <span className="font-semibold">{authSession.name}</span>.
            </div>
          ) : null}
        </div>

        <div className="rounded-[1.75rem] border border-emerald-950/10 bg-white p-4 shadow-[0_14px_30px_rgba(15,23,42,0.05)] sm:p-6 lg:p-8">
          <button
            type="button"
            onClick={handleGoogleLogin}
            className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-full border border-emerald-950/10 bg-white px-5 text-sm font-semibold text-slate-900 transition hover:border-emerald-300 hover:bg-emerald-50"
          >
            <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden="true">
              <path
                fill="#EA4335"
                d="M12 10.2v3.9h5.5c-.2 1.1-1.4 3.2-5.5 3.2a6.9 6.9 0 0 1 0-13.8c2 0 3.4.8 4.2 1.5l2.9-2.8A10.9 10.9 0 0 0 12 1C6.5 1 2 5.5 2 11s4.5 10 10 10c5.7 0 9.5-4 9.5-9.7 0-.7-.1-1.2-.2-1.7H12Z"
              />
              <path
                fill="#34A853"
                d="M4.2 7.5 7.4 9.8A6 6 0 0 1 12 6.3c1.9 0 3.1.8 4 1.5l2.9-2.8A10.8 10.8 0 0 0 12 1C8.4 1 5.4 3 4.2 7.5Z"
                opacity=".15"
              />
            </svg>
            Continue with Google
          </button>

          <p className="mt-3 text-xs leading-5 text-slate-500">
            Or use email or mobile code login below.
          </p>

          {step === 'identity' ? (
            <form className="space-y-4" onSubmit={requestOtp}>
              <div className="grid grid-cols-2 gap-2 rounded-[1.25rem] bg-[#f7f7f3] p-1">
                <button
                  type="button"
                  onClick={() => setIdentifierMode('mobile')}
                  className={`rounded-[1rem] px-4 py-2 text-sm font-semibold transition ${
                    identifierMode === 'mobile'
                      ? 'bg-white text-slate-950 shadow-sm'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Mobile
                </button>
                <button
                  type="button"
                  onClick={() => setIdentifierMode('email')}
                  className={`rounded-[1rem] px-4 py-2 text-sm font-semibold transition ${
                    identifierMode === 'email'
                      ? 'bg-white text-slate-950 shadow-sm'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Email
                </button>
              </div>

              {!isLogin ? (
                <label className="block">
                  <span className="mb-2 block text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">
                    Full name
                  </span>
                  <div className="flex items-center gap-2 rounded-2xl border border-emerald-950/10 bg-[#f7f7f3] px-4 py-3">
                    <CircleUserRound className="h-4 w-4 text-emerald-700" />
                    <input
                      value={name}
                      onChange={(event) => setName(event.target.value)}
                      placeholder="Enter your name"
                      className="w-full bg-transparent text-sm outline-none placeholder:text-slate-500"
                    />
                  </div>
                </label>
              ) : null}

              <label className="block">
                <span className="mb-2 block text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">
                  {identifierLabel}
                </span>
                <div className="flex items-center gap-2 rounded-2xl border border-emerald-950/10 bg-[#f7f7f3] px-4 py-3">
                  {identifierMode === 'email' || identifier.includes('@') ? (
                    <Mail className="h-4 w-4 text-emerald-700" />
                  ) : (
                    <Phone className="h-4 w-4 text-emerald-700" />
                  )}
                  <input
                    value={identifier}
                    onChange={(event) => setIdentifier(event.target.value)}
                    inputMode={identifierInputMode}
                    autoComplete={identifierMode === 'email' ? 'email' : 'tel'}
                    placeholder={identifierPlaceholder}
                    className="w-full bg-transparent text-sm outline-none placeholder:text-slate-500"
                  />
                </div>
              </label>

              <button
                type="submit"
                disabled={loading}
                className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-full bg-emerald-950 px-5 text-sm font-semibold text-white transition hover:bg-emerald-900 disabled:cursor-not-allowed disabled:opacity-70"
              >
                Send code
                <ArrowRight className="h-4 w-4" />
              </button>
            </form>
          ) : (
            <form className="space-y-4" onSubmit={verifyOtp}>
              <div className="rounded-[1.25rem] border border-emerald-950/10 bg-[#f7f7f3] p-4 text-sm text-slate-600">
                Code sent to <span className="font-semibold text-slate-950">{maskedIdentifier}</span>
                {devOtp ? (
                  <div className="mt-3 rounded-2xl border border-emerald-950/10 bg-white px-4 py-3 text-sm text-emerald-900">
                    Dev code: <span className="font-semibold">{devOtp}</span>
                  </div>
                ) : null}
              </div>

              <label className="block">
                <span className="mb-2 block text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">
                  OTP code
                </span>
                <div className="flex items-center gap-2 rounded-2xl border border-emerald-950/10 bg-[#f7f7f3] px-4 py-3">
                  <ShieldCheck className="h-4 w-4 text-emerald-700" />
                  <input
                    inputMode="numeric"
                    value={otp}
                    onChange={(event) => setOtp(event.target.value)}
                    placeholder="Enter 6-digit code"
                    className="w-full bg-transparent text-sm outline-none placeholder:text-slate-500"
                  />
                </div>
              </label>

              <button
                type="submit"
                disabled={loading}
                className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-full bg-emerald-950 px-5 text-sm font-semibold text-white transition hover:bg-emerald-900 disabled:cursor-not-allowed disabled:opacity-70"
              >
                Verify & continue
                <ArrowRight className="h-4 w-4" />
              </button>

              <button
                type="button"
                onClick={() => setStep('identity')}
                className="inline-flex h-11 w-full items-center justify-center rounded-full border border-emerald-950/10 px-4 text-sm font-semibold text-slate-900"
              >
                Change email or mobile
              </button>
            </form>
          )}

          {message ? <p className="mt-4 rounded-2xl bg-emerald-50 px-4 py-3 text-sm text-emerald-900">{message}</p> : null}

          <div className="mt-4 rounded-[1.25rem] bg-[#f7f7f3] p-4">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-sm leading-6 text-slate-600">
                {isLogin
                  ? 'Enter your email or mobile number, receive a code, and sign in.'
                  : 'Create your account once and use the same login across devices.'}
              </p>
              <a
                href={isLogin ? '/register' : '/login'}
                className="inline-flex h-11 items-center justify-center rounded-full border border-emerald-950/10 bg-white px-4 text-sm font-semibold text-slate-900 transition hover:border-emerald-300"
              >
                {isLogin ? 'Create account' : 'Sign in'}
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
