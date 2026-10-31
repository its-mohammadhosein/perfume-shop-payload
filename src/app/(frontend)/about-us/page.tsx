import type { Metadata } from 'next'
import Image from 'next/image'

import { InstagramStrip } from '@/components/sections/InstagramStrip'
import { Marquee } from '@/components/sections/Marquee'
import { Accordion } from '@/components/ui/Accordion'
import { Container } from '@/components/ui/Container'
import { Heading } from '@/components/ui/Heading'
import { Section } from '@/components/ui/Section'
import { aboutIntro, aboutStory, faq, instagram, marqueeWords, whyChoose } from '@/data'
import { pageMetadata } from '@/utilities/pageMetadata'

export const metadata: Metadata = pageMetadata({
  title: 'About Us',
  description: aboutIntro.text,
  path: '/about-us',
  image: aboutIntro.image,
})

export default function AboutPage() {
  return (
    <Container className="pt-10 pb-10">
      {/* Intro */}
      <Heading as="h1" className="mb-5 text-[32px] md:text-[54px] lg:text-[62px]" size="none">
        {aboutIntro.title}
      </Heading>
      <Image
        alt={aboutIntro.image.alt}
        className="mb-5 h-auto w-full"
        height={aboutIntro.image.height}
        priority
        sizes="(min-width: 1430px) 1400px, 100vw"
        src={aboutIntro.image.src}
        width={aboutIntro.image.width}
      />
      <p className="mb-section text-base md:text-lg lg:text-xl">{aboutIntro.text}</p>

      <Section>
        <Marquee items={marqueeWords} />
      </Section>

      {/* Our Story + FAQ | image (image first below 1025px) */}
      <Section className="flex flex-col gap-[30px] lg:flex-row">
        <div className="order-1 flex min-w-px flex-1 flex-col gap-5 lg:order-none">
          <Heading size="section">{aboutStory.title}</Heading>
          <p>{aboutStory.text}</p>
          <Accordion items={faq.map((f) => ({ title: f.question, content: <p>{f.answer}</p> }))} />
        </div>
        <div className="relative min-h-[205px] min-w-px flex-1 md:min-h-[444px]">
          <Image
            alt={aboutStory.image.alt}
            className="object-cover"
            fill
            sizes="(min-width: 1025px) 50vw, 100vw"
            src={aboutStory.image.src}
          />
        </div>
      </Section>

      {/* Why Choose WoodMart? */}
      <Heading className="mb-10" size="section">
        {whyChoose.title}
      </Heading>
      <Section className="grid gap-[30px] md:grid-cols-2 lg:grid-cols-4">
        {whyChoose.cards.map((card) => (
          <div key={card.title} className="flex flex-col items-start gap-[15px]">
            {/* eslint-disable-next-line @next/next/no-img-element -- small decorative SVG */}
            <img alt="" className="size-6" src={card.icon.src} />
            <div className="flex flex-col gap-2.5">
              <h2 className="text-[1.2em] leading-[1.4]">{card.title}</h2>
              <p>{card.text}</p>
            </div>
          </div>
        ))}
      </Section>

      <InstagramStrip {...instagram} />
    </Container>
  )
}
