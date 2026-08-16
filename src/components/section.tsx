import { cn } from '@/lib/utils'

export function SectionHeading({
  eyebrow,
  title,
  description,
  className,
}: {
  eyebrow: string
  title: string
  description: string
  className?: string
}) {
  return (
    <div className={cn('max-w-3xl', className)}>
      <p className="text-xs sm:text-sm font-semibold uppercase tracking-[0.3em] text-emerald-700">
        {eyebrow}
      </p>
      <h2 className="mt-2 sm:mt-3 text-xl sm:text-2xl lg:text-3xl font-semibold tracking-tight text-slate-950">
        {title}
      </h2>
      <p className="mt-2 sm:mt-4 text-xs sm:text-sm lg:text-base leading-6 sm:leading-7 text-slate-600">{description}</p>
    </div>
  )
}
