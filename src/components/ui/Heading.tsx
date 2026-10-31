import React from 'react'

import { cn } from '@/utilities/ui'

const sizes = {
  display: 'text-display',
  feature: 'text-feature',
  hero: 'text-hero',
  section: 'text-section',
  page: 'text-page',
  statement: 'text-statement',
  widget: 'text-lg md:text-xl',
  none: '',
} as const

type HeadingProps = React.HTMLAttributes<HTMLHeadingElement> & {
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'
  size?: keyof typeof sizes
}

export function Heading({ as: Tag = 'h2', size = 'section', className, ...props }: HeadingProps) {
  return <Tag className={cn(sizes[size], className)} {...props} />
}
