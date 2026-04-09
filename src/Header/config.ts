import type { GlobalConfig } from 'payload'

import { link } from '@/fields/link'
import { revalidateHeader } from './hooks/revalidateHeader'

export const Header: GlobalConfig = {
  slug: 'header',
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'logo',
      type: 'upload',
      relationTo: 'media',
      label: 'Logo image',
      admin: {
        description: 'Shown in the header next to the navigation. If empty, the default logo is used.',
      },
    },
    {
      name: 'navItems',
      type: 'array',
      fields: [
        link({
          appearances: false,
        }),
        {
          name: 'referenceAnchor',
          type: 'text',
          label: 'Section anchor',
          admin: {
            description:
              'For internal links only: HTML id of the target section on the page (without #).',
            condition: (_, siblingData) => siblingData?.link?.type === 'reference',
          },
        },
      ],
      maxRows: 12,
      admin: {
        initCollapsed: true,
        components: {
          RowLabel: '@/Header/RowLabel#RowLabel',
        },
      },
    },
  ],
  hooks: {
    afterChange: [revalidateHeader],
  },
}
