import { MigrateDownArgs, MigrateUpArgs, sql } from '@payloadcms/db-vercel-postgres'

/**
 * Idempotent: safe when announcement_bar tables were already created via dev `push`.
 */
export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
  DO $migration$ BEGIN
    CREATE TYPE "public"."enum_announcement_bar_announcements_background_color" AS ENUM('accent', 'primary', 'warning', 'muted');
  EXCEPTION
    WHEN duplicate_object THEN NULL;
  END $migration$;

  CREATE TABLE IF NOT EXISTS "announcement_bar" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );

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

  DO $migration$ BEGIN
    ALTER TABLE "announcement_bar_announcements" ADD CONSTRAINT "announcement_bar_announcements_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."announcement_bar"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
    WHEN duplicate_object THEN NULL;
  END $migration$;

  DO $migration$ BEGIN
    ALTER TABLE "announcement_bar_announcements_locales" ADD CONSTRAINT "announcement_bar_announcements_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."announcement_bar_announcements"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
    WHEN duplicate_object THEN NULL;
  END $migration$;

  CREATE INDEX IF NOT EXISTS "announcement_bar_announcements_order_idx" ON "announcement_bar_announcements" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "announcement_bar_announcements_parent_id_idx" ON "announcement_bar_announcements" USING btree ("_parent_id");
  CREATE UNIQUE INDEX IF NOT EXISTS "announcement_bar_announcements_locales_locale_parent_id_uniq" ON "announcement_bar_announcements_locales" USING btree ("_locale","_parent_id");
  `)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
  DROP TABLE IF EXISTS "announcement_bar_announcements" CASCADE;
  DROP TABLE IF EXISTS "announcement_bar_announcements_locales" CASCADE;
  DROP TABLE IF EXISTS "announcement_bar" CASCADE;
  DROP TYPE IF EXISTS "public"."enum_announcement_bar_announcements_background_color";
  `)
}
