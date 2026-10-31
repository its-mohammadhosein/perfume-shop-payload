'use client'

import { useId, useState } from 'react'

import { Button } from '@/components/ui/Button'

const field =
  'h-[42px] w-full border border-line bg-transparent px-[15px] text-sm outline-none transition-colors duration-500 focus:border-line-focus'
const label = 'mb-[5px] block font-semibold text-gray-800'
const required = (
  <span aria-hidden="true" className="text-base leading-none text-[#e01020]">
    *
  </span>
)

/** "Leave a Reply" form. Static UI: submitting only shows a thank-you note. */
export function CommentForm() {
  const id = useId()
  const [sent, setSent] = useState(false)

  return (
    <div>
      <h3 className="mb-5 text-[26px] leading-[1.2] lg:text-[38px]" id={`${id}-title`}>
        Leave a Reply
      </h3>
      {sent ? (
        <p role="status">Thank you! Your comment is awaiting moderation.</p>
      ) : (
        <form
          aria-labelledby={`${id}-title`}
          className="-mx-2.5 flex flex-wrap"
          onSubmit={(e) => {
            e.preventDefault()
            setSent(true)
          }}
        >
          <p className="mb-5 basis-full px-2.5">
            Your email address will not be published. Required fields are marked {required}
          </p>
          <p className="mb-[15px] basis-full px-2.5">
            <label className={label} htmlFor={`${id}-comment`}>
              Comment {required}
            </label>
            <textarea
              className={`${field} h-auto min-h-[190px] resize-y py-2.5`}
              id={`${id}-comment`}
              maxLength={65525}
              required
              rows={8}
            />
          </p>
          <p className="mb-[15px] flex-[1_1_max(400px,50%)] px-2.5">
            <label className={label} htmlFor={`${id}-name`}>
              Name {required}
            </label>
            <input autoComplete="name" className={field} id={`${id}-name`} required type="text" />
          </p>
          <p className="mb-[15px] flex-[1_1_max(400px,50%)] px-2.5">
            <label className={label} htmlFor={`${id}-email`}>
              Email {required}
            </label>
            <input
              autoComplete="email"
              className={field}
              id={`${id}-email`}
              required
              type="email"
            />
          </p>
          <p className="mb-[15px] basis-full px-2.5">
            <label className={label} htmlFor={`${id}-url`}>
              Website
            </label>
            <input autoComplete="url" className={field} id={`${id}-url`} type="url" />
          </p>
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
        </form>
      )}
    </div>
  )
}
