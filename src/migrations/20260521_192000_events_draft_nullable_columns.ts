import { MigrateDownArgs, MigrateUpArgs, sql } from '@payloadcms/db-vercel-postgres'

/**
 * Consente la creazione bozza in admin: Payload inserisce la riga padre prima che
 * titolo, copertina e date siano compilati (validazione solo in pubblicazione).
 */
export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
  ALTER TABLE "events" ALTER COLUMN "title" DROP NOT NULL;
  ALTER TABLE "events" ALTER COLUMN "cover_image_id" DROP NOT NULL;
  ALTER TABLE "events" ALTER COLUMN "start_at" DROP NOT NULL;
  ALTER TABLE "events" ALTER COLUMN "end_at" DROP NOT NULL;
  `)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
  UPDATE "events" SET "title" = 'Senza titolo' WHERE "title" IS NULL;
  UPDATE "events" SET "start_at" = now() WHERE "start_at" IS NULL;
  UPDATE "events" SET "end_at" = now() WHERE "end_at" IS NULL;
  DELETE FROM "events" WHERE "cover_image_id" IS NULL;

  ALTER TABLE "events" ALTER COLUMN "title" SET NOT NULL;
  ALTER TABLE "events" ALTER COLUMN "cover_image_id" SET NOT NULL;
  ALTER TABLE "events" ALTER COLUMN "start_at" SET NOT NULL;
  ALTER TABLE "events" ALTER COLUMN "end_at" SET NOT NULL;
  `)
}
