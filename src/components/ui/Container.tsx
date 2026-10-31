import React from 'react'

import { cn } from '@/utilities/ui'

type ContainerProps = React.HTMLAttributes<HTMLDivElement> & {
  /** Narrower content width (journal posts: 1000px) */
  width?: 'default' | 'post'
}

export function Container({ className, width = 'default', ...props }: ContainerProps) {
  return (
    <div className={cn('container-wd', width === 'post' && 'max-w-(--container-post)', className)} {...props} />
  )
}
