import { cn } from '@/utilities/ui'

const formatter = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' })

export function formatPrice(amount: number) {
  return formatter.format(amount)
}

type PriceProps = {
  amount: number
  /** Original price, shown struck through when on sale */
  regular?: number
  className?: string
}

export function Price({ amount, regular, className }: PriceProps) {
  return (
    <span
      className={cn(
        'inline-flex items-baseline gap-2 text-base leading-none font-medium text-title',
        className,
      )}
    >
      {regular !== undefined && regular > amount && (
        <del className="text-sm font-normal text-body">{formatPrice(regular)}</del>
      )}
      <span>{formatPrice(amount)}</span>
    </span>
  )
}
