'use client'

import Image from 'next/image'
import { useEffect, useMemo, useState, type PointerEvent } from 'react'
import { ChevronLeft, ChevronRight, Maximize2, ScanSearch } from 'lucide-react'
import { cn } from '@/lib/utils'

export function ProductGallery({
  title,
  images,
  image,
}: {
  title: string
  images?: string[]
  image?: string
}) {
  const galleryImages = useMemo(() => {
    const list = images?.length ? images : image ? [image] : []
    return list.length ? list : ['/products/aurora-headphones.svg']
  }, [image, images])

  const [active, setActive] = useState(0)
  const [dragOffset, setDragOffset] = useState(0)
  const [dragging, setDragging] = useState(false)
  const [dragStartX, setDragStartX] = useState<number | null>(null)

  useEffect(() => {
    setActive((current) => Math.min(current, galleryImages.length - 1))
  }, [galleryImages.length])

  const activeImage = galleryImages[active] ?? galleryImages[0]
  const total = galleryImages.length

  const goTo = (index: number) => {
    if (!total) return
    const next = (index + total) % total
    setActive(next)
  }

  const goPrev = () => goTo(active - 1)
  const goNext = () => goTo(active + 1)

  const handlePointerDown = (event: PointerEvent<HTMLDivElement>) => {
    if (total <= 1) return
    setDragging(true)
    setDragStartX(event.clientX)
    event.currentTarget.setPointerCapture(event.pointerId)
  }

  const handlePointerMove = (event: PointerEvent<HTMLDivElement>) => {
    if (!dragging || dragStartX === null || total <= 1) return
    setDragOffset(event.clientX - dragStartX)
  }

  const finishDrag = () => {
    if (!dragging) return

    const threshold = 40
    if (dragOffset > threshold) {
      goPrev()
    } else if (dragOffset < -threshold) {
      goNext()
    }

    setDragging(false)
    setDragStartX(null)
    setDragOffset(0)
  }

  return (
    <div className="grid gap-3 sm:gap-4">
      <div className="rounded-[1.5rem] sm:rounded-[2rem] border border-emerald-950/10 bg-white p-3 sm:p-4 shadow-[0_10px_24px_rgba(15,23,42,0.04)]">
        <div className="flex items-center justify-between gap-2 text-xs sm:text-sm text-slate-500">
          <span className="inline-flex items-center gap-2">
            <ScanSearch className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-emerald-700" />
            Product preview
          </span>
          <span className="inline-flex items-center gap-2">
            <Maximize2 className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-emerald-700" />
            Swipe to browse
          </span>
        </div>

        <div className="relative mt-3 sm:mt-4 overflow-hidden rounded-[1.25rem] border border-emerald-950/10 bg-[#f7f7f3] p-3 sm:p-5 md:min-h-[26rem]">
          <div
            className={cn(
              'relative mx-auto grid min-h-[16rem] place-items-center md:min-h-[22rem]',
              dragging ? 'cursor-grabbing' : 'cursor-grab',
            )}
            style={{ touchAction: 'pan-y' }}
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={finishDrag}
            onPointerCancel={finishDrag}
            onPointerLeave={finishDrag}
            onKeyDown={(event) => {
              if (event.key === 'ArrowLeft') {
                event.preventDefault()
                goPrev()
              }
              if (event.key === 'ArrowRight') {
                event.preventDefault()
                goNext()
              }
            }}
            tabIndex={0}
            aria-label={`${title} image gallery`}
          >
            <div
              className="absolute inset-0 flex items-center transition-transform duration-300 ease-out"
              style={{
                transform: `translateX(calc(${-active * 100}% + ${dragOffset}px))`,
              }}
            >
              {galleryImages.map((src, index) => (
                <div key={`${src}-${index}`} className="relative h-full min-w-full px-1 sm:px-2">
                  <div className="relative mx-auto aspect-square w-full max-w-[15rem] overflow-hidden rounded-[1.5rem] bg-white p-2 shadow-[0_12px_30px_rgba(15,23,42,0.06)] sm:max-w-[20rem] sm:p-3 md:max-w-[24rem]">
                    <Image
                      src={src}
                      alt={`${title} ${index + 1}`}
                      fill
                      className="object-contain p-2 sm:p-3 md:p-4"
                      sizes="(max-width: 640px) 92vw, (max-width: 1024px) 88vw, 40vw"
                      priority={index === 0}
                    />
                  </div>
                </div>
              ))}
            </div>

            {total > 1 && (
              <>
                <button
                  type="button"
                  onClick={goPrev}
                  aria-label="Previous image"
                  className="absolute left-2 top-1/2 z-10 -translate-y-1/2 rounded-full border border-emerald-950/10 bg-white/95 p-2 text-slate-800 shadow-sm transition hover:border-emerald-300"
                >
                  <ChevronLeft className="h-4 w-4 sm:h-5 sm:w-5" />
                </button>
                <button
                  type="button"
                  onClick={goNext}
                  aria-label="Next image"
                  className="absolute right-2 top-1/2 z-10 -translate-y-1/2 rounded-full border border-emerald-950/10 bg-white/95 p-2 text-slate-800 shadow-sm transition hover:border-emerald-300"
                >
                  <ChevronRight className="h-4 w-4 sm:h-5 sm:w-5" />
                </button>
              </>
            )}
          </div>
        </div>

        <div className="mt-3 flex items-center justify-between text-[11px] sm:text-xs text-slate-500">
          <span>
            Image {active + 1} of {total}
          </span>
          {total > 1 && <span>Use arrows or swipe on mobile</span>}
        </div>
      </div>

      <div className="grid grid-cols-4 gap-2 sm:gap-3">
        {galleryImages.slice(0, 4).map((src, index) => (
          <button
            key={`${src}-${index}`}
            type="button"
            onClick={() => goTo(index)}
            className={cn(
              'relative aspect-square overflow-hidden rounded-lg border bg-white transition',
              active === index
                ? 'border-emerald-700 ring-2 ring-emerald-300'
                : 'border-emerald-950/10 hover:border-emerald-700/40',
            )}
          >
            <Image src={src} alt={`${title} ${index + 1}`} fill className="object-contain p-2 sm:p-3" sizes="120px" />
          </button>
        ))}
      </div>
    </div>
  )
}
