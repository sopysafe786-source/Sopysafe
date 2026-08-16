'use client'

import type { ReactNode } from 'react'
import { usePathname } from 'next/navigation'
import { ShieldCheck } from 'lucide-react'
import { SiteShell } from '@/components/site-shell'

export function AppShell({ children }: { children: ReactNode }) {
  const pathname = usePathname()

  if (pathname?.startsWith('/admin')) {
    return (
      <div className="min-h-screen bg-[#eef2ee] text-slate-900">
        <header className="border-b border-emerald-950/10 bg-white">
          <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:py-4 sm:px-6 lg:px-8">
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-emerald-700">SopySafe Admin</p>
              <h1 className="mt-1 text-lg sm:text-xl font-semibold text-slate-950">Business control center</h1>
            </div>
            <div className="inline-flex items-center gap-2 rounded-full bg-emerald-950 px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-semibold text-white whitespace-nowrap">
              <ShieldCheck className="h-3 w-3 sm:h-4 sm:w-4" />
              <span className="hidden sm:inline">Secure admin</span>
              <span className="sm:hidden">Secure</span>
            </div>
          </div>
        </header>
        <main>{children}</main>
      </div>
    )
  }

  return <SiteShell>{children}</SiteShell>
}
