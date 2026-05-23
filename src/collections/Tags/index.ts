import type { CollectionConfig } from 'payload'
import { slugField } from 'payload'

import {
  tagsCreate,
  tagsDelete,
  tagsRead,
  tagsUpdate,
} from '../../access/tagsAccess'
import { tagsAdminPanel, isTagsNavVisible } from '../../access/adminPanel'
import { assignRandomTagColor } from './hooks/assignRandomTagColor'
import { validateTagScopeAccess } from './hooks/validateTagScopeAccess'

const HEX_PATTERN = /^#[0-9A-Fa-f]{6}$/

export const Tags: CollectionConfig<'tags'> = {
  slug: 'tags',
  labels: {
    singular: 'Tag',
    plural: 'Tag',
  },
  access: {
    admin: tagsAdminPanel,
    create: tagsCreate,
    delete: tagsDelete,
    read: tagsRead,
    update: tagsUpdate,
  },
  admin: {
    hidden: ({ user }) => !isTagsNavVisible(user),
    useAsTitle: 'title',
    group: 'Contenuti',
    defaultColumns: ['title', 'color', 'slug', 'updatedAt'],
  },
  fields: [
    {
      name: 'scope',
      type: 'select',
      label: 'Ambito',
      defaultValue: 'events',
      required: true,
      options: [
        { label: 'Eventi', value: 'events' },
        { label: 'Giochi', value: 'games' },
      ],
      admin: {
        position: 'sidebar',
        description: 'I tag «Solo giochi» vengono creati automaticamente da BoardGameGeek.',
      },
    },
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
      required: false,
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
  hooks: {
    beforeChange: [assignRandomTagColor, validateTagScopeAccess],
  },
}
