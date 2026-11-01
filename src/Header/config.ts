import type { Field, GlobalConfig } from 'payload'

import { revalidateSiteGlobal } from '@/hooks/revalidateSite'

// The site's pages are Next routes, not Payload pages, so menu links are plain paths
const labelAndUrl = (urlDescription = 'A site path like /shop, or a full URL.'): Field => ({
  type: 'row',
  fields: [
    { name: 'label', type: 'text', required: true, admin: { width: '50%' } },
    {
      name: 'url',
      type: 'text',
      required: true,
      admin: { width: '50%', description: urlDescription },
    },
  ],
})

export const Header: GlobalConfig = {
  slug: 'header',
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'navItems',
      type: 'array',
      maxRows: 6,
      admin: {
        initCollapsed: true,
        description:
          'Main menu. The mobile menu shows the same items plus Home, Contact us, Wishlist, Compare and Login.',
        components: {
          RowLabel: '@/Header/RowLabel#RowLabel',
        },
      },
      fields: [
        labelAndUrl(),
        {
          name: 'hasMegaMenu',
          type: 'checkbox',
          label: 'Show mega menu',
        },
        {
          name: 'megaMenu',
          type: 'group',
          admin: {
            condition: (_, siblingData) => Boolean(siblingData?.hasMegaMenu),
          },
          fields: [
            {
              name: 'columns',
              type: 'array',
              maxRows: 4,
              admin: {
                description:
                  'Column titles are also the sub-items of this entry in the mobile menu.',
              },
              fields: [
                labelAndUrl('Where the column title links to.'),
                {
                  name: 'source',
                  type: 'select',
                  required: true,
                  defaultValue: 'custom',
                  options: [
                    { label: 'Collections for Her (automatic)', value: 'her' },
                    { label: 'Collections for Him (automatic)', value: 'him' },
                    { label: 'All collections (automatic)', value: 'all' },
                    { label: 'Custom links', value: 'custom' },
                  ],
                  admin: {
                    description:
                      'Automatic columns list the Fragrance Collections in their admin order.',
                  },
                },
                {
                  name: 'links',
                  type: 'array',
                  admin: {
                    condition: (_, siblingData) => siblingData?.source === 'custom',
                  },
                  fields: [labelAndUrl()],
                },
              ],
            },
            {
              name: 'featured',
              type: 'group',
              label: 'Picture card',
              admin: {
                description:
                  'Shows the chosen collection’s image, name and summary, linking to it. Fill in the fields below only to override them.',
              },
              fields: [
                {
                  name: 'collection',
                  type: 'relationship',
                  relationTo: 'fragrance-collections',
                },
                { name: 'title', type: 'text' },
                { name: 'text', type: 'textarea' },
                { name: 'image', type: 'upload', relationTo: 'media' },
              ],
            },
          ],
        },
      ],
    },
  ],
  hooks: {
    afterChange: [revalidateSiteGlobal],
  },
}
