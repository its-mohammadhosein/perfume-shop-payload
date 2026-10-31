import React from 'react'

import { cn } from '@/utilities/ui'

type SectionProps = React.HTMLAttributes<HTMLElement> & {
  /** Bottom spacing: section = 60/80/120, block = 40/60/80 */
  spacing?: 'section' | 'block' | 'none'
}

export function Section({ className, spacing = 'section', ...props }: SectionProps) {
  return (
    <section
      className={cn(spacing === 'section' && 'mb-section', spacing === 'block' && 'mb-block', className)}
      {...props}
    />
  )
}
