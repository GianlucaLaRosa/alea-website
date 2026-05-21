import type { GlobalConfig } from 'payload'

import { footerSocialPlatformOptions } from './socialPlatforms'
import { revalidateFooter } from './hooks/revalidateFooter'

export const Footer: GlobalConfig = {
  slug: 'footer',
  access: {
    read: () => true,
  },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Contatti',
          fields: [
            {
              name: 'address',
              type: 'textarea',
              localized: true,
              label: 'Indirizzo',
              admin: {
                description: 'Es. sede legale o recapito fisico.',
              },
            },
            {
              name: 'emailInfo',
              type: 'email',
              label: 'Email informazioni',
              admin: {
                description: 'Indirizzo mostrato nel sito (es. info@...).',
              },
            },
            {
              name: 'emailPec',
              type: 'email',
              label: 'PEC',
            },
            {
              name: 'codiceFiscale',
              type: 'text',
              label: 'Codice fiscale',
              admin: {
                description: 'CF dell’ente (es. 90067910324).',
              },
            },
          ],
        },
        {
          label: 'Social',
          fields: [
            {
              name: 'socialLinks',
              type: 'array',
              label: 'Link social',
              admin: {
                description: 'Icone cliccabili che aprono il profilo o il gruppo indicato.',
                initCollapsed: true,
                components: {
                  RowLabel: '@/Footer/SocialRowLabel#SocialRowLabel',
                },
              },
              fields: [
                {
                  name: 'platform',
                  type: 'select',
                  label: 'Rete',
                  required: true,
                  defaultValue: 'other',
                  options: [...footerSocialPlatformOptions],
                },
                {
                  name: 'url',
                  type: 'text',
                  label: 'URL',
                  required: true,
                  admin: {
                    description: 'Link completo (https://...).',
                  },
                },
              ],
            },
          ],
        },
      ],
    },
    {
      name: 'documents',
      type: 'array',
      localized: true,
      label: 'Documenti scaricabili',
      admin: {
        description:
          'Per ogni riga: titolo visibile nel sito e file caricato (PDF, ODT, ecc.). Non sono link manuali: usa il pulsante di upload / scegli da Media.',
        initCollapsed: false,
        components: {
          RowLabel: '@/Footer/DocumentRowLabel#DocumentRowLabel',
        },
      },
      fields: [
        {
          type: 'row',
          fields: [
            {
              name: 'label',
              type: 'text',
              label: 'Titolo in footer',
              required: true,
              admin: {
                width: '50%',
                description: 'Es. Statuto sociale, Regolamento interno.',
              },
            },
            {
              name: 'file',
              type: 'upload',
              relationTo: 'media',
              label: 'File da scaricare',
              required: true,
              admin: {
                width: '50%',
                description: 'Carica un nuovo file o seleziona un documento già in Media.',
              },
            },
          ],
        },
      ],
    },
  ],
  hooks: {
    afterChange: [revalidateFooter],
  },
}
