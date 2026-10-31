import type { Metadata } from 'next'
import { notFound } from 'next/navigation'

import { Accordion } from '@/components/ui/Accordion'
import { Button } from '@/components/ui/Button'
import { Container } from '@/components/ui/Container'
import { Field } from '@/components/ui/Field'
import { PageTitle } from '@/components/ui/PageTitle'
import { StaticForm } from '@/components/ui/StaticForm'
import { faq, getInfoPage, infoPages } from '@/data'
import type { InfoPage } from '@/data/types'

type Props = { params: Promise<{ slug: string }> }

export function generateStaticParams() {
  return infoPages.map((p) => ({ slug: p.slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const page = getInfoPage((await params).slug)
  return page ? { title: page.title, description: page.intro } : {}
}

function Sections({ page }: { page: InfoPage }) {
  return page.sections.map((section) => (
    <section key={section.heading} className="mt-10">
      <h2 className="mb-5 text-[1.6em] leading-[1.4]">{section.heading}</h2>
      {section.paragraphs.map((text) => (
        <p key={text} className="mb-5 last:mb-0">
          {text}
        </p>
      ))}
    </section>
  ))
}

function ContactForm() {
  return (
    <StaticForm
      aria-label="Contact form"
      className="bg-muted p-[30px]"
      sentMessage="Thank you for your message. We will get back to you within one business day."
    >
      <h2 className="mb-5 text-[1.6em] leading-[1.4]">Send us a message</h2>
      <Field autoComplete="name" label="Your name" required />
      <Field autoComplete="email" label="Your email" required type="email" />
      <Field label="Subject" />
      <Field label="Your message" required textarea />
      <Button size="md" type="submit">
        Send message
      </Button>
    </StaticForm>
  )
}

/** One text-page template for contact, FAQ, refund, cookies, terms and privacy (DUMMY copy). */
export default async function InfoPageRoute({ params }: Props) {
  // Any other top-level URL lands here too: notFound() renders the site's styled 404
  const page = getInfoPage((await params).slug)
  if (!page) notFound()

  return (
    <>
      <PageTitle>{page.title}</PageTitle>
      <Container className="pb-10">
        {page.slug === 'contact-us' ? (
          <div className="grid items-start gap-10 lg:grid-cols-2 lg:gap-[30px]">
            <div>
              <p className="text-base md:text-lg lg:text-xl">{page.intro}</p>
              <Sections page={page} />
            </div>
            <ContactForm />
          </div>
        ) : (
          <div className="max-w-(--container-post)">
            <p className="text-base md:text-lg lg:text-xl">{page.intro}</p>
            {page.slug === 'faq' ? (
              <Accordion
                className="mt-10"
                items={faq.map((f) => ({ title: f.question, content: <p>{f.answer}</p> }))}
              />
            ) : (
              <Sections page={page} />
            )}
          </div>
        )}
      </Container>
    </>
  )
}
