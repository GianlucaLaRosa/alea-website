import type { CollectionConfig } from 'payload'

import {
  FixedToolbarFeature,
  InlineToolbarFeature,
  lexicalEditor,
} from '@payloadcms/richtext-lexical'
import path from 'path'
import { fileURLToPath } from 'url'

import {
  mediaCreate,
  mediaDelete,
  mediaRead,
  mediaUpdate,
} from '../access/mediaAccess'
import { isAdminNavVisible, isMediaNavVisible, mediaAdminPanel } from '../access/adminPanel'
import { assignMediaScopeAndFolder } from './Media/hooks/assignMediaScopeAndFolder'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export const Media: CollectionConfig = {
  slug: 'media',
  folders: true,
  access: {
    admin: mediaAdminPanel,
    create: mediaCreate,
    delete: mediaDelete,
    read: mediaRead,
    update: mediaUpdate,
  },
  admin: {
    group: 'Contenuti',
    hidden: ({ user }) => !isMediaNavVisible(user),
  },
  fields: [
    {
      name: 'scope',
      type: 'select',
      required: true,
      defaultValue: 'system',
      label: 'Ambito',
      options: [
        { label: 'Sistema', value: 'system' },
        { label: 'Giochi', value: 'games' },
        { label: 'Eventi', value: 'events' },
        { label: 'GDR', value: 'gdr' },
        { label: 'WarGame', value: 'wargame' },
      ],
      admin: {
        position: 'sidebar',
        description: 'Determina cartella e permessi. GDR/WarGame riservati a usi futuri.',
      },
      access: {
        update: ({ req: { user } }) => isAdminNavVisible(user),
      },
    },
    {
      name: 'alt',
      type: 'text',
    },
    {
      name: 'caption',
      type: 'richText',
      editor: lexicalEditor({
        features: ({ rootFeatures }) => {
          return [...rootFeatures, FixedToolbarFeature(), InlineToolbarFeature()]
        },
      }),
    },
  ],
  hooks: {
    beforeChange: [assignMediaScopeAndFolder],
  },
  upload: {
    staticDir: path.resolve(dirname, '../../public/media'),
    adminThumbnail: 'thumbnail',
    focalPoint: true,
    imageSizes: [
      {
        name: 'thumbnail',
        width: 300,
      },
      {
        name: 'square',
        width: 500,
        height: 500,
      },
      {
        name: 'small',
        width: 600,
      },
      {
        name: 'medium',
        width: 900,
      },
      {
        name: 'large',
        width: 1400,
      },
      {
        name: 'xlarge',
        width: 1920,
      },
      {
        name: 'og',
        width: 1200,
        height: 630,
        crop: 'center',
      },
    ],
  },
}
