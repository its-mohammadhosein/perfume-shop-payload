import type { Metadata } from 'next'

import { Marquee } from '@/components/sections/Marquee'
import { Button } from '@/components/ui/Button'
import { Container } from '@/components/ui/Container'
import { Heading } from '@/components/ui/Heading'
import { Heart, ICON_STROKE, Search, ShoppingBag } from '@/components/ui/Icon'
import { Price } from '@/components/ui/Price'
import { Section } from '@/components/ui/Section'

// Development playground for UI primitives. Removed in Phase 10.
export const metadata: Metadata = { title: 'UI playground', robots: { index: false } }

const variants = ['primary', 'black', 'white', 'bordered', 'outline', 'link', 'default'] as const
const sizes = ['sm', 'md', 'lg', 'xl'] as const
const headings = ['display', 'feature', 'hero', 'section', 'page', 'statement'] as const

const colors = [
  'primary',
  'primary-hover',
  'heading',
  'title',
  'body',
  'footer',
  'ink',
  'band',
  'muted',
  'arrow',
  'success',
  'warning',
]

export default function UIPlayground() {
  return (
    <div className="py-16">
      <Container>
        <Section spacing="block">
          <Heading size="section" className="mb-6">
            Colors
          </Heading>
          <div className="flex flex-wrap gap-4">
            {colors.map((c) => (
              <div key={c} className="w-28 text-sm">
                <div className="mb-2 h-16 border border-line" style={{ background: `var(--color-${c})` }} />
                {c}
              </div>
            ))}
          </div>
        </Section>

        <Section spacing="block">
          <Heading size="section" className="mb-6">
            Headings
          </Heading>
          {headings.map((h) => (
            <Heading key={h} size={h} className="mb-4">
              {h}: Light Fragrance with a Silky Touch
            </Heading>
          ))}
          <p className="text-lead">Lead text. Radiant blend of citrus, florals, and warm musks.</p>
          <p>
            Body text. At WoodMart Fragrances, we believe that scent is more than just an aroma. It is an
            experience.
          </p>
        </Section>

        <Section spacing="block">
          <Heading size="section" className="mb-6">
            Buttons
          </Heading>
          {variants.map((v) => (
            <div key={v} className={v === 'white' ? 'mb-4 flex flex-wrap items-center gap-4 bg-footer p-4' : 'mb-4 flex flex-wrap items-center gap-4'}>
              {sizes.map((s) => (
                <Button key={s} variant={v} size={s}>
                  {v} {s}
                </Button>
              ))}
            </div>
          ))}
          <Button href="/shop" variant="primary">
            Link button
          </Button>
        </Section>

        <Section spacing="block">
          <Heading size="section" className="mb-6">
            Price and icons
          </Heading>
          <div className="flex items-center gap-8">
            <Price amount={250} />
            <Price amount={200} regular={250} />
            <Search strokeWidth={ICON_STROKE} />
            <Heart strokeWidth={ICON_STROKE} />
            <ShoppingBag strokeWidth={ICON_STROKE} />
          </div>
        </Section>
      </Container>

      <Section spacing="block">
        <Marquee items={['Ethereal', 'Sensory', 'Signature']} />
      </Section>
    </div>
  )
}
