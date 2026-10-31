import { file, image } from './images'
import { collections } from './taxonomies'
import type { MegaMenuColumn, MobileNavItem, NavItem, NavLink, SocialLink } from './types'

const collectionLink = (slug: string): NavLink => {
  const c = collections.find((col) => col.slug === slug)!
  return { label: c.name, href: `/collection/${c.slug}` }
}

const herCollections = collections
  .filter((c) => c.gender === 'her')
  .map((c) => collectionLink(c.slug))
const himCollections = collections
  .filter((c) => c.gender === 'him')
  .map((c) => collectionLink(c.slug))

// Category links point at archives instead of WooCommerce query filters
const megaMenuColumns: MegaMenuColumn[] = [
  {
    title: { label: 'Collections for Her', href: '/shop?category=womens-fragrances' },
    links: herCollections,
  },
  {
    title: { label: 'Collections for Him', href: '/shop?category=mens-fragrances' },
    links: himCollections,
  },
  {
    title: { label: 'All Collections', href: '/shop' },
    links: [...herCollections, ...himCollections],
  },
]

const featured = collections.find((c) => c.slug === 'opus-essence')!

export const mainNav: NavItem[] = [
  { label: 'New', href: '/shop' },
  {
    label: 'Fragrances',
    href: '/fragrances',
    megaMenu: {
      columns: megaMenuColumns,
      featured: {
        title: featured.name,
        text: featured.summary,
        href: `/collection/${featured.slug}`,
        image: featured.image,
      },
    },
  },
  { label: 'Journal', href: '/journal' },
  { label: 'About Us', href: '/about-us' },
]

export const mobileNav: MobileNavItem[] = [
  { label: 'Home', href: '/' },
  { label: 'New', href: '/shop' },
  {
    label: 'Fragrances',
    href: '/fragrances',
    children: megaMenuColumns.map((col) => col.title),
  },
  { label: 'Journal', href: '/journal' },
  { label: 'About us', href: '/about-us' },
  { label: 'Contact us', href: '/contact-us' },
  { label: 'Wishlist', href: '/wishlist', icon: 'wishlist' },
  { label: 'Compare', href: '/compare', icon: 'compare' },
  { label: 'Login / Register', href: '/my-account', icon: 'account' },
]

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
