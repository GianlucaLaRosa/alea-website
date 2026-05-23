import 'dotenv/config'

import { vercelPostgresAdapter } from '@payloadcms/db-vercel-postgres'
import sharp from 'sharp'
import path from 'path'
import { buildConfig, type Locale, PayloadRequest } from 'payload'
import { fileURLToPath } from 'url'

import { Categories } from './collections/Categories'
import { Tags } from './collections/Tags'
import { Events } from './collections/Events'
import { Games } from './collections/Games'
import { Media } from './collections/Media'
import { Pages } from './collections/Pages'
import { Posts } from './collections/Posts'
import { Users } from './collections/Users'
import { Footer } from './Footer/config'
import { Header } from './Header/config'
import { SiteSettings } from './globals/SiteSettings/config'
import { AnnouncementBar } from './globals/AnnouncementBar/config'
import { ALL_LOCALES, DEFAULT_LOCALE } from './config/localization'
import { filterAvailableLocales } from './utilities/filterAvailableLocales'
import { plugins } from './plugins'
import { defaultLexical } from '@/fields/defaultLexical'
import { hasCmsAccess } from './access/roles'
import { ensureMediaFolders } from './hooks/ensureMediaFolders'
import { getServerSideURL } from './utilities/getURL'
import { ensureAnnouncementBarGlobal } from './hooks/ensureAnnouncementBarGlobal'
import { vercelBlobStorage } from '@payloadcms/storage-vercel-blob'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

const useVercelBlob = Boolean(process.env.BLOB_READ_WRITE_TOKEN?.trim())

export default buildConfig({
  admin: {
    components: {
      beforeLogin: ['@/components/BeforeLogin'],
      beforeDashboard: ['@/components/BeforeDashboard'],
      afterNavLinks: ['@/components/admin/MissingTranslationsNavLink'],
      views: {
        missingTranslations: {
          Component: '@/components/admin/MissingTranslationsView',
          exact: true,
          path: '/missing-translations',
        },
      },
    },
    importMap: {
      baseDir: path.resolve(dirname),
    },
    user: Users.slug,
    livePreview: {
      breakpoints: [
        {
          label: 'Mobile',
          name: 'mobile',
          width: 375,
          height: 667,
        },
        {
          label: 'Tablet',
          name: 'tablet',
          width: 768,
          height: 1024,
        },
        {
          label: 'Desktop',
          name: 'desktop',
          width: 1440,
          height: 900,
        },
      ],
    },
  },
  // This config helps us configure global or default features that the other editors can inherit
  editor: defaultLexical,
  db: vercelPostgresAdapter({
    pool: {
      connectionString: process.env.POSTGRES_URL || '',
    },
    /** Schema gestito con `payload migrate`, evita push automatico in dev. */
    push: false,
  }),
  collections: [Pages, Posts, Media, Categories, Tags, Events, Games, Users],
  localization: {
    locales: ALL_LOCALES.map(({ code, label }) => ({ code, label })) as Locale[],
    defaultLocale: DEFAULT_LOCALE,
    fallback: true,
    filterAvailableLocales,
  },
  cors: [getServerSideURL()].filter(Boolean),
  plugins: [
    ...plugins,
    ...(useVercelBlob
      ? [
          vercelBlobStorage({
            collections: {
              media: true,
            },
            token: process.env.BLOB_READ_WRITE_TOKEN!,
          }),
        ]
      : []),
  ],
  globals: [Header, Footer, SiteSettings, AnnouncementBar],
  onInit: async (payload) => {
    await ensureAnnouncementBarGlobal(payload)
    await ensureMediaFolders(payload)
  },
  secret: process.env.PAYLOAD_SECRET,
  sharp,
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  jobs: {
    access: {
      run: ({ req }: { req: PayloadRequest }): boolean => {
        if (hasCmsAccess(req.user)) return true

        const secret = process.env.CRON_SECRET
        if (!secret) return false

        // If there is no logged in user, then check
        // for the Vercel Cron secret to be present as an
        // Authorization header:
        const authHeader = req.headers.get('authorization')
        return authHeader === `Bearer ${secret}`
      },
    },
    tasks: [],
  },
})
