import { file, image } from './images'
import type { NavLink, SocialLink } from './types'

// The main and mobile menus come from the Header global (src/shop/map.ts); seeded by src/seed

export const footerColumns: NavLink[][] = [
  [
    { label: 'About Us', href: '/about-us' },
    { label: 'Contact Us', href: '/contact-us' },
    { label: 'F.A.Q.', href: '/faq' },
    { label: 'Blog', href: '/journal' },
  ],
  [
    { label: 'Refund', href: '/refund' },
    { label: 'Cookies', href: '/cookies' },
    { label: 'Terms of use', href: '/terms' },
    { label: 'Privacy', href: '/privacy' },
  ],
]

export const socialLinks: SocialLink[] = [
  { network: 'facebook', href: 'https://www.facebook.com/xtemos.studio' },
  { network: 'x', href: 'https://x.com/xtemos_studio' },
  { network: 'instagram', href: 'https://www.instagram.com/xtemos.studio/' },
  { network: 'youtube', href: 'https://www.youtube.com/channel/UCu3loFwqqOQ9z-YTcnplK8w' },
]

export const footerContent = {
  statement:
    'At WoodMart Perfumery, we see perfume as more than just a scent — it is identity, memory and emotion captured in a bottle.',
  newsletter: {
    title: 'Insider Access',
    text: 'Receive exclusive content and be the first to know about product launches and special announcements.',
  },
  copyright: 'WoodMart © 2026 created by Xtemos Studio.',
  paymentMethods: image('2025/11/ps-mtds.png', 'Accepted payment methods'),
}

export const logos = {
  white: file('2025/11/prf-logotype-white.svg'),
  black: file('2025/11/prf-logotype-black.svg'),
}
