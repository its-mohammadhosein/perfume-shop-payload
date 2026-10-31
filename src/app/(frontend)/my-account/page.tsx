import type { Metadata } from 'next'
import Link from 'next/link'

import { Button } from '@/components/ui/Button'
import { Container } from '@/components/ui/Container'
import { Field } from '@/components/ui/Field'
import { PageTitle } from '@/components/ui/PageTitle'
import { StaticForm } from '@/components/ui/StaticForm'

export const metadata: Metadata = { title: 'My account' }

const formTitle = 'mb-5 text-[22px] leading-[1.4] uppercase'

/** Static login / register forms (WoodMart "my account" side-by-side layout). */
export default function MyAccountPage() {
  return (
    <>
      <PageTitle>My account</PageTitle>
      <Container className="py-10">
        <div className="mx-auto grid max-w-(--container-post) gap-10 md:grid-cols-2 md:gap-0">
          <section aria-labelledby="login-title" className="md:border-r md:border-line md:pr-10">
            <h2 className={formTitle} id="login-title">
              Login
            </h2>
            <StaticForm
              aria-labelledby="login-title"
              sentMessage="Accounts are not available in this demo."
            >
              <Field autoComplete="username" label="Username or email address" required />
              <Field autoComplete="current-password" label="Password" required type="password" />
              <Button className="mb-[15px]" fullWidth size="md" type="submit">
                Log in
              </Button>
              <div className="flex flex-wrap items-center justify-between gap-2.5 text-sm">
                <label className="flex cursor-pointer items-center gap-[5px]">
                  <input type="checkbox" /> Remember me
                </label>
                <Link href="/my-account">Lost your password?</Link>
              </div>
            </StaticForm>
          </section>

          <section aria-labelledby="register-title" className="md:pl-10">
            <h2 className={formTitle} id="register-title">
              Register
            </h2>
            <StaticForm
              aria-labelledby="register-title"
              sentMessage="Accounts are not available in this demo."
            >
              <Field autoComplete="email" label="Email address" required type="email" />
              <p className="mb-[15px] text-sm">
                A link to set a new password will be sent to your email address.
              </p>
              <p className="mb-5 text-sm">
                Your personal data will be used to support your experience throughout this website,
                to manage access to your account, and for other purposes described in our{' '}
                <Link className="font-semibold" href="/privacy">
                  privacy policy
                </Link>
                .
              </p>
              <Button fullWidth size="md" type="submit">
                Register
              </Button>
            </StaticForm>
          </section>
        </div>
      </Container>
    </>
  )
}
