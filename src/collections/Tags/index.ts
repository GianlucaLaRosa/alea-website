import type { CollectionConfig } from 'payload'
import { slugField } from 'payload'

import { anyone } from '../../access/anyone'
import { adminOrEditor } from '../../access/adminOrEditor'

const HEX_PATTERN = /^#[0-9A-Fa-f]{6}$/

export const Tags: CollectionConfig<'tags'> = {
  slug: 'tags',
  labels: {
    singular: 'Tag',
    plural: 'Tag',
  },
  access: {
    create: adminOrEditor,
    delete: adminOrEditor,
    read: anyone,
    update: adminOrEditor,
  },
  admin: {
    useAsTitle: 'title',
    group: 'Contenuti',
    defaultColumns: ['title', 'color', 'slug', 'updatedAt'],
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
      localized: true,
      label: 'Nome',
    },
    {
      name: 'color',
      type: 'text',
      required: true,
      defaultValue: '#6366f1',
      label: 'Colore',
      admin: {
        description: 'Colore mostrato sul sito per questo tag.',
        components: {
          Field: '@/components/fields/ColorField#ColorField',
        },
      },
      validate: (value: string | null | undefined) => {
        if (!value || !HEX_PATTERN.test(value.trim().toLowerCase())) {
          return 'Inserisci un colore esadecimale valido (es. #ff5733)'
        }
        return true
      },
    },
    slugField({
      position: undefined,
    }),
  ],
}
