import type { GlobalConfig } from 'payload'

import { adminOrEditor } from '@/access/adminOrEditor'
import { DEFAULT_ANNOUNCEMENT_BAR_COLOR } from '@/utilities/announcementBarColors'
import {
  createAnnouncementDismissKey,
  isValidAnnouncementDismissKey,
} from '@/utilities/announcementDismissKey'
import { revalidateAnnouncementBar } from './hooks/revalidateAnnouncementBar'

const HEX_PATTERN = /^#[0-9A-Fa-f]{6}$/

type AnnouncementBarDoc = {
  enabled?: boolean | null
  campaignId?: string | null
}

export const AnnouncementBar: GlobalConfig = {
  slug: 'announcement-bar',
  label: 'Barra annunci',
  access: {
    read: () => true,
    update: adminOrEditor,
  },
  admin: {
    group: 'Configurazione',
    description:
      'Un solo avviso alla volta. Ogni volta che riattivi «Attivo», chi aveva chiuso la barra la rivede. Data di inizio nel futuro: l’avviso resta nascosto fino a quel momento.',
  },
  fields: [
    {
      name: 'enabled',
      type: 'checkbox',
      label: 'Attivo',
      defaultValue: false,
    },
    {
      name: 'message',
      type: 'textarea',
      localized: true,
      label: 'Testo',
      admin: {
        condition: (data) => Boolean(data?.enabled),
      },
    },
    {
      name: 'backgroundColor',
      type: 'text',
      defaultValue: DEFAULT_ANNOUNCEMENT_BAR_COLOR,
      label: 'Colore di sfondo',
      admin: {
        condition: (data) => Boolean(data?.enabled),
        description: 'Il testo sul sito sarà chiaro o scuro in automatico per restare leggibile.',
        components: {
          Field: '@/components/fields/ColorField#ColorField',
        },
      },
      validate: (value: string | null | undefined, { siblingData }: { siblingData?: { enabled?: boolean } }) => {
        if (!siblingData?.enabled) return true
        if (!value || !HEX_PATTERN.test(value.trim().toLowerCase())) {
          return 'Inserisci un colore esadecimale valido (es. #c44133)'
        }
        return true
      },
    },
    {
      name: 'startAt',
      type: 'date',
      label: 'Inizio visualizzazione',
      admin: {
        condition: (data) => Boolean(data?.enabled),
        date: {
          pickerAppearance: 'dayAndTime',
        },
      },
    },
    {
      name: 'endAt',
      type: 'date',
      label: 'Fine visualizzazione',
      admin: {
        condition: (data) => Boolean(data?.enabled),
        date: {
          pickerAppearance: 'dayAndTime',
        },
      },
    },
    {
      name: 'campaignId',
      type: 'text',
      label: 'Chiave dismiss',
      access: {
        /** Il valore è solo server-side: l’admin inviava per errore la stringa "id". */
        update: () => false,
        read: () => true,
      },
      admin: {
        hidden: true,
        readOnly: true,
      },
    },
  ],
  hooks: {
    beforeValidate: [
      ({ data, originalDoc }) => {
        if (!data) return data

        const original = (originalDoc ?? {}) as AnnouncementBarDoc
        const wasEnabled = Boolean(original.enabled)
        const isEnabled = Boolean(data.enabled)
        const previousKey = isValidAnnouncementDismissKey(original.campaignId)
          ? original.campaignId!.trim()
          : ''

        if (isEnabled && !wasEnabled) {
          data.campaignId = createAnnouncementDismissKey()
        } else if (isEnabled) {
          data.campaignId = previousKey || createAnnouncementDismissKey()
        } else {
          data.campaignId = previousKey
        }

        data.backgroundColor = data.backgroundColor?.trim() || DEFAULT_ANNOUNCEMENT_BAR_COLOR

        if (!isEnabled) return data

        if (!data.startAt || !data.endAt) {
          throw new Error('Con «Attivo» selezionato, inserisci inizio e fine visualizzazione.')
        }

        const start = new Date(data.startAt).getTime()
        const end = new Date(data.endAt).getTime()
        if (end <= start) {
          throw new Error('La fine visualizzazione deve essere successiva all’inizio.')
        }

        return data
      },
    ],
    afterChange: [revalidateAnnouncementBar],
  },
}
