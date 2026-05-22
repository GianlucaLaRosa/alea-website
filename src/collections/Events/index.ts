import type { CollectionConfig } from 'payload'
import { slugField } from 'payload'

import { adminOrEditor } from '../../access/adminOrEditor'
import { authenticatedOrPublishedNotHidden } from '../../access/authenticatedOrPublishedNotHidden'
import { eventDescriptionLexical } from '@/fields/defaultLexical'
import { generatePreviewPath } from '@/utilities/generatePreviewPath'
import { EVENT_STATUS_OPTIONS } from '@/utilities/eventStatus'
import { revalidateEvents, revalidateEventsDelete } from './hooks/revalidateEvents'
import { ensureEventDraftTitle } from './hooks/ensureEventDraftTitle'
import { ensureUniqueEventSlug } from './hooks/ensureUniqueEventSlug'
import { prepareNewEvent } from './hooks/prepareNewEvent'
import { syncEventSearchText } from './hooks/syncEventSearchText'
import { populatePublishedAt } from '../../hooks/populatePublishedAt'

import {
  MetaDescriptionField,
  MetaImageField,
  MetaTitleField,
  OverviewField,
  PreviewField,
} from '@payloadcms/plugin-seo/fields'

export const Events: CollectionConfig<'events'> = {
  slug: 'events',
  access: {
    create: adminOrEditor,
    delete: adminOrEditor,
    read: authenticatedOrPublishedNotHidden,
    update: adminOrEditor,
  },
  admin: {
    defaultColumns: ['title', 'status', 'startAt', 'featured', 'hidden', '_status', 'updatedAt'],
    description:
      'Gli eventi già pubblicati compaiono con filtro «Pubblicato» o «Tutti» in alto a destra (non solo «Bozza»).',
    useAsTitle: 'title',
    group: 'Contenuti',
    livePreview: {
      url: ({ data, req }) =>
        generatePreviewPath({
          slug: data?.slug,
          collection: 'events',
          req,
        }),
    },
    preview: (data, { req }) =>
      generatePreviewPath({
        slug: data?.slug as string,
        collection: 'events',
        req,
      }),
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
      localized: true,
      label: 'Titolo',
      admin: {
        description:
          'In bozza, se lasci vuoto viene impostato «Nuovo evento» al salvataggio. Lo slug è reso univoco automaticamente.',
      },
    },
    slugField({
      fieldToUse: 'title',
      /** Consente la creazione senza slug; viene generato in beforeValidate / beforeChange. */
      required: false,
    }),
    {
      name: 'hidden',
      type: 'checkbox',
      label: 'Nascondi',
      defaultValue: false,
      admin: {
        position: 'sidebar',
        description:
          'Se attivo, l’evento non compare nel carosello né nell’elenco /eventi (resta modificabile in admin).',
      },
    },
    {
      name: 'featured',
      type: 'checkbox',
      label: 'In evidenza',
      defaultValue: false,
      admin: {
        position: 'sidebar',
        description:
          'Ordine prioritario in homepage e in /eventi; in elenco mostra il badge «In evidenza» sulla card.',
      },
    },
    {
      name: 'status',
      type: 'select',
      label: 'Stato evento',
      defaultValue: 'scheduled',
      required: true,
      /** Distinto da `enum_events_status` usato da `_status` (bozze). */
      enumName: 'events_event_status',
      options: [...EVENT_STATUS_OPTIONS],
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'publishedAt',
      type: 'date',
      label: 'Data pubblicazione',
      admin: {
        position: 'sidebar',
        date: {
          pickerAppearance: 'dayAndTime',
        },
      },
    },
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Contenuto',
          fields: [
            {
              name: 'coverImage',
              type: 'upload',
              relationTo: 'media',
              required: true,
              label: 'Immagine di copertina',
              admin: {
                description: 'Usata nel carosello, nella modale e nella pagina dell’evento.',
              },
            },
            {
              name: 'gallery',
              type: 'upload',
              relationTo: 'media',
              hasMany: true,
              label: 'Galleria',
              admin: {
                description:
                  'Immagini aggiuntive mostrate come miniature in modale e pagina evento.',
              },
            },
            {
              name: 'tags',
              type: 'relationship',
              relationTo: 'tags',
              hasMany: true,
              label: 'Tag',
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
              localized: true,
              label: 'Indirizzo',
            },
            {
              type: 'row',
              fields: [
                {
                  name: 'latitude',
                  type: 'number',
                  label: 'Latitudine',
                  admin: {
                    step: 0.000001,
                    description: 'Opzionale. Usata per la mappa se presente.',
                  },
                },
                {
                  name: 'longitude',
                  type: 'number',
                  label: 'Longitudine',
                  admin: {
                    step: 0.000001,
                  },
                },
              ],
            },
            {
              name: 'description',
              type: 'richText',
              localized: true,
              label: 'Descrizione',
              editor: eventDescriptionLexical,
              admin: {
                description:
                  'Paragrafi, titoli (H2–H4), liste, citazioni, grassetto/corsivo/sottolineato/barrato, codice inline, link, separatore.',
              },
            },
            {
              name: 'searchText',
              type: 'text',
              localized: true,
              index: true,
              label: 'Testo ricerca',
              admin: {
                readOnly: true,
                hidden: true,
                description:
                  'Generato automaticamente da titolo, luogo, tag e descrizione (ricerca su /eventi).',
              },
            },
            {
              name: 'ticketUrl',
              type: 'text',
              label: 'URL biglietti',
              admin: {
                description: 'Link esterno per prenotazione o acquisto biglietti.',
              },
            },
            {
              name: 'ticketLabel',
              type: 'text',
              localized: true,
              label: 'Testo pulsante biglietti',
              defaultValue: 'Prenota',
            },
            {
              name: 'links',
              type: 'array',
              localized: true,
              label: 'Altri link',
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
        },
        {
          name: 'meta',
          label: 'SEO',
          fields: [
            OverviewField({
              titlePath: 'meta.title',
              descriptionPath: 'meta.description',
              imagePath: 'meta.image',
            }),
            MetaTitleField({
              hasGenerateFn: true,
              overrides: { localized: true },
            }),
            MetaImageField({
              relationTo: 'media',
              overrides: { localized: true },
            }),
            MetaDescriptionField({
              overrides: { localized: true },
            }),
            PreviewField({
              hasGenerateFn: true,
              titlePath: 'meta.title',
              descriptionPath: 'meta.description',
            }),
          ],
        },
      ],
    },
  ],
  hooks: {
    beforeValidate: [prepareNewEvent],
    beforeChange: [
      populatePublishedAt,
      ensureEventDraftTitle,
      ensureUniqueEventSlug,
      syncEventSearchText,
    ],
    afterChange: [revalidateEvents],
    afterDelete: [revalidateEventsDelete],
  },
  versions: {
    drafts: {
      autosave: {
        interval: 100,
      },
      schedulePublish: true,
      validate: false,
    },
    maxPerDoc: 50,
  },
}
