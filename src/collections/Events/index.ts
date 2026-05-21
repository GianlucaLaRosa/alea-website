import type { CollectionConfig } from 'payload'

import { anyone } from '../../access/anyone'
import { authenticated } from '../../access/authenticated'
import { defaultLexical } from '@/fields/defaultLexical'
import { revalidateEvents, revalidateEventsDelete } from './hooks/revalidateEvents'

export const Events: CollectionConfig<'events'> = {
  slug: 'events',
  access: {
    create: authenticated,
    delete: authenticated,
    read: anyone,
    update: authenticated,
  },
  admin: {
    defaultColumns: ['title', 'startAt', 'endAt', 'updatedAt'],
    useAsTitle: 'title',
    group: 'Contenuti',
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
      label: 'Titolo',
    },
    {
      name: 'image',
      type: 'upload',
      relationTo: 'media',
      required: true,
      label: 'Immagine',
    },
    {
      name: 'startAt',
      type: 'date',
      required: true,
      label: 'Inizio',
      admin: {
        date: {
          pickerAppearance: 'dayAndTime',
        },
        description:
          'Data e ora di inizio. Per un evento senza orario specifico, imposta la mezzanotte (00:00).',
      },
    },
    {
      name: 'endAt',
      type: 'date',
      required: true,
      label: 'Fine',
      admin: {
        date: {
          pickerAppearance: 'dayAndTime',
        },
        description:
          'Data e ora di fine. Per un evento senza orario specifico, imposta la mezzanotte (00:00) o l’orario di chiusura desiderato.',
      },
    },
    {
      name: 'address',
      type: 'text',
      label: 'Indirizzo',
    },
    {
      name: 'description',
      type: 'richText',
      label: 'Descrizione',
      editor: defaultLexical,
    },
    {
      name: 'links',
      type: 'array',
      label: 'Link',
      labels: {
        singular: 'Link',
        plural: 'Link',
      },
      fields: [
        {
          name: 'label',
          type: 'text',
          required: true,
          label: 'Etichetta',
        },
        {
          name: 'url',
          type: 'text',
          required: true,
          label: 'URL',
        },
      ],
    },
  ],
  hooks: {
    afterChange: [revalidateEvents],
    afterDelete: [revalidateEventsDelete],
  },
}
