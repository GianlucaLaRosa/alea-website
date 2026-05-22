import type { CollectionConfig } from 'payload'

import { anyone } from '../access/anyone'
import { adminOrEditor } from '../access/adminOrEditor'
import { slugField } from 'payload'

export const Categories: CollectionConfig = {
  slug: 'categories',
  access: {
    create: adminOrEditor,
    delete: adminOrEditor,
    read: anyone,
    update: adminOrEditor,
  },
  admin: {
    useAsTitle: 'title',
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
