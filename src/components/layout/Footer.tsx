import Image from 'next/image'
import Link from 'next/link'

import { Container } from '@/components/ui/Container'
import { footerColumns, footerContent, logos, socialLinks } from '@/data'

import { NewsletterForm } from './NewsletterForm'
import { SocialIcons } from './SocialIcons'

export function Footer() {
  const { statement, newsletter, copyright, paymentMethods } = footerContent

  return (
    <footer className="bg-footer text-white">
      <Container>
        {/* Logo + brand statement (50 / 50 from 769px, as in the source) */}
        <div className="mb-10 grid gap-6 pt-10 md:mb-[60px] md:pt-[60px] md:grid-cols-2 md:gap-[30px] lg:mb-20 lg:pt-20">
          <Link aria-label="Perfumes home" className="self-start" href="/">
            <Image
              alt=""
              className="h-auto w-[276px]"
              height={30}
              src={logos.white.src}
              unoptimized
              width={276}
            />
          </Link>
          <p className="max-w-[594px] text-base leading-[1.6] font-medium text-white md:text-xl md:leading-[1.2] lg:text-[30px]">
            {statement}
          </p>
        </div>

        {/* Newsletter (50%) + two link columns (25% each) */}
        <div className="mb-10 grid grid-cols-2 gap-x-[30px] gap-y-10 md:mb-[60px] md:grid-cols-[2fr_1fr_1fr] lg:mb-20">
          <div className="order-3 col-span-2 md:order-none md:col-span-1">
            <h2 className="mb-4 text-statement text-white">{newsletter.title}</h2>
            <p className="mb-6 max-w-[373px] text-white/80">{newsletter.text}</p>
            <NewsletterForm />
            <SocialIcons className="mt-6" links={socialLinks} />
          </div>
          {footerColumns.map((links, i) => (
            <ul key={i} className="space-y-3">
              {links.map((link) => (
                <li key={link.href}>
                  <Link
                    className="text-base font-medium text-white hover:text-white/80 md:text-lg"
                    href={link.href}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="flex flex-wrap items-center justify-between gap-y-4 border-t-2 border-white py-5">
          <p className="text-base text-white/80 md:text-lg">{copyright}</p>
          <Image
            alt={paymentMethods.alt}
            className="h-auto w-full max-w-[350px]"
            height={paymentMethods.height}
            src={paymentMethods.src}
            width={paymentMethods.width}
          />
        </div>
      </Container>
    </footer>
  )
}
