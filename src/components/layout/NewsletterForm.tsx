'use client'

import { useId, useState } from 'react'

import { Button } from '@/components/ui/Button'

/** Newsletter signup UI only; nothing is sent until the Mailchimp integration exists. */
export function NewsletterForm() {
  const id = useId()
  const [sent, setSent] = useState(false)

  if (sent) return <p className="max-w-[373px] text-white">Thank you for subscribing!</p>

  return (
    <form
      className="flex max-w-[373px] gap-2.5"
      onSubmit={(e) => {
        e.preventDefault()
        setSent(true)
      }}
    >
      <label className="sr-only" htmlFor={id}>
        Your email address
      </label>
      <input
        className="h-[42px] min-w-0 flex-1 border border-white/25 bg-transparent px-4 text-sm text-white placeholder:text-white/60 focus:border-white"
        id={id}
        placeholder="Your email address"
        required
        type="email"
      />
      <Button className="shrink-0" size="md" type="submit" variant="white">
        Sign up
      </Button>
    </form>
  )
}
