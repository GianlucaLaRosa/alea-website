import { MigrateDownArgs, MigrateUpArgs, sql } from '@payloadcms/db-vercel-postgres'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "games" DROP COLUMN IF EXISTS "published";
  `)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "games" ADD COLUMN IF NOT EXISTS "published" boolean DEFAULT true;
    UPDATE "games" SET "published" = true WHERE "published" IS NULL;
  `)
}
