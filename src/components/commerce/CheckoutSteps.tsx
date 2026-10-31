import Link from 'next/link'

import { WdIcon } from '@/components/ui/Icon'
import { cn } from '@/utilities/ui'

const steps = [
  { key: 'cart', label: 'Shopping cart', href: '/cart' },
  { key: 'checkout', label: 'Checkout', href: '/checkout' },
  { key: 'complete', label: 'Order complete' },
] as const

/**
 * "Shopping cart → Checkout → Order complete" in place of the page title (28px). The current
 * step is underlined; the others are dimmed, and hidden at ≤768px.
 */
export function CheckoutSteps({ current }: { current: 'cart' | 'checkout' }) {
  return (
    <ol className="flex flex-wrap gap-x-[15px] gap-y-2.5 text-[28px] leading-[1.4] font-medium text-heading">
      {steps.map((step, i) => {
        const active = step.key === current
        const label = (
          <span
            className={cn(
              active
                ? 'underline decoration-primary decoration-2 underline-offset-[6px]'
                : 'opacity-70',
            )}
          >
            {step.label}
          </span>
        )
        return (
          <li
            key={step.key}
            aria-current={active ? 'step' : undefined}
            className={cn('items-center gap-[15px]', active ? 'flex' : 'hidden md:flex')}
          >
            {'href' in step && !active ? (
              <Link
                className="text-heading hover:text-heading [&>span]:hover:opacity-100"
                href={step.href}
              >
                {label}
              </Link>
            ) : (
              label
            )}
            {i < steps.length - 1 && (
              <WdIcon className="hidden size-[0.85em] opacity-70 md:block" name="arrowRight" />
            )}
          </li>
        )
      })}
    </ol>
  )
}
