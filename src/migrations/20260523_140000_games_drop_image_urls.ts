import { MigrateDownArgs, MigrateUpArgs, sql } from '@payloadcms/db-vercel-postgres'

/** Rimuove URL esterni BGG; le immagini vivono solo in `media`. */
export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
  ALTER TABLE "games" ADD COLUMN IF NOT EXISTS "pending_bgg_images" jsonb;

  ALTER TABLE "games" DROP COLUMN IF EXISTS "card_image_url";
  ALTER TABLE "games" DROP COLUMN IF EXISTS "detail_image_url";
  ALTER TABLE "games" DROP COLUMN IF EXISTS "hero_image_url";
  `)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
  ALTER TABLE "games" DROP COLUMN IF EXISTS "pending_bgg_images";

  ALTER TABLE "games" ADD COLUMN IF NOT EXISTS "card_image_url" varchar;
  ALTER TABLE "games" ADD COLUMN IF NOT EXISTS "detail_image_url" varchar;
  ALTER TABLE "games" ADD COLUMN IF NOT EXISTS "hero_image_url" varchar;
  `)
}
