import type { CollectionConfig } from 'payload'

import { anyone } from '../access/anyone'
import { adminOnly } from '../access/adminOnly'
import { slugField } from 'payload'

export const Categories: CollectionConfig = {
  slug: 'categories',
  access: {
    create: adminOnly,
    delete: adminOnly,
    read: anyone,
    update: adminOnly,
  },
  admin: {
    useAsTitle: 'title',
    hidden: ({ user }) => !user?.roles?.includes('admin'),
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    slugField({
      position: undefined,
    }),
  ],
}
