import Image from 'next/image'
import { cn } from '@/lib/utils'

export function Logo({
  className,
  variant = 'header',
}: {
  className?: string
  variant?: 'header' | 'footer'
}) {
  if (variant === 'footer') {
    return (
      <Image
        src="/sopysafe-logo.png"
        alt="SopySafe logo"
        width={960}
        height={960}
        priority
        className={cn('h-auto w-full max-w-[200px] sm:max-w-[280px] object-contain', className)}
      />
    )
  }

  return (
    <div className={cn('inline-flex items-center gap-2 sm:gap-3', className)}>
      <Image src="/brand-mark.svg" alt="SopySafe" width={44} height={44} className="h-9 w-9 sm:h-11 sm:w-11" />
      <span className="flex flex-col leading-none">
        <span className="text-base sm:text-lg font-semibold tracking-[0.02em] text-slate-950">SopySafe</span>
      </span>
    </div>
  )
}
