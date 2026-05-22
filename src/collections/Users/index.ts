import type { CollectionConfig } from 'payload'

import { adminOnly } from '../../access/adminOnly'
import { adminOrSelf } from '../../access/adminOrSelf'
import { hasCmsAccess, hasRole } from '../../access/roles'
import { assignFirstUserAsAdmin } from './hooks/assignFirstUserAsAdmin'

export const Users: CollectionConfig = {
  slug: 'users',
  access: {
    admin: ({ req: { user } }) => hasCmsAccess(user),
    create: adminOnly,
    delete: adminOnly,
    read: adminOrSelf,
    update: adminOrSelf,
  },
  admin: {
    defaultColumns: ['name', 'email', 'roles'],
    useAsTitle: 'name',
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
        { label: 'Editor', value: 'editor' },
      ],
      defaultValue: ['editor'],
      required: true,
      saveToJWT: true,
      access: {
        update: ({ req: { user } }) => hasRole(user, 'admin'),
      },
      admin: {
        description:
          'Admin: accesso completo al backoffice e gestione utenti. Editor: accesso al CMS senza gestione utenti.',
      },
    },
  ],
  hooks: {
    beforeChange: [assignFirstUserAsAdmin],
  },
  timestamps: true,
}
