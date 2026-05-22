import type { GlobalConfig } from 'payload'

import { ALL_LOCALE_CODES, ALL_LOCALES } from '@/config/localization'
import { adminOrEditor } from '@/access/adminOrEditor'
import { revalidateSiteSettings } from './hooks/revalidateSiteSettings'

const defaultPublicLocales = ALL_LOCALES.map((locale) => ({
  code: locale.code,
  label: locale.label,
  enabled: true,
}))

export const SiteSettings: GlobalConfig = {
  slug: 'site-settings',
  label: 'Impostazioni sito',
  access: {
    read: () => true,
    update: adminOrEditor,
  },
  admin: {
    group: 'Configurazione',
  },
  fields: [
    {
      name: 'publicLocales',
      type: 'array',
      label: 'Lingue del sito',
      admin: {
        description:
          'Attiva o disattiva le lingue visibili nel selettore del sito e nell’admin. Per aggiungere una nuova lingua (codice non presente in elenco), contatta lo sviluppatore: serve un aggiornamento della configurazione e una migrazione database.',
        initCollapsed: false,
      },
      defaultValue: defaultPublicLocales,
      fields: [
        {
          name: 'code',
          type: 'select',
          required: true,
          label: 'Codice',
          options: ALL_LOCALE_CODES.map((code) => ({
            label: code.toUpperCase(),
            value: code,
          })),
        },
        {
          name: 'label',
          type: 'text',
          required: true,
          label: 'Etichetta (selettore)',
        },
        {
          name: 'enabled',
          type: 'checkbox',
          label: 'Attiva sul sito',
          defaultValue: true,
        },
      ],
    },
  ],
  hooks: {
    afterChange: [revalidateSiteSettings],
  },
}
