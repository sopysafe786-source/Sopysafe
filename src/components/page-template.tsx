import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { AnimatedSection } from '@/components/animated-section'
import { PageChrome } from '@/components/site-shell'
import { cn } from '@/lib/utils'

type Props = {
  eyebrow: string
  title: string
  description: string
  sections: Array<{ title: string; body: string }>
  stats?: Array<{ label: string; value: string }>
  ctaHref?: string
  ctaLabel?: string
}

export function PageTemplate({
  eyebrow,
  title,
  description,
  sections,
  stats,
  ctaHref = '/shop',
  ctaLabel = 'Explore the Store',
}: Props) {
  return (
    <>
      <PageChrome eyebrow={eyebrow} title={title} description={description} />
      <section className="bg-[#f7f7f3]">
        <div className="mx-auto grid max-w-7xl gap-6 px-4 py-8 sm:px-6 sm:py-12 sm:gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:px-8">
          <AnimatedSection>
            <div className="grid gap-4 sm:gap-6">
              {sections.map((section) => (
                <article
                  key={section.title}
                  className="rounded-[1.5rem] sm:rounded-[2rem] border border-emerald-950/10 bg-white p-4 sm:p-6"
                >
                  <h2 className="text-base sm:text-lg font-semibold text-slate-950">{section.title}</h2>
                  <p className="mt-2 sm:mt-3 text-xs sm:text-sm leading-6 text-slate-600">{section.body}</p>
                </article>
              ))}
            </div>
          </AnimatedSection>
          <AnimatedSection delay={0.1}>
            <aside className="sticky top-28 space-y-4 rounded-[1.5rem] sm:rounded-[2rem] border border-emerald-950/10 bg-white p-4 sm:p-6">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.3em] text-emerald-700">
                  Quick links
                </p>
                <h2 className="mt-2 text-lg sm:text-2xl font-semibold text-slate-950">
                  Clean, marketplace-style shortcuts.
                </h2>
                <p className="mt-2 text-xs sm:text-sm leading-6 text-slate-600">
                  Keep the secondary pages simple, direct, and easy to scan.
                </p>
              </div>
              <div className="grid gap-2 sm:gap-3">
                {[
                  { href: '/shop', label: 'Browse shop' },
                  { href: '/search', label: 'Search catalog' },
                  { href: '/cart', label: 'Open cart' },
                  { href: '/orders', label: 'Track orders' },
                ].map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="rounded-xl sm:rounded-2xl bg-[#f7f7f3] px-3 sm:px-4 py-3 sm:py-4 text-xs sm:text-sm font-medium text-slate-700 transition hover:bg-emerald-50 hover:text-emerald-900"
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
              {stats ? (
                <div className="grid grid-cols-2 gap-2 sm:gap-3">
                  {stats.map((stat) => (
                    <div key={stat.label} className="rounded-xl sm:rounded-2xl border border-emerald-950/10 bg-[#f7f7f3] p-3 sm:p-4">
                      <div className="text-xs uppercase tracking-[0.28em] text-slate-500">
                        {stat.label}
                      </div>
                      <div className="mt-2 text-base sm:text-lg font-semibold text-slate-950">{stat.value}</div>
                    </div>
                  ))}
                </div>
              ) : null}
              <Link
                href={ctaHref}
                className={cn(
                  'inline-flex w-full items-center justify-center gap-2 rounded-full bg-emerald-950 px-4 sm:px-5 py-2 sm:py-3 text-xs sm:text-sm font-semibold text-white transition hover:bg-emerald-900',
                )}
              >
                {ctaLabel}
                <ArrowRight className="h-4 w-4" />
              </Link>
            </aside>
          </AnimatedSection>
        </div>
      </section>
    </>
  )
}
