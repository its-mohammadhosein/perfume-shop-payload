'use client'

import React, { useState } from 'react'

type StaticFormProps = React.FormHTMLAttributes<HTMLFormElement> & {
  /** Shown in place of the form after a (browser-validated) submit */
  sentMessage: React.ReactNode
}

/** A form with no backend: submitting only swaps the form for a confirmation message. */
export function StaticForm({ sentMessage, children, ...props }: StaticFormProps) {
  const [sent, setSent] = useState(false)
  if (sent) return <p role="status">{sentMessage}</p>
  return (
    <form
      {...props}
      onSubmit={(e) => {
        e.preventDefault()
        setSent(true)
      }}
    >
      {children}
    </form>
  )
}
