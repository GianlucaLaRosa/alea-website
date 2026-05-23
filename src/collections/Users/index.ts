import type { CollectionConfig } from 'payload'

import { adminOnly } from '../../access/adminOnly'
import { adminOrSelf } from '../../access/adminOrSelf'
import { cmsAdminPanel, isAdminNavVisible } from '../../access/adminPanel'
import { assignFirstUserAsAdmin } from './hooks/assignFirstUserAsAdmin'

export const Users: CollectionConfig = {
  slug: 'users',
  access: {
    admin: cmsAdminPanel,
    create: adminOnly,
    delete: adminOnly,
    read: adminOrSelf,
    update: adminOrSelf,
  },
  admin: {
    defaultColumns: ['name', 'email', 'roles'],
    useAsTitle: 'name',
    hidden: ({ user }) => !isAdminNavVisible(user),
  },
  auth: true,
  fields: [
    {
      name: 'name',
      type: 'text',
    },
    {
      name: 'roles',
      type: 'select',
      hasMany: true,
      options: [
        { label: 'Admin', value: 'admin' },
        { label: 'Gdt Specialist', value: 'gdt-specialist' },
        { label: 'Gdr Specialist', value: 'gdr-specialist' },
        { label: 'WarGame Specialist', value: 'wargame-specialist' },
        { label: 'Social Specialist', value: 'social-specialist' },
      ],
      defaultValue: ['social-specialist'],
      required: true,
      saveToJWT: true,
      access: {
        update: ({ req: { user } }) => isAdminNavVisible(user),
      },
      admin: {
        description:
          'Admin: accesso completo. Gdt: giochi e media giochi. Social: eventi, barra annunci e media eventi. GDR/WarGame: ruoli preparati (nessun permesso CMS per ora). Ruoli multipli combinati.',
      },
    },
  ],
  hooks: {
    beforeChange: [assignFirstUserAsAdmin],
  },
  timestamps: true,
}
