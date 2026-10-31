import React, { useId } from 'react'

import { cn } from '@/utilities/ui'

/** WoodMart form control: 42px high, 1px border, 14px text, square corners. */
export const fieldClass =
  'h-[42px] w-full border border-line bg-transparent px-[15px] text-sm outline-none transition-colors duration-500 focus:border-line-focus'

export const labelClass = 'mb-[5px] block font-semibold text-gray-800'

export function Required() {
  return (
    <span aria-hidden="true" className="text-base leading-none text-[#e01020]">
      *
    </span>
  )
}

type FieldProps = {
  label: string
  required?: boolean
  /** Wrapper classes (width, spacing). Defaults to the WoodMart 15px row spacing. */
  className?: string
} & (
  | ({ textarea?: false } & React.InputHTMLAttributes<HTMLInputElement>)
  | ({ textarea: true } & React.TextareaHTMLAttributes<HTMLTextAreaElement>)
)

/** Label above a text input or textarea; required fields get a red asterisk. */
export function Field({ label, required, className, textarea, ...props }: FieldProps) {
  const id = useId()
  return (
    <p className={cn('mb-[15px]', className)}>
      <label className={labelClass} htmlFor={id}>
        {label} {required && <Required />}
      </label>
      {textarea ? (
        <textarea
          className={cn(fieldClass, 'h-auto min-h-[190px] resize-y py-2.5')}
          id={id}
          required={required}
          rows={8}
          {...(props as React.TextareaHTMLAttributes<HTMLTextAreaElement>)}
        />
      ) : (
        <input
          className={fieldClass}
          id={id}
          required={required}
          type="text"
          {...(props as React.InputHTMLAttributes<HTMLInputElement>)}
        />
      )}
    </p>
  )
}
