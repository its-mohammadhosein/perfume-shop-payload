import { cva, type VariantProps } from 'class-variance-authority'
import Link from 'next/link'
import React from 'react'

import { cn } from '@/utilities/ui'

// Button system from DESIGN.md §6
const buttonVariants = cva(
  'relative inline-flex cursor-pointer items-center justify-center gap-[5px] border-solid py-[5px] text-center font-semibold leading-[1.2] capitalize no-underline transition-all duration-250 disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        primary: 'bg-primary text-white hover:bg-primary-hover hover:text-white',
        black:
          'bg-ink text-white hover:text-white hover:shadow-[inset_0_0_0_1000px_rgb(0_0_0/10%)]',
        white: 'border border-white/50 bg-white text-title hover:border-white hover:bg-white-hover hover:text-title',
        bordered: 'border-2 border-[#e9e9e9] bg-transparent text-title hover:border-ink hover:bg-ink hover:text-white',
        outline: 'border border-primary bg-transparent text-primary hover:bg-primary hover:text-white',
        link: 'border-0 border-b-2 border-current bg-transparent text-title hover:text-body',
        default: 'bg-muted text-title hover:bg-muted-hover hover:text-title',
      },
      size: {
        sm: 'min-h-9 px-3.5 text-xs',
        md: 'min-h-[42px] px-5 text-[13px]',
        lg: 'min-h-12 px-7 text-sm',
        xl: 'min-h-14 px-10 text-base',
      },
      fullWidth: {
        true: 'w-full',
      },
    },
    compoundVariants: [{ variant: 'link', className: 'min-h-0 px-0 py-0' }],
    defaultVariants: {
      variant: 'primary',
      size: 'lg',
    },
  },
)

type ButtonVariantProps = VariantProps<typeof buttonVariants>

type ButtonAsButton = ButtonVariantProps &
  React.ButtonHTMLAttributes<HTMLButtonElement> & {
    href?: undefined
  }

type ButtonAsLink = ButtonVariantProps &
  Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, 'href'> & {
    href: string
  }

export type ButtonProps = ButtonAsButton | ButtonAsLink

export function Button(props: ButtonProps) {
  if (props.href !== undefined) {
    const { className, variant, size, fullWidth, href, ...rest } = props
    return <Link className={cn(buttonVariants({ variant, size, fullWidth }), className)} href={href} {...rest} />
  }

  const { className, variant, size, fullWidth, type = 'button', ...rest } = props
  return <button className={cn(buttonVariants({ variant, size, fullWidth }), className)} type={type} {...rest} />
}

export { buttonVariants }
