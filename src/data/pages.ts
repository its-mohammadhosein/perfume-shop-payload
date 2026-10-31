// DUMMY content for pages that are linked from the html base but were never mirrored
import type { InfoPage } from './types'

const lorem = {
  short:
    'We want every order to feel as considered as the fragrances themselves. This page explains how we handle it, what you can expect from us, and how to reach our team if anything is unclear.',
  long: 'Our customer care team is available Monday to Friday, 9:00–18:00 CET. We aim to answer every message within one business day. For faster help, include your order number and the email address used at checkout.',
}

export const infoPages: InfoPage[] = [
  {
    slug: 'contact-us',
    title: 'Contact Us',
    intro:
      'Questions about a fragrance, an order, or a collaboration? We would love to hear from you.',
    sections: [
      {
        heading: 'Customer Care',
        paragraphs: [lorem.long, 'Email: hello@example.com · Phone: +33 1 23 45 67 89'],
      },
      {
        heading: 'Our Atelier',
        paragraphs: ['12 Rue des Parfumeurs, 06130 Grasse, France', 'Visits by appointment only.'],
      },
    ],
    dummy: true,
  },
  {
    slug: 'faq',
    title: 'F.A.Q.',
    intro: 'Answers to the questions we hear most often.',
    sections: [],
    dummy: true,
  },
  {
    slug: 'refund',
    title: 'Refund Policy',
    intro: lorem.short,
    sections: [
      {
        heading: 'Returns',
        paragraphs: [
          'Unopened products can be returned within 30 days of delivery. Keep the product in its original packaging along with all documents confirming the purchase.',
        ],
      },
      {
        heading: 'Refunds',
        paragraphs: [
          'Refunds are issued to the original payment method within 5–10 business days after we receive the return.',
        ],
      },
    ],
    dummy: true,
  },
  {
    slug: 'cookies',
    title: 'Cookie Policy',
    intro: lorem.short,
    sections: [
      {
        heading: 'How we use cookies',
        paragraphs: [
          'We use essential cookies to keep the site working and optional cookies to understand how it is used.',
        ],
      },
    ],
    dummy: true,
  },
  {
    slug: 'terms',
    title: 'Terms of Use',
    intro: lorem.short,
    sections: [
      {
        heading: 'Using this website',
        paragraphs: [
          'By using this website you agree to these terms. Content is provided for information and may change without notice.',
        ],
      },
    ],
    dummy: true,
  },
  {
    slug: 'privacy',
    title: 'Privacy Policy',
    intro: lorem.short,
    sections: [
      {
        heading: 'Your data',
        paragraphs: [
          'We collect only the information needed to process your order and never sell personal data to third parties.',
        ],
      },
    ],
    dummy: true,
  },
]

export function getInfoPage(slug: string): InfoPage | undefined {
  return infoPages.find((p) => p.slug === slug)
}

/** DUMMY order shown on the checkout page */
export const checkoutOrder = {
  items: [
    { slug: 'abyss-bleu', quantity: 1 },
    { slug: 'amber-bloom-50ml', quantity: 2 },
  ],
  shipping: 0,
  dummy: true,
}
