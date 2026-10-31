import { image } from './images'
import type { Category, Collection, OlfactiveFamily } from './types'

export const categories: Category[] = [
  { slug: 'womens-fragrances', name: "Women's Fragrances", gender: 'her' },
  { slug: 'mens-fragrances', name: "Men's Fragrances", gender: 'him' },
]

// Order matches the shop filter sidebar
export const olfactiveFamilies: OlfactiveFamily[] = [
  { slug: 'aldehyde', name: 'Aldehyde' },
  { slug: 'amber', name: 'Amber' },
  { slug: 'chypre', name: 'Chypre' },
  { slug: 'floral', name: 'Floral' },
  { slug: 'fougere', name: 'Fougere' },
  { slug: 'fresh', name: 'Fresh' },
  { slug: 'leather', name: 'Leather' },
  { slug: 'spicy', name: 'Spicy' },
  { slug: 'woody', name: 'Woody' },
]

const opusEssenceImage = image('2025/11/prf-collection-opus-essence.jpg', 'Opus Essence collection')
const etheriaImage = image('2025/11/prf-collection-etheria.jpg', 'Étheria collection')

// Order matches the mega menu: for her first, then for him
export const collections: Collection[] = [
  {
    slug: 'etheria',
    name: 'Étheria',
    gender: 'her',
    summary:
      'A collection of delicate, weightless fragrances that capture the essence of air and light. Soft florals, sheer musks, and dewy accords.',
    description:
      'A collection of delicate, weightless fragrances that capture the essence of air and light. Soft florals, sheer musks, and dewy accords evoke a dreamlike, ethereal elegance.',
    image: etheriaImage,
  },
  {
    slug: 'celeste-aura',
    name: 'Celeste Aura',
    gender: 'her',
    summary: 'Radiant ambers and glowing florals inspired by the last light of a summer evening.',
    description:
      'A collection of radiant, sun-warmed fragrances inspired by the last light of a summer evening. Golden ambers, glowing florals, and soft woods leave a warm and luminous trail.',
    image: etheriaImage,
    dummy: true,
  },
  {
    slug: 'opus-essence',
    name: 'Opus Essence',
    gender: 'her',
    summary:
      'A collection of delicate, weightless fragrances that capture the essence of air and light. Soft florals, sheer musks, and dewy accords.',
    description:
      'A collection of delicate, weightless fragrances that capture the essence of air and light. Soft florals, sheer musks, and dewy accords evoke a dreamlike, ethereal elegance.',
    image: opusEssenceImage,
  },
  {
    slug: 'velours-noir',
    name: 'Velours Noir',
    gender: 'him',
    summary: 'Deep, velvety compositions of dark woods, smoked spices, and rich leather.',
    description:
      'A collection of deep, velvety compositions built on dark woods, smoked spices, and rich leather. Bold yet refined scents for evenings that call for presence.',
    image: image('2025/12/prf-latest-collections-banner-1-opt.jpg', 'Velours Noir collection'),
    dummy: true,
  },
  {
    slug: 'nocturne-essence',
    name: 'Nocturne Essence',
    gender: 'him',
    summary:
      'Fresh, luminous scents inspired by the mystery of nightfall. Crisp citruses, airy florals, and cool musks.',
    description:
      'A collection of fresh, luminous scents inspired by the mystery of nightfall. Crisp citruses, airy florals, and cool musks evoke the serenity of moonlit skies and midnight breezes.',
    image: image('2025/12/prf-latest-collections-banner-1-opt.jpg', 'Nocturne Essence collection'),
  },
  {
    slug: 'elysian-bloom',
    name: 'Elysian Bloom',
    gender: 'him',
    summary: 'Green, aromatic fragrances with crisp herbs, cool aquatic notes, and clean musks.',
    description:
      'A collection of green, aromatic fragrances inspired by open landscapes. Crisp herbs, cool aquatic notes, and clean musks create an effortless, refreshing signature.',
    image: image('2025/12/prf-latest-collections-banner-2-opt.jpg', 'Elysian Bloom collection'),
    dummy: true,
  },
]
