import { MigrateDownArgs, MigrateUpArgs, sql } from '@payloadcms/db-vercel-postgres'

/**
 * Idempotent: lo schema può essere già presente da dev `push` o da migrazioni successive (es. 160000).
 */
export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
  CREATE TABLE IF NOT EXISTS "announcement_bar_locales" (
  	"message" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );

  DROP TABLE IF EXISTS "announcement_bar_announcements_locales" CASCADE;
  DROP TABLE IF EXISTS "announcement_bar_announcements" CASCADE;

  ALTER TABLE "announcement_bar" ADD COLUMN IF NOT EXISTS "enabled" boolean DEFAULT false;
  ALTER TABLE "announcement_bar" ADD COLUMN IF NOT EXISTS "background_color" varchar DEFAULT '#6366f1';
  ALTER TABLE "announcement_bar" ADD COLUMN IF NOT EXISTS "start_at" timestamp(3) with time zone;
  ALTER TABLE "announcement_bar" ADD COLUMN IF NOT EXISTS "end_at" timestamp(3) with time zone;
  ALTER TABLE "announcement_bar" ADD COLUMN IF NOT EXISTS "campaign_id" varchar;

  DO $migration$ BEGIN
    ALTER TABLE "announcement_bar_locales" ADD CONSTRAINT "announcement_bar_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."announcement_bar"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
    WHEN duplicate_object THEN NULL;
  END $migration$;

  CREATE UNIQUE INDEX IF NOT EXISTS "announcement_bar_locales_locale_parent_id_unique" ON "announcement_bar_locales" USING btree ("_locale","_parent_id");

  DO $migration$ BEGIN
    DROP TYPE "public"."enum_announcement_bar_announcements_background_color";
  EXCEPTION
    WHEN undefined_object THEN NULL;
  END $migration$;
  `)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
  DO $migration$ BEGIN
    CREATE TYPE "public"."enum_announcement_bar_announcements_background_color" AS ENUM('accent', 'primary', 'warning', 'muted');
  EXCEPTION
    WHEN duplicate_object THEN NULL;
  END $migration$;

  CREATE TABLE IF NOT EXISTS "announcement_bar_announcements" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"campaign_id" varchar NOT NULL,
  	"background_color" "enum_announcement_bar_announcements_background_color" DEFAULT 'accent' NOT NULL,
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

  DROP TABLE IF EXISTS "announcement_bar_locales" CASCADE;

  ALTER TABLE "announcement_bar" DROP COLUMN IF EXISTS "enabled";
  ALTER TABLE "announcement_bar" DROP COLUMN IF EXISTS "background_color";
  ALTER TABLE "announcement_bar" DROP COLUMN IF EXISTS "start_at";
  ALTER TABLE "announcement_bar" DROP COLUMN IF EXISTS "end_at";
  ALTER TABLE "announcement_bar" DROP COLUMN IF EXISTS "campaign_id";
  `)
}
