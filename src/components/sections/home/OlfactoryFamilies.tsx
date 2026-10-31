import { Button } from '@/components/ui/Button'
import { Heading } from '@/components/ui/Heading'
import type { OlfactiveFamily } from '@/data/types'

/** "Shop by Olfactory Family": a row of bordered buttons, scrolls sideways on small screens. */
export function OlfactoryFamilies({ families }: { families: OlfactiveFamily[] }) {
  return (
    <>
      <Heading className="mb-5 md:mb-[25px]" size="section">
        Shop by Olfactory Family
      </Heading>
      <ul className="scrollbar-none -mx-[15px] flex gap-2.5 overflow-x-auto px-[15px] lg:flex-wrap">
        {families.map((family) => (
          <li key={family.slug} className="flex-auto lg:flex-none">
            <Button
              className="w-full"
              href={`/olfactive-family/${family.slug}`}
              size="lg"
              variant="bordered"
            >
              {family.name}
            </Button>
          </li>
        ))}
      </ul>
    </>
  )
}
