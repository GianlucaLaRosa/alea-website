import { MigrateDownArgs, MigrateUpArgs, sql } from '@payloadcms/db-vercel-postgres'

/**
 * Un solo annuncio sul global (campi piatti + message localizzato).
 * Migra il primo elemento dell’array precedente, se presente.
 */
export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
  ALTER TABLE "announcement_bar" ADD COLUMN IF NOT EXISTS "campaign_id" varchar;
  ALTER TABLE "announcement_bar" ADD COLUMN IF NOT EXISTS "background_color" varchar DEFAULT '#6366f1';
  ALTER TABLE "announcement_bar" ADD COLUMN IF NOT EXISTS "start_at" timestamp(3) with time zone;
  ALTER TABLE "announcement_bar" ADD COLUMN IF NOT EXISTS "end_at" timestamp(3) with time zone;
  ALTER TABLE "announcement_bar" ADD COLUMN IF NOT EXISTS "enabled" boolean DEFAULT false;

  CREATE TABLE IF NOT EXISTS "announcement_bar_locales" (
  	"message" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );

  DO $migration$ BEGIN
    ALTER TABLE "announcement_bar_locales" ADD CONSTRAINT "announcement_bar_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."announcement_bar"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
    WHEN duplicate_object THEN NULL;
  END $migration$;

  CREATE UNIQUE INDEX IF NOT EXISTS "announcement_bar_locales_locale_parent_id_unique" ON "announcement_bar_locales" USING btree ("_locale","_parent_id");

  DO $migration$ BEGIN
    IF EXISTS (
      SELECT 1 FROM information_schema.tables
      WHERE table_schema = 'public' AND table_name = 'announcement_bar_announcements'
    ) THEN
      WITH "first_row" AS (
        SELECT a.*
        FROM "announcement_bar_announcements" a
        ORDER BY a."_order" ASC
        LIMIT 1
      )
      UPDATE "announcement_bar" ab
      SET
        "campaign_id" = COALESCE(ab."campaign_id", fr."campaign_id"),
        "background_color" = COALESCE(ab."background_color", fr."background_color", '#6366f1'),
        "start_at" = COALESCE(ab."start_at", fr."start_at"),
        "end_at" = COALESCE(ab."end_at", fr."end_at"),
        "enabled" = COALESCE(ab."enabled", fr."enabled", false)
      FROM "first_row" fr
      WHERE ab."id" = fr."_parent_id";
    END IF;
  EXCEPTION
    WHEN undefined_table THEN NULL;
    WHEN undefined_column THEN NULL;
  END $migration$;

  DO $migration$ BEGIN
    INSERT INTO "announcement_bar_locales" ("message", "_locale", "_parent_id")
    SELECT al."message", al."_locale", fr."_parent_id"
    FROM "announcement_bar_announcements_locales" al
    INNER JOIN (
      SELECT a."id", a."_parent_id"
      FROM "announcement_bar_announcements" a
      ORDER BY a."_order" ASC
      LIMIT 1
    ) fr ON fr."id" = al."_parent_id"
    WHERE NOT EXISTS (
      SELECT 1 FROM "announcement_bar_locales" existing
      WHERE existing."_parent_id" = fr."_parent_id" AND existing."_locale" = al."_locale"
    );
  EXCEPTION
    WHEN undefined_table THEN NULL;
  END $migration$;

  DROP TABLE IF EXISTS "announcement_bar_announcements_locales" CASCADE;
  DROP TABLE IF EXISTS "announcement_bar_announcements" CASCADE;
  `)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
  CREATE TABLE IF NOT EXISTS "announcement_bar_announcements" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"campaign_id" varchar NOT NULL,
  	"background_color" varchar DEFAULT '#6366f1' NOT NULL,
  	"start_at" timestamp(3) with time zone NOT NULL,
  	"end_at" timestamp(3) with time zone NOT NULL,
  	"enabled" boolean DEFAULT true
  );

  CREATE TABLE IF NOT EXISTS "announcement_bar_announcements_locales" (
  	"message" varchar NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );

  DO $migration$ BEGIN
    INSERT INTO "announcement_bar_announcements" (
      "_order", "_parent_id", "id", "campaign_id", "background_color", "start_at", "end_at", "enabled"
    )
    SELECT
      1,
      ab."id",
      gen_random_uuid()::text,
      COALESCE(ab."campaign_id", gen_random_uuid()::text),
      COALESCE(ab."background_color", '#6366f1'),
      COALESCE(ab."start_at", NOW()),
      COALESCE(ab."end_at", NOW() + interval '1 day'),
      COALESCE(ab."enabled", false)
    FROM "announcement_bar" ab;

    INSERT INTO "announcement_bar_announcements_locales" ("message", "_locale", "_parent_id")
    SELECT al."message", al."_locale", a."id"
    FROM "announcement_bar_locales" al
    INNER JOIN "announcement_bar" ab ON ab."id" = al."_parent_id"
    INNER JOIN "announcement_bar_announcements" a ON a."_parent_id" = ab."id";
  EXCEPTION WHEN undefined_table THEN NULL;
  END $migration$;

  DROP TABLE IF EXISTS "announcement_bar_locales" CASCADE;
  ALTER TABLE "announcement_bar" DROP COLUMN IF EXISTS "campaign_id";
  ALTER TABLE "announcement_bar" DROP COLUMN IF EXISTS "background_color";
  ALTER TABLE "announcement_bar" DROP COLUMN IF EXISTS "start_at";
  ALTER TABLE "announcement_bar" DROP COLUMN IF EXISTS "end_at";
  ALTER TABLE "announcement_bar" DROP COLUMN IF EXISTS "enabled";
  `)
}
