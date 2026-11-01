import type { CollectionConfig } from 'payload'

import { slugField } from 'payload'

import { anyone } from '../access/anyone'
import { authenticated } from '../access/authenticated'
import { revalidateSite, revalidateSiteOnDelete } from '../hooks/revalidateSite'

/** Product collections (Étheria, Nocturne Essence…), shown in the mega menu, shop filters and archives. */
export const FragranceCollections: CollectionConfig = {
  slug: 'fragrance-collections',
  labels: {
    singular: 'Fragrance Collection',
    plural: 'Fragrance Collections',
  },
  // Drag-and-drop order in the admin; menus and filters follow it
  orderable: true,
  access: {
    create: authenticated,
    delete: authenticated,
    read: anyone,
    update: authenticated,
  },
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'gender', 'slug', 'updatedAt'],
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
    },
    {
      name: 'gender',
      type: 'select',
      required: true,
      options: [
        { label: 'For Her', value: 'her' },
        { label: 'For Him', value: 'him' },
      ],
    },
    {
      name: 'summary',
      type: 'textarea',
      required: true,
      admin: {
        description: 'Short text for the mega menu card.',
      },
    },
    {
      name: 'description',
      type: 'textarea',
      required: true,
      admin: {
        description: 'Shown on the collection page and the Fragrances overview.',
      },
    },
    {
      name: 'image',
      type: 'upload',
      relationTo: 'media',
      required: true,
    },
    {
      name: 'placeholder',
      type: 'checkbox',
      label: 'Placeholder content',
      admin: {
        position: 'sidebar',
        description: 'Copy or image is not from the original design yet and should be replaced.',
      },
    },
    slugField({ useAsSlug: 'name' }),
  ],
  hooks: {
    afterChange: [revalidateSite],
    afterDelete: [revalidateSiteOnDelete],
  },
}
