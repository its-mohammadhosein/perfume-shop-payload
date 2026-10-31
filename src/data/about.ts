import { file, image } from './images'
import type { FaqItem, InfoCard } from './types'

export const aboutIntro = {
  title: 'Welcome to WoodMart Fragrances',
  image: image('2025/11/prf-about-us-1.jpg', 'WoodMart Fragrances perfumery'),
  text: 'At WoodMart Fragrances, we believe that scent is more than just an aroma—it’s an experience. Inspired by the richness of nature, we craft sophisticated fragrances that bring warmth, elegance, and personality to every moment. Our carefully curated collections blend the finest natural ingredients, creating timeless scents that leave a lasting impression.',
}

export const aboutStory = {
  title: 'Our Story',
  text: 'The journey of WoodMart Fragrances began in a small family workshop in Provence, France. Founded by master perfumer Louis Beaumont in 1987, our brand was born from a passion for nature’s raw beauty and the art of perfumery. Inspired by the rich scents of wood, earth, and blooming florals, Louis spent years perfecting his craft, blending rare ingredients to create signature fragrances. What started as a modest venture quickly grew into an internationally recognized brand, known for its commitment to quality, sustainability, and innovation. Today, WoodMart Fragrances continues this legacy, offering exquisite scents that transport you to a world of timeless elegance.',
  image: image('2025/11/prf-about-us-2-min.jpg', 'Perfume bottles'),
}

// Answers are copied as-is from the html base (they don't match the questions there either)
export const faq: FaqItem[] = [
  {
    question: 'What makes WoodMart fragrances unique?',
    answer:
      'Keep the product in its original packaging along with all documents confirming the purchase and refund. You will need this for further communication with the seller and the payment system.',
  },
  {
    question: 'Are your products cruelty-free?',
    answer:
      'Check the email you received after placing your order. It should contain information about the status of your order and the expected delivery date.',
  },
  {
    question: 'How long do your fragrances last?',
    answer:
      'If the contents of the parcel are suspicious to customs officers (for example, many identical goods), it may be further checked.',
  },
  {
    question: 'Do you offer sample sizes?',
    answer:
      'Keep the product in its original packaging along with all documents confirming the purchase and refund. You will need this for further communication with the seller and the payment system.',
  },
  {
    question: 'How should I store my perfume?',
    answer:
      'If the contents of the parcel are suspicious to customs officers (for example, many identical goods), it may be further checked.',
  },
]

export const whyChoose: { title: string; cards: InfoCard[] } = {
  title: 'Why Choose WoodMart?',
  cards: [
    {
      title: 'Natural Ingredients',
      text: 'We use responsibly sourced, high-quality natural ingredients for an authentic experience.',
      icon: file('2025/11/prf-infobox-1.svg'),
    },
    {
      title: 'Artisanal Craftsmanship',
      text: 'Each fragrance is carefully developed by expert perfumers with a deep passion for artistry.',
      icon: file('2025/11/prf-infobox-2.svg'),
    },
    {
      title: 'Sustainable & Ethical',
      text: 'We are committed to sustainability, using eco-friendly packaging and ingredients.',
      icon: file('2025/11/prf-infobox-3.svg'),
    },
    {
      title: 'Luxury Experience',
      text: 'From elegant bottles to exquisite scents, every fragrance is designed to offer a journey.',
      icon: file('2025/11/prf-infobox-4.svg'),
    },
  ],
}
