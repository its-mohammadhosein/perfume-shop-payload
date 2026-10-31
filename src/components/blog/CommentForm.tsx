import { useId } from 'react'

import { Button } from '@/components/ui/Button'
import { Field, Required } from '@/components/ui/Field'
import { StaticForm } from '@/components/ui/StaticForm'

/** "Leave a Reply" form. Static UI: submitting only shows a thank-you note. */
export function CommentForm() {
  const id = useId()

  return (
    <div>
      <h3 className="mb-5 text-[26px] leading-[1.2] lg:text-[38px]" id={`${id}-title`}>
        Leave a Reply
      </h3>
      <StaticForm
        aria-labelledby={`${id}-title`}
        className="-mx-2.5 flex flex-wrap"
        sentMessage="Thank you! Your comment is awaiting moderation."
      >
        <p className="mb-5 basis-full px-2.5">
          Your email address will not be published. Required fields are marked <Required />
        </p>
        <Field className="basis-full px-2.5" label="Comment" maxLength={65525} required textarea />
        <Field
          autoComplete="name"
          className="flex-[1_1_max(400px,50%)] px-2.5"
          label="Name"
          required
        />
        <Field
          autoComplete="email"
          className="flex-[1_1_max(400px,50%)] px-2.5"
          label="Email"
          required
          type="email"
        />
        <Field autoComplete="url" className="basis-full px-2.5" label="Website" type="url" />
        <p className="mb-[15px] basis-full px-2.5">
          <input className="mr-[5px] align-middle" id={`${id}-consent`} type="checkbox" />
          <label className="inline" htmlFor={`${id}-consent`}>
            Save my name, email, and website in this browser for the next time I comment.
          </label>
        </p>
        <p className="mt-[5px] basis-full px-2.5">
          <Button size="md" type="submit">
            Post Comment
          </Button>
        </p>
      </StaticForm>
    </div>
  )
}
