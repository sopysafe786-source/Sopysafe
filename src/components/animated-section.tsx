'use client'

import type { ReactNode } from 'react'

export function AnimatedSection({
  children,
  delay = 0,
}: {
  children: ReactNode
  delay?: number
}) {
  void delay
  return <div>{children}</div>
}
