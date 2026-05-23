import type { CollectionConfig, Validate } from 'payload'
import { slugField } from 'payload'

import type { Game } from '@/payload-types'
import { canManageGames } from '../../access/canManageGames'
import { gamesAdminPanel, isGamesNavVisible } from '../../access/adminPanel'
import { anyone } from '../../access/anyone'
import { fetchBggEndpoint } from './endpoints/fetchBgg'
import { revalidateGames, revalidateGamesDelete } from './hooks/revalidateGames'
import { syncGameTags } from './hooks/syncGameTags'

function hasUploadValue(value: unknown): boolean {
  if (value === null || value === undefined || value === '') return false
  if (typeof value === 'number') return true
  if (typeof value === 'object' && value !== null && 'id' in value) return true
  return false
}

function requiredGameNumber(label: string): Validate<number | null | undefined, Game> {
  return (value) => {
    if (value === null || value === undefined || value < 1) {
      return `${label} obbligatorio.`
    }
    return true
  }
}

export const Games: CollectionConfig<'games'> = {
  slug: 'games',
  labels: {
    singular: 'Gioco',
    plural: 'Giochi',
  },
  access: {
    admin: gamesAdminPanel,
    create: canManageGames,
    delete: canManageGames,
    read: anyone,
    update: canManageGames,
  },
  admin: {
    useAsTitle: 'title',
    hidden: ({ user }) => !isGamesNavVisible(user),
    group: 'Contenuti',
    defaultColumns: ['title', 'minPlayers', 'maxPlayers', 'updatedAt'],
    description:
      'Importa da BoardGameGeek con l’URL oppure compila il form manualmente. I tag categoria/meccanica vengono creati automaticamente.',
  },
  endpoints: [fetchBggEndpoint],
  fields: [
    {
      type: 'ui',
      name: 'bggImport',
      admin: {
        components: {
          Field: '@/components/admin/GameBggImport#GameBggImport',
        },
      },
    },
    {
      name: 'bggId',
      type: 'number',
      required: true,
      unique: true,
      index: true,
      label: 'ID BoardGameGeek',
      admin: {
        hidden: true,
        description: 'Impostato dall’import BGG; usato per evitare duplicati.',
      },
    },
    {
      name: 'bggUrl',
      type: 'text',
      label: 'URL BoardGameGeek',
      admin: {
        readOnly: true,
        description: 'Compilato dall’import BGG (sola lettura).',
      },
    },
    {
      name: 'title',
      type: 'text',
      required: true,
      localized: true,
      label: 'Titolo',
    },
    slugField({
      fieldToUse: 'title',
    }),
    {
      name: 'importWarnings',
      type: 'json',
      label: 'Avvisi import BGG',
      admin: {
        hidden: true,
        readOnly: true,
      },
    },
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Contenuto',
          fields: [
            {
              name: 'shortDescription',
              type: 'textarea',
              localized: true,
              label: 'Descrizione breve',
              admin: {
                description: 'Mostrata sulle card in elenco.',
              },
            },
            {
              name: 'description',
              type: 'textarea',
              localized: true,
              label: 'Descrizione',
              admin: {
                description: 'Testo completo nella pagina del gioco (senza HTML).',
              },
            },
            {
              type: 'row',
              fields: [
                {
                  name: 'minPlayers',
                  type: 'number',
                  min: 0,
                  label: 'Giocatori (min)',
                  validate: requiredGameNumber('Giocatori (min)'),
                },
                {
                  name: 'maxPlayers',
                  type: 'number',
                  min: 0,
                  label: 'Giocatori (max)',
                  validate: requiredGameNumber('Giocatori (max)'),
                },
              ],
            },
            {
              type: 'row',
              fields: [
                {
                  name: 'minPlayTime',
                  type: 'number',
                  min: 0,
                  label: 'Durata (min) min',
                  admin: {
                    description: 'Minuti.',
                  },
                  validate: requiredGameNumber('Durata minima'),
                },
                {
                  name: 'maxPlayTime',
                  type: 'number',
                  min: 0,
                  label: 'Durata (min) max',
                  admin: {
                    description: 'Minuti.',
                  },
                  validate: requiredGameNumber('Durata massima'),
                },
              ],
            },
            {
              name: 'tags',
              type: 'relationship',
              relationTo: 'tags',
              hasMany: true,
              label: 'Tag',
              filterOptions: {
                scope: { equals: 'games' },
              },
            },
            {
              name: 'bggTaxonomy',
              type: 'array',
              label: 'Tassonomia BGG (temporanea)',
              admin: {
                hidden: true,
                readOnly: true,
              },
              fields: [
                {
                  name: 'name',
                  type: 'text',
                  required: true,
                },
              ],
            },
            {
              name: 'expansions',
              type: 'array',
              label: 'Espansioni',
              labels: {
                singular: 'Espansione',
                plural: 'Espansioni',
              },
              admin: {
                description:
                  'Elenco da BGG. Spunta «Posseduta» per le espansioni in collezione. Puoi aggiungere righe manualmente.',
              },
              fields: [
                {
                  name: 'name',
                  type: 'text',
                  required: true,
                  label: 'Nome',
                },
                {
                  name: 'bggId',
                  type: 'number',
                  label: 'ID BGG',
                },
                {
                  name: 'owned',
                  type: 'checkbox',
                  label: 'Posseduta',
                  defaultValue: false,
                },
              ],
            },
          ],
        },
        {
          label: 'Immagini',
          fields: [
            {
              name: 'cardImage',
              type: 'upload',
              relationTo: 'media',
              label: 'Immagine card',
              admin: {
                description:
                  'Copertina in elenco. Dall’import BGG viene caricata subito; puoi sostituirla con un upload.',
              },
              validate: (val: unknown) => {
                if (hasUploadValue(val)) return true
                return 'Immagine card obbligatoria.'
              },
            },
            {
              name: 'detailImage',
              type: 'upload',
              relationTo: 'media',
              label: 'Immagine dettaglio',
              admin: {
                description: 'Accanto a titolo e tag in scheda (desktop) o sopra (mobile).',
              },
            },
            {
              name: 'heroImage',
              type: 'upload',
              relationTo: 'media',
              label: 'Immagine aggiuntiva',
              admin: {
                description: 'Mostrata nel testo della descrizione (testo attorno su desktop).',
              },
            },
          ],
        },
      ],
    },
  ],
  hooks: {
    beforeChange: [syncGameTags],
    afterChange: [revalidateGames],
    afterDelete: [revalidateGamesDelete],
  },
}
