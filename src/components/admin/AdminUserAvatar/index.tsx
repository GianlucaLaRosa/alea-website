'use client'

import { useAuth, useConfig } from '@payloadcms/ui'
import { usePathname } from 'next/navigation'
import { formatAdminURL } from 'payload/shared'
import type React from 'react'

import { Avatar, AvatarFallback } from '@/components/ui/avatar'

function getNameInitial(name?: string | null, email?: string | null): string {
  const fromName = name?.trim()
  if (fromName) return fromName.charAt(0).toUpperCase()

  const fromEmail = email?.trim()
  if (fromEmail) return fromEmail.charAt(0).toUpperCase()

  return '?'
}

const AdminUserAvatar: React.FC = () => {
  const { user } = useAuth()
  const pathname = usePathname()
  const {
    config: {
      admin: {
        routes: { account: accountRoute },
      },
      routes: { admin: adminRoute },
    },
  } = useConfig()

  const isOnAccountPage =
    pathname ===
    formatAdminURL({
      adminRoute,
      path: accountRoute,
    })

  const initial = getNameInitial(user?.name, user?.email)
  const label = user?.name ?? user?.email ?? 'Account'

  return (
    <Avatar
      aria-hidden
      className={['admin-user-avatar', isOnAccountPage && 'admin-user-avatar--active']
        .filter(Boolean)
        .join(' ')}
      size="sm"
    >
      <AvatarFallback aria-label={label}>{initial}</AvatarFallback>
    </Avatar>
  )
}

export default AdminUserAvatar
