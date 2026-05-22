import type { Access } from 'payload'

import { adminOrEditor } from './adminOrEditor'

export const authenticatedOrPublished: Access = (args) => {
  if (adminOrEditor(args)) {
    return true
  }

  return {
    _status: {
      equals: 'published',
    },
  }
}
