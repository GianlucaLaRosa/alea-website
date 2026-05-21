import { MigrateDownArgs, MigrateUpArgs, sql } from '@payloadcms/db-vercel-postgres'

/**
 * Localization migration — incremental for DBs that already have events/pages/posts.
 * Skips existing enums/tables; backfills Italian locale from main columns before DROP.
 */
export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
  DO $migration$ BEGIN
    CREATE TYPE "public"."_locales" AS ENUM('it', 'en', 'sl');
  EXCEPTION WHEN duplicate_object THEN NULL;
  END $migration$;

  DO $migration$ BEGIN
    CREATE TYPE "public"."enum__pages_v_published_locale" AS ENUM('it', 'en', 'sl');
  EXCEPTION WHEN duplicate_object THEN NULL;
  END $migration$;

  DO $migration$ BEGIN
    CREATE TYPE "public"."enum__posts_v_published_locale" AS ENUM('it', 'en', 'sl');
  EXCEPTION WHEN duplicate_object THEN NULL;
  END $migration$;

  DO $migration$ BEGIN
    CREATE TYPE "public"."enum__events_v_version_status" AS ENUM('draft', 'published');
  EXCEPTION WHEN duplicate_object THEN NULL;
  END $migration$;

  DO $migration$ BEGIN
    CREATE TYPE "public"."enum__events_v_published_locale" AS ENUM('it', 'en', 'sl');
  EXCEPTION WHEN duplicate_object THEN NULL;
  END $migration$;

  DO $migration$ BEGIN
    CREATE TYPE "public"."enum_site_settings_public_locales_code" AS ENUM('it', 'en', 'sl');
  EXCEPTION WHEN duplicate_object THEN NULL;
  END $migration$;`)

  await db.execute(sql`
  CREATE TABLE IF NOT EXISTS "pages_locales" (
    "title" varchar,
    "hero_type" "enum_pages_hero_type" DEFAULT 'lowImpact',
    "hero_rich_text" jsonb,
    "hero_media_id" integer,
    "meta_title" varchar,
    "meta_image_id" integer,
    "meta_description" varchar,
    "id" serial PRIMARY KEY NOT NULL,
    "_locale" "_locales" NOT NULL,
    "_parent_id" integer NOT NULL
  );

  CREATE TABLE IF NOT EXISTS "_pages_v_locales" (
    "version_title" varchar,
    "version_hero_type" "enum__pages_v_version_hero_type" DEFAULT 'lowImpact',
    "version_hero_rich_text" jsonb,
    "version_hero_media_id" integer,
    "version_meta_title" varchar,
    "version_meta_image_id" integer,
    "version_meta_description" varchar,
    "id" serial PRIMARY KEY NOT NULL,
    "_locale" "_locales" NOT NULL,
    "_parent_id" integer NOT NULL
  );

  CREATE TABLE IF NOT EXISTS "posts_locales" (
    "title" varchar,
    "content" jsonb,
    "meta_title" varchar,
    "meta_image_id" integer,
    "meta_description" varchar,
    "id" serial PRIMARY KEY NOT NULL,
    "_locale" "_locales" NOT NULL,
    "_parent_id" integer NOT NULL
  );

  CREATE TABLE IF NOT EXISTS "_posts_v_locales" (
    "version_title" varchar,
    "version_content" jsonb,
    "version_meta_title" varchar,
    "version_meta_image_id" integer,
    "version_meta_description" varchar,
    "id" serial PRIMARY KEY NOT NULL,
    "_locale" "_locales" NOT NULL,
    "_parent_id" integer NOT NULL
  );

  CREATE TABLE IF NOT EXISTS "events_locales" (
    "title" varchar DEFAULT 'Nuovo evento',
    "address" varchar,
    "description" jsonb,
    "search_text" varchar,
    "ticket_label" varchar DEFAULT 'Prenota',
    "meta_title" varchar,
    "meta_image_id" integer,
    "meta_description" varchar,
    "id" serial PRIMARY KEY NOT NULL,
    "_locale" "_locales" NOT NULL,
    "_parent_id" integer NOT NULL
  );

  CREATE TABLE IF NOT EXISTS "event_tags_locales" (
    "title" varchar NOT NULL,
    "id" serial PRIMARY KEY NOT NULL,
    "_locale" "_locales" NOT NULL,
    "_parent_id" integer NOT NULL
  );

  CREATE TABLE IF NOT EXISTS "_events_v_locales" (
    "version_title" varchar DEFAULT 'Nuovo evento',
    "version_address" varchar,
    "version_description" jsonb,
    "version_search_text" varchar,
    "version_ticket_label" varchar DEFAULT 'Prenota',
    "version_meta_title" varchar,
    "version_meta_image_id" integer,
    "version_meta_description" varchar,
    "id" serial PRIMARY KEY NOT NULL,
    "_locale" "_locales" NOT NULL,
    "_parent_id" integer NOT NULL
  );

  CREATE TABLE IF NOT EXISTS "forms_blocks_checkbox_locales" (
    "label" varchar,
    "id" serial PRIMARY KEY NOT NULL,
    "_locale" "_locales" NOT NULL,
    "_parent_id" varchar NOT NULL
  );

  CREATE TABLE IF NOT EXISTS "forms_blocks_country_locales" (
    "label" varchar,
    "id" serial PRIMARY KEY NOT NULL,
    "_locale" "_locales" NOT NULL,
    "_parent_id" varchar NOT NULL
  );

  CREATE TABLE IF NOT EXISTS "forms_blocks_email_locales" (
    "label" varchar,
    "id" serial PRIMARY KEY NOT NULL,
    "_locale" "_locales" NOT NULL,
    "_parent_id" varchar NOT NULL
  );

  CREATE TABLE IF NOT EXISTS "forms_blocks_message_locales" (
    "message" jsonb,
    "id" serial PRIMARY KEY NOT NULL,
    "_locale" "_locales" NOT NULL,
    "_parent_id" varchar NOT NULL
  );

  CREATE TABLE IF NOT EXISTS "forms_blocks_number_locales" (
    "label" varchar,
    "id" serial PRIMARY KEY NOT NULL,
    "_locale" "_locales" NOT NULL,
    "_parent_id" varchar NOT NULL
  );

  CREATE TABLE IF NOT EXISTS "forms_blocks_select_options_locales" (
    "label" varchar NOT NULL,
    "id" serial PRIMARY KEY NOT NULL,
    "_locale" "_locales" NOT NULL,
    "_parent_id" varchar NOT NULL
  );

  CREATE TABLE IF NOT EXISTS "forms_blocks_select_locales" (
    "label" varchar,
    "default_value" varchar,
    "id" serial PRIMARY KEY NOT NULL,
    "_locale" "_locales" NOT NULL,
    "_parent_id" varchar NOT NULL
  );

  CREATE TABLE IF NOT EXISTS "forms_blocks_state_locales" (
    "label" varchar,
    "id" serial PRIMARY KEY NOT NULL,
    "_locale" "_locales" NOT NULL,
    "_parent_id" varchar NOT NULL
  );

  CREATE TABLE IF NOT EXISTS "forms_blocks_text_locales" (
    "label" varchar,
    "default_value" varchar,
    "id" serial PRIMARY KEY NOT NULL,
    "_locale" "_locales" NOT NULL,
    "_parent_id" varchar NOT NULL
  );

  CREATE TABLE IF NOT EXISTS "forms_blocks_textarea_locales" (
    "label" varchar,
    "default_value" varchar,
    "id" serial PRIMARY KEY NOT NULL,
    "_locale" "_locales" NOT NULL,
    "_parent_id" varchar NOT NULL
  );

  CREATE TABLE IF NOT EXISTS "forms_emails_locales" (
    "subject" varchar DEFAULT 'You''ve received a new message.' NOT NULL,
    "message" jsonb,
    "id" serial PRIMARY KEY NOT NULL,
    "_locale" "_locales" NOT NULL,
    "_parent_id" varchar NOT NULL
  );

  CREATE TABLE IF NOT EXISTS "forms_locales" (
    "submit_button_label" varchar,
    "confirmation_message" jsonb,
    "id" serial PRIMARY KEY NOT NULL,
    "_locale" "_locales" NOT NULL,
    "_parent_id" integer NOT NULL
  );

  CREATE TABLE IF NOT EXISTS "search_locales" (
    "title" varchar,
    "id" serial PRIMARY KEY NOT NULL,
    "_locale" "_locales" NOT NULL,
    "_parent_id" integer NOT NULL
  );

  CREATE TABLE IF NOT EXISTS "footer_locales" (
    "address" varchar,
    "id" serial PRIMARY KEY NOT NULL,
    "_locale" "_locales" NOT NULL,
    "_parent_id" integer NOT NULL
  );

  CREATE TABLE IF NOT EXISTS "site_settings" (
    "id" serial PRIMARY KEY NOT NULL,
    "updated_at" timestamp(3) with time zone,
    "created_at" timestamp(3) with time zone
  );

  CREATE TABLE IF NOT EXISTS "site_settings_public_locales" (
    "_order" integer NOT NULL,
    "_parent_id" integer NOT NULL,
    "id" varchar PRIMARY KEY NOT NULL,
    "code" "enum_site_settings_public_locales_code" NOT NULL,
    "label" varchar NOT NULL,
    "enabled" boolean DEFAULT true
  );`)

  await db.execute(sql`
  INSERT INTO "pages_locales" ("title", "hero_type", "hero_rich_text", "hero_media_id", "meta_title", "meta_image_id", "meta_description", "_locale", "_parent_id")
  SELECT p."title", p."hero_type", p."hero_rich_text", p."hero_media_id", p."meta_title", p."meta_image_id", p."meta_description", 'it'::"_locales", p."id"
  FROM "pages" p
  WHERE EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'pages' AND column_name = 'title')
    AND NOT EXISTS (SELECT 1 FROM "pages_locales" pl WHERE pl."_parent_id" = p."id" AND pl."_locale" = 'it');

  INSERT INTO "_pages_v_locales" ("version_title", "version_hero_type", "version_hero_rich_text", "version_hero_media_id", "version_meta_title", "version_meta_image_id", "version_meta_description", "_locale", "_parent_id")
  SELECT v."version_title", v."version_hero_type", v."version_hero_rich_text", v."version_hero_media_id", v."version_meta_title", v."version_meta_image_id", v."version_meta_description", 'it'::"_locales", v."id"
  FROM "_pages_v" v
  WHERE EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = '_pages_v' AND column_name = 'version_title')
    AND NOT EXISTS (SELECT 1 FROM "_pages_v_locales" vl WHERE vl."_parent_id" = v."id" AND vl."_locale" = 'it');

  INSERT INTO "posts_locales" ("title", "content", "meta_title", "meta_image_id", "meta_description", "_locale", "_parent_id")
  SELECT p."title", p."content", p."meta_title", p."meta_image_id", p."meta_description", 'it'::"_locales", p."id"
  FROM "posts" p
  WHERE EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'posts' AND column_name = 'title')
    AND NOT EXISTS (SELECT 1 FROM "posts_locales" pl WHERE pl."_parent_id" = p."id" AND pl."_locale" = 'it');

  INSERT INTO "_posts_v_locales" ("version_title", "version_content", "version_meta_title", "version_meta_image_id", "version_meta_description", "_locale", "_parent_id")
  SELECT v."version_title", v."version_content", v."version_meta_title", v."version_meta_image_id", v."version_meta_description", 'it'::"_locales", v."id"
  FROM "_posts_v" v
  WHERE EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = '_posts_v' AND column_name = 'version_title')
    AND NOT EXISTS (SELECT 1 FROM "_posts_v_locales" vl WHERE vl."_parent_id" = v."id" AND vl."_locale" = 'it');

  INSERT INTO "events_locales" ("title", "address", "description", "search_text", "ticket_label", "meta_title", "meta_image_id", "meta_description", "_locale", "_parent_id")
  SELECT e."title", e."address", e."description", e."search_text", e."ticket_label", e."meta_title", e."meta_image_id", e."meta_description", 'it'::"_locales", e."id"
  FROM "events" e
  WHERE EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'events' AND column_name = 'title')
    AND NOT EXISTS (SELECT 1 FROM "events_locales" el WHERE el."_parent_id" = e."id" AND el."_locale" = 'it');

  INSERT INTO "event_tags_locales" ("title", "_locale", "_parent_id")
  SELECT t."title", 'it'::"_locales", t."id"
  FROM "event_tags" t
  WHERE EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'event_tags' AND column_name = 'title')
    AND NOT EXISTS (SELECT 1 FROM "event_tags_locales" tl WHERE tl."_parent_id" = t."id" AND tl."_locale" = 'it');

  INSERT INTO "_events_v_locales" ("version_title", "version_address", "version_description", "version_search_text", "version_ticket_label", "version_meta_title", "version_meta_image_id", "version_meta_description", "_locale", "_parent_id")
  SELECT v."version_title", v."version_address", v."version_description", v."version_search_text", v."version_ticket_label", v."version_meta_title", v."version_meta_image_id", v."version_meta_description", 'it'::"_locales", v."id"
  FROM "_events_v" v
  WHERE EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = '_events_v' AND column_name = 'version_title')
    AND NOT EXISTS (SELECT 1 FROM "_events_v_locales" vl WHERE vl."_parent_id" = v."id" AND vl."_locale" = 'it');

  INSERT INTO "forms_blocks_checkbox_locales" ("label", "_locale", "_parent_id")
  SELECT b."label", 'it'::"_locales", b."id"
  FROM "forms_blocks_checkbox" b
  WHERE EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'forms_blocks_checkbox' AND column_name = 'label')
    AND NOT EXISTS (SELECT 1 FROM "forms_blocks_checkbox_locales" bl WHERE bl."_parent_id" = b."id" AND bl."_locale" = 'it');

  INSERT INTO "forms_blocks_country_locales" ("label", "_locale", "_parent_id")
  SELECT b."label", 'it'::"_locales", b."id"
  FROM "forms_blocks_country" b
  WHERE EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'forms_blocks_country' AND column_name = 'label')
    AND NOT EXISTS (SELECT 1 FROM "forms_blocks_country_locales" bl WHERE bl."_parent_id" = b."id" AND bl."_locale" = 'it');

  INSERT INTO "forms_blocks_email_locales" ("label", "_locale", "_parent_id")
  SELECT b."label", 'it'::"_locales", b."id"
  FROM "forms_blocks_email" b
  WHERE EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'forms_blocks_email' AND column_name = 'label')
    AND NOT EXISTS (SELECT 1 FROM "forms_blocks_email_locales" bl WHERE bl."_parent_id" = b."id" AND bl."_locale" = 'it');

  INSERT INTO "forms_blocks_message_locales" ("message", "_locale", "_parent_id")
  SELECT b."message", 'it'::"_locales", b."id"
  FROM "forms_blocks_message" b
  WHERE EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'forms_blocks_message' AND column_name = 'message')
    AND NOT EXISTS (SELECT 1 FROM "forms_blocks_message_locales" bl WHERE bl."_parent_id" = b."id" AND bl."_locale" = 'it');

  INSERT INTO "forms_blocks_number_locales" ("label", "_locale", "_parent_id")
  SELECT b."label", 'it'::"_locales", b."id"
  FROM "forms_blocks_number" b
  WHERE EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'forms_blocks_number' AND column_name = 'label')
    AND NOT EXISTS (SELECT 1 FROM "forms_blocks_number_locales" bl WHERE bl."_parent_id" = b."id" AND bl."_locale" = 'it');

  INSERT INTO "forms_blocks_select_options_locales" ("label", "_locale", "_parent_id")
  SELECT b."label", 'it'::"_locales", b."id"
  FROM "forms_blocks_select_options" b
  WHERE EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'forms_blocks_select_options' AND column_name = 'label')
    AND NOT EXISTS (SELECT 1 FROM "forms_blocks_select_options_locales" bl WHERE bl."_parent_id" = b."id" AND bl."_locale" = 'it');

  INSERT INTO "forms_blocks_select_locales" ("label", "default_value", "_locale", "_parent_id")
  SELECT b."label", b."default_value", 'it'::"_locales", b."id"
  FROM "forms_blocks_select" b
  WHERE EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'forms_blocks_select' AND column_name = 'label')
    AND NOT EXISTS (SELECT 1 FROM "forms_blocks_select_locales" bl WHERE bl."_parent_id" = b."id" AND bl."_locale" = 'it');

  INSERT INTO "forms_blocks_state_locales" ("label", "_locale", "_parent_id")
  SELECT b."label", 'it'::"_locales", b."id"
  FROM "forms_blocks_state" b
  WHERE EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'forms_blocks_state' AND column_name = 'label')
    AND NOT EXISTS (SELECT 1 FROM "forms_blocks_state_locales" bl WHERE bl."_parent_id" = b."id" AND bl."_locale" = 'it');

  INSERT INTO "forms_blocks_text_locales" ("label", "default_value", "_locale", "_parent_id")
  SELECT b."label", b."default_value", 'it'::"_locales", b."id"
  FROM "forms_blocks_text" b
  WHERE EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'forms_blocks_text' AND column_name = 'label')
    AND NOT EXISTS (SELECT 1 FROM "forms_blocks_text_locales" bl WHERE bl."_parent_id" = b."id" AND bl."_locale" = 'it');

  INSERT INTO "forms_blocks_textarea_locales" ("label", "default_value", "_locale", "_parent_id")
  SELECT b."label", b."default_value", 'it'::"_locales", b."id"
  FROM "forms_blocks_textarea" b
  WHERE EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'forms_blocks_textarea' AND column_name = 'label')
    AND NOT EXISTS (SELECT 1 FROM "forms_blocks_textarea_locales" bl WHERE bl."_parent_id" = b."id" AND bl."_locale" = 'it');

  INSERT INTO "forms_emails_locales" ("subject", "message", "_locale", "_parent_id")
  SELECT b."subject", b."message", 'it'::"_locales", b."id"
  FROM "forms_emails" b
  WHERE EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'forms_emails' AND column_name = 'subject')
    AND NOT EXISTS (SELECT 1 FROM "forms_emails_locales" bl WHERE bl."_parent_id" = b."id" AND bl."_locale" = 'it');

  INSERT INTO "forms_locales" ("submit_button_label", "confirmation_message", "_locale", "_parent_id")
  SELECT f."submit_button_label", f."confirmation_message", 'it'::"_locales", f."id"
  FROM "forms" f
  WHERE EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'forms' AND column_name = 'submit_button_label')
    AND NOT EXISTS (SELECT 1 FROM "forms_locales" fl WHERE fl."_parent_id" = f."id" AND fl."_locale" = 'it');

  INSERT INTO "search_locales" ("title", "_locale", "_parent_id")
  SELECT s."title", 'it'::"_locales", s."id"
  FROM "search" s
  WHERE EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'search' AND column_name = 'title')
    AND NOT EXISTS (SELECT 1 FROM "search_locales" sl WHERE sl."_parent_id" = s."id" AND sl."_locale" = 'it');

  INSERT INTO "footer_locales" ("address", "_locale", "_parent_id")
  SELECT f."address", 'it'::"_locales", f."id"
  FROM "footer" f
  WHERE EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'footer' AND column_name = 'address')
    AND NOT EXISTS (SELECT 1 FROM "footer_locales" fl WHERE fl."_parent_id" = f."id" AND fl."_locale" = 'it');`)

  await db.execute(sql`
  ALTER TABLE "footer_documents" ADD COLUMN IF NOT EXISTS "_locale" "_locales";
  UPDATE "footer_documents" SET "_locale" = 'it'::"_locales" WHERE "_locale" IS NULL;
  DO $migration$ BEGIN
    ALTER TABLE "footer_documents" ALTER COLUMN "_locale" SET NOT NULL;
  EXCEPTION WHEN others THEN NULL;
  END $migration$;

  ALTER TABLE "events_links" ADD COLUMN IF NOT EXISTS "_locale" "_locales";
  UPDATE "events_links" SET "_locale" = 'it'::"_locales" WHERE "_locale" IS NULL;
  DO $migration$ BEGIN
    ALTER TABLE "events_links" ALTER COLUMN "_locale" SET NOT NULL;
  EXCEPTION WHEN others THEN NULL;
  END $migration$;

  ALTER TABLE "_events_v_version_links" ADD COLUMN IF NOT EXISTS "_locale" "_locales";
  UPDATE "_events_v_version_links" SET "_locale" = 'it'::"_locales" WHERE "_locale" IS NULL;
  DO $migration$ BEGIN
    ALTER TABLE "_events_v_version_links" ALTER COLUMN "_locale" SET NOT NULL;
  EXCEPTION WHEN others THEN NULL;
  END $migration$;

  ALTER TABLE "_events_v" ADD COLUMN IF NOT EXISTS "snapshot" boolean;
  ALTER TABLE "_events_v" ADD COLUMN IF NOT EXISTS "published_locale" "enum__events_v_published_locale";

  ALTER TABLE "pages_hero_links" ADD COLUMN IF NOT EXISTS "_locale" "_locales";
  UPDATE "pages_hero_links" SET "_locale" = 'it'::"_locales" WHERE "_locale" IS NULL;
  ALTER TABLE "pages_blocks_cta_links" ADD COLUMN IF NOT EXISTS "_locale" "_locales";
  UPDATE "pages_blocks_cta_links" SET "_locale" = 'it'::"_locales" WHERE "_locale" IS NULL;
  ALTER TABLE "pages_blocks_cta" ADD COLUMN IF NOT EXISTS "_locale" "_locales";
  UPDATE "pages_blocks_cta" SET "_locale" = 'it'::"_locales" WHERE "_locale" IS NULL;
  ALTER TABLE "pages_blocks_content_columns" ADD COLUMN IF NOT EXISTS "_locale" "_locales";
  UPDATE "pages_blocks_content_columns" SET "_locale" = 'it'::"_locales" WHERE "_locale" IS NULL;
  ALTER TABLE "pages_blocks_content" ADD COLUMN IF NOT EXISTS "_locale" "_locales";
  UPDATE "pages_blocks_content" SET "_locale" = 'it'::"_locales" WHERE "_locale" IS NULL;
  ALTER TABLE "pages_blocks_media_block" ADD COLUMN IF NOT EXISTS "_locale" "_locales";
  UPDATE "pages_blocks_media_block" SET "_locale" = 'it'::"_locales" WHERE "_locale" IS NULL;
  ALTER TABLE "pages_blocks_archive" ADD COLUMN IF NOT EXISTS "_locale" "_locales";
  UPDATE "pages_blocks_archive" SET "_locale" = 'it'::"_locales" WHERE "_locale" IS NULL;
  ALTER TABLE "pages_blocks_form_block" ADD COLUMN IF NOT EXISTS "_locale" "_locales";
  UPDATE "pages_blocks_form_block" SET "_locale" = 'it'::"_locales" WHERE "_locale" IS NULL;
  ALTER TABLE "pages_rels" ADD COLUMN IF NOT EXISTS "locale" "_locales";
  ALTER TABLE "_pages_v_version_hero_links" ADD COLUMN IF NOT EXISTS "_locale" "_locales";
  UPDATE "_pages_v_version_hero_links" SET "_locale" = 'it'::"_locales" WHERE "_locale" IS NULL;
  ALTER TABLE "_pages_v_blocks_cta_links" ADD COLUMN IF NOT EXISTS "_locale" "_locales";
  UPDATE "_pages_v_blocks_cta_links" SET "_locale" = 'it'::"_locales" WHERE "_locale" IS NULL;
  ALTER TABLE "_pages_v_blocks_cta" ADD COLUMN IF NOT EXISTS "_locale" "_locales";
  UPDATE "_pages_v_blocks_cta" SET "_locale" = 'it'::"_locales" WHERE "_locale" IS NULL;
  ALTER TABLE "_pages_v_blocks_content_columns" ADD COLUMN IF NOT EXISTS "_locale" "_locales";
  UPDATE "_pages_v_blocks_content_columns" SET "_locale" = 'it'::"_locales" WHERE "_locale" IS NULL;
  ALTER TABLE "_pages_v_blocks_content" ADD COLUMN IF NOT EXISTS "_locale" "_locales";
  UPDATE "_pages_v_blocks_content" SET "_locale" = 'it'::"_locales" WHERE "_locale" IS NULL;
  ALTER TABLE "_pages_v_blocks_media_block" ADD COLUMN IF NOT EXISTS "_locale" "_locales";
  UPDATE "_pages_v_blocks_media_block" SET "_locale" = 'it'::"_locales" WHERE "_locale" IS NULL;
  ALTER TABLE "_pages_v_blocks_archive" ADD COLUMN IF NOT EXISTS "_locale" "_locales";
  UPDATE "_pages_v_blocks_archive" SET "_locale" = 'it'::"_locales" WHERE "_locale" IS NULL;
  ALTER TABLE "_pages_v_blocks_form_block" ADD COLUMN IF NOT EXISTS "_locale" "_locales";
  UPDATE "_pages_v_blocks_form_block" SET "_locale" = 'it'::"_locales" WHERE "_locale" IS NULL;
  ALTER TABLE "_pages_v" ADD COLUMN IF NOT EXISTS "snapshot" boolean;
  ALTER TABLE "_pages_v" ADD COLUMN IF NOT EXISTS "published_locale" "enum__pages_v_published_locale";
  ALTER TABLE "_pages_v_rels" ADD COLUMN IF NOT EXISTS "locale" "_locales";
  ALTER TABLE "_posts_v" ADD COLUMN IF NOT EXISTS "snapshot" boolean;
  ALTER TABLE "_posts_v" ADD COLUMN IF NOT EXISTS "published_locale" "enum__posts_v_published_locale";
  ALTER TABLE "categories_breadcrumbs" ADD COLUMN IF NOT EXISTS "_locale" "_locales";
  UPDATE "categories_breadcrumbs" SET "_locale" = 'it'::"_locales" WHERE "_locale" IS NULL;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN IF NOT EXISTS "event_tags_id" integer;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN IF NOT EXISTS "events_id" integer;
  ALTER TABLE "header_nav_items_sub_nav_items" ADD COLUMN IF NOT EXISTS "_locale" "_locales";
  UPDATE "header_nav_items_sub_nav_items" SET "_locale" = 'it'::"_locales" WHERE "_locale" IS NULL;
  ALTER TABLE "header_nav_items" ADD COLUMN IF NOT EXISTS "_locale" "_locales";
  UPDATE "header_nav_items" SET "_locale" = 'it'::"_locales" WHERE "_locale" IS NULL;
  ALTER TABLE "header_rels" ADD COLUMN IF NOT EXISTS "locale" "_locales";

  DO $migration$ BEGIN
    ALTER TABLE "pages" DROP CONSTRAINT "pages_hero_media_id_media_id_fk";
  EXCEPTION WHEN undefined_object THEN NULL;
  END $migration$;
  DO $migration$ BEGIN
    ALTER TABLE "pages" DROP CONSTRAINT "pages_meta_image_id_media_id_fk";
  EXCEPTION WHEN undefined_object THEN NULL;
  END $migration$;
  DO $migration$ BEGIN
    ALTER TABLE "_pages_v" DROP CONSTRAINT "_pages_v_version_hero_media_id_media_id_fk";
  EXCEPTION WHEN undefined_object THEN NULL;
  END $migration$;
  DO $migration$ BEGIN
    ALTER TABLE "_pages_v" DROP CONSTRAINT "_pages_v_version_meta_image_id_media_id_fk";
  EXCEPTION WHEN undefined_object THEN NULL;
  END $migration$;
  DO $migration$ BEGIN
    ALTER TABLE "posts" DROP CONSTRAINT "posts_meta_image_id_media_id_fk";
  EXCEPTION WHEN undefined_object THEN NULL;
  END $migration$;
  DO $migration$ BEGIN
    ALTER TABLE "_posts_v" DROP CONSTRAINT "_posts_v_version_meta_image_id_media_id_fk";
  EXCEPTION WHEN undefined_object THEN NULL;
  END $migration$;

  DROP INDEX IF EXISTS "pages_hero_hero_media_idx";
  DROP INDEX IF EXISTS "pages_meta_meta_image_idx";
  DROP INDEX IF EXISTS "_pages_v_version_hero_version_hero_media_idx";
  DROP INDEX IF EXISTS "_pages_v_version_meta_version_meta_image_idx";
  DROP INDEX IF EXISTS "posts_meta_meta_image_idx";
  DROP INDEX IF EXISTS "_posts_v_version_meta_version_meta_image_idx";
  DROP INDEX IF EXISTS "pages_rels_pages_id_idx";
  DROP INDEX IF EXISTS "pages_rels_posts_id_idx";
  DROP INDEX IF EXISTS "pages_rels_categories_id_idx";
  DROP INDEX IF EXISTS "_pages_v_rels_pages_id_idx";
  DROP INDEX IF EXISTS "_pages_v_rels_posts_id_idx";
  DROP INDEX IF EXISTS "_pages_v_rels_categories_id_idx";
  DROP INDEX IF EXISTS "header_rels_pages_id_idx";
  DROP INDEX IF EXISTS "header_rels_posts_id_idx";`)

  await db.execute(sql`
  DO $migration$ BEGIN
    ALTER TABLE "pages_locales" ADD CONSTRAINT "pages_locales_hero_media_id_media_id_fk" FOREIGN KEY ("hero_media_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION WHEN duplicate_object THEN NULL;
  END $migration$;
  DO $migration$ BEGIN
    ALTER TABLE "pages_locales" ADD CONSTRAINT "pages_locales_meta_image_id_media_id_fk" FOREIGN KEY ("meta_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION WHEN duplicate_object THEN NULL;
  END $migration$;
  DO $migration$ BEGIN
    ALTER TABLE "pages_locales" ADD CONSTRAINT "pages_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION WHEN duplicate_object THEN NULL;
  END $migration$;
  DO $migration$ BEGIN
    ALTER TABLE "_pages_v_locales" ADD CONSTRAINT "_pages_v_locales_version_hero_media_id_media_id_fk" FOREIGN KEY ("version_hero_media_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION WHEN duplicate_object THEN NULL;
  END $migration$;
  DO $migration$ BEGIN
    ALTER TABLE "_pages_v_locales" ADD CONSTRAINT "_pages_v_locales_version_meta_image_id_media_id_fk" FOREIGN KEY ("version_meta_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION WHEN duplicate_object THEN NULL;
  END $migration$;
  DO $migration$ BEGIN
    ALTER TABLE "_pages_v_locales" ADD CONSTRAINT "_pages_v_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION WHEN duplicate_object THEN NULL;
  END $migration$;
  DO $migration$ BEGIN
    ALTER TABLE "posts_locales" ADD CONSTRAINT "posts_locales_meta_image_id_media_id_fk" FOREIGN KEY ("meta_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION WHEN duplicate_object THEN NULL;
  END $migration$;
  DO $migration$ BEGIN
    ALTER TABLE "posts_locales" ADD CONSTRAINT "posts_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."posts"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION WHEN duplicate_object THEN NULL;
  END $migration$;
  DO $migration$ BEGIN
    ALTER TABLE "_posts_v_locales" ADD CONSTRAINT "_posts_v_locales_version_meta_image_id_media_id_fk" FOREIGN KEY ("version_meta_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION WHEN duplicate_object THEN NULL;
  END $migration$;
  DO $migration$ BEGIN
    ALTER TABLE "_posts_v_locales" ADD CONSTRAINT "_posts_v_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_posts_v"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION WHEN duplicate_object THEN NULL;
  END $migration$;
  DO $migration$ BEGIN
    ALTER TABLE "event_tags_locales" ADD CONSTRAINT "event_tags_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."event_tags"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION WHEN duplicate_object THEN NULL;
  END $migration$;
  DO $migration$ BEGIN
    ALTER TABLE "events_locales" ADD CONSTRAINT "events_locales_meta_image_id_media_id_fk" FOREIGN KEY ("meta_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION WHEN duplicate_object THEN NULL;
  END $migration$;
  DO $migration$ BEGIN
    ALTER TABLE "events_locales" ADD CONSTRAINT "events_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."events"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION WHEN duplicate_object THEN NULL;
  END $migration$;
  DO $migration$ BEGIN
    ALTER TABLE "_events_v_locales" ADD CONSTRAINT "_events_v_locales_version_meta_image_id_media_id_fk" FOREIGN KEY ("version_meta_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION WHEN duplicate_object THEN NULL;
  END $migration$;
  DO $migration$ BEGIN
    ALTER TABLE "_events_v_locales" ADD CONSTRAINT "_events_v_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_events_v"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION WHEN duplicate_object THEN NULL;
  END $migration$;
  DO $migration$ BEGIN
    ALTER TABLE "forms_blocks_checkbox_locales" ADD CONSTRAINT "forms_blocks_checkbox_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."forms_blocks_checkbox"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION WHEN duplicate_object THEN NULL;
  END $migration$;
  DO $migration$ BEGIN
    ALTER TABLE "forms_blocks_country_locales" ADD CONSTRAINT "forms_blocks_country_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."forms_blocks_country"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION WHEN duplicate_object THEN NULL;
  END $migration$;
  DO $migration$ BEGIN
    ALTER TABLE "forms_blocks_email_locales" ADD CONSTRAINT "forms_blocks_email_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."forms_blocks_email"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION WHEN duplicate_object THEN NULL;
  END $migration$;
  DO $migration$ BEGIN
    ALTER TABLE "forms_blocks_message_locales" ADD CONSTRAINT "forms_blocks_message_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."forms_blocks_message"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION WHEN duplicate_object THEN NULL;
  END $migration$;
  DO $migration$ BEGIN
    ALTER TABLE "forms_blocks_number_locales" ADD CONSTRAINT "forms_blocks_number_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."forms_blocks_number"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION WHEN duplicate_object THEN NULL;
  END $migration$;
  DO $migration$ BEGIN
    ALTER TABLE "forms_blocks_select_options_locales" ADD CONSTRAINT "forms_blocks_select_options_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."forms_blocks_select_options"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION WHEN duplicate_object THEN NULL;
  END $migration$;
  DO $migration$ BEGIN
    ALTER TABLE "forms_blocks_select_locales" ADD CONSTRAINT "forms_blocks_select_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."forms_blocks_select"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION WHEN duplicate_object THEN NULL;
  END $migration$;
  DO $migration$ BEGIN
    ALTER TABLE "forms_blocks_state_locales" ADD CONSTRAINT "forms_blocks_state_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."forms_blocks_state"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION WHEN duplicate_object THEN NULL;
  END $migration$;
  DO $migration$ BEGIN
    ALTER TABLE "forms_blocks_text_locales" ADD CONSTRAINT "forms_blocks_text_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."forms_blocks_text"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION WHEN duplicate_object THEN NULL;
  END $migration$;
  DO $migration$ BEGIN
    ALTER TABLE "forms_blocks_textarea_locales" ADD CONSTRAINT "forms_blocks_textarea_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."forms_blocks_textarea"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION WHEN duplicate_object THEN NULL;
  END $migration$;
  DO $migration$ BEGIN
    ALTER TABLE "forms_emails_locales" ADD CONSTRAINT "forms_emails_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."forms_emails"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION WHEN duplicate_object THEN NULL;
  END $migration$;
  DO $migration$ BEGIN
    ALTER TABLE "forms_locales" ADD CONSTRAINT "forms_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."forms"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION WHEN duplicate_object THEN NULL;
  END $migration$;
  DO $migration$ BEGIN
    ALTER TABLE "search_locales" ADD CONSTRAINT "search_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."search"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION WHEN duplicate_object THEN NULL;
  END $migration$;
  DO $migration$ BEGIN
    ALTER TABLE "footer_locales" ADD CONSTRAINT "footer_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."footer"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION WHEN duplicate_object THEN NULL;
  END $migration$;
  DO $migration$ BEGIN
    ALTER TABLE "site_settings_public_locales" ADD CONSTRAINT "site_settings_public_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."site_settings"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION WHEN duplicate_object THEN NULL;
  END $migration$;
  DO $migration$ BEGIN
    ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_event_tags_fk" FOREIGN KEY ("event_tags_id") REFERENCES "public"."event_tags"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION WHEN duplicate_object THEN NULL;
  END $migration$;
  DO $migration$ BEGIN
    ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_events_fk" FOREIGN KEY ("events_id") REFERENCES "public"."events"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION WHEN duplicate_object THEN NULL;
  END $migration$;

  CREATE INDEX IF NOT EXISTS "pages_hero_hero_media_idx" ON "pages_locales" USING btree ("hero_media_id");
  CREATE INDEX IF NOT EXISTS "pages_meta_meta_image_idx" ON "pages_locales" USING btree ("meta_image_id","_locale");
  CREATE UNIQUE INDEX IF NOT EXISTS "pages_locales_locale_parent_id_unique" ON "pages_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX IF NOT EXISTS "_pages_v_version_hero_version_hero_media_idx" ON "_pages_v_locales" USING btree ("version_hero_media_id");
  CREATE INDEX IF NOT EXISTS "_pages_v_version_meta_version_meta_image_idx" ON "_pages_v_locales" USING btree ("version_meta_image_id","_locale");
  CREATE UNIQUE INDEX IF NOT EXISTS "_pages_v_locales_locale_parent_id_unique" ON "_pages_v_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX IF NOT EXISTS "posts_meta_meta_image_idx" ON "posts_locales" USING btree ("meta_image_id","_locale");
  CREATE UNIQUE INDEX IF NOT EXISTS "posts_locales_locale_parent_id_unique" ON "posts_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX IF NOT EXISTS "_posts_v_version_meta_version_meta_image_idx" ON "_posts_v_locales" USING btree ("version_meta_image_id","_locale");
  CREATE UNIQUE INDEX IF NOT EXISTS "_posts_v_locales_locale_parent_id_unique" ON "_posts_v_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX IF NOT EXISTS "event_tags_locales_locale_parent_id_unique" ON "event_tags_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX IF NOT EXISTS "events_links_locale_idx" ON "events_links" USING btree ("_locale");
  CREATE INDEX IF NOT EXISTS "_events_v_version_links_locale_idx" ON "_events_v_version_links" USING btree ("_locale");
  CREATE INDEX IF NOT EXISTS "_events_v_snapshot_idx" ON "_events_v" USING btree ("snapshot");
  CREATE INDEX IF NOT EXISTS "_events_v_published_locale_idx" ON "_events_v" USING btree ("published_locale");
  CREATE INDEX IF NOT EXISTS "events_search_text_idx" ON "events_locales" USING btree ("search_text","_locale");
  CREATE INDEX IF NOT EXISTS "events_meta_meta_image_idx" ON "events_locales" USING btree ("meta_image_id","_locale");
  CREATE UNIQUE INDEX IF NOT EXISTS "events_locales_locale_parent_id_unique" ON "events_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX IF NOT EXISTS "_events_v_version_version_search_text_idx" ON "_events_v_locales" USING btree ("version_search_text","_locale");
  CREATE INDEX IF NOT EXISTS "_events_v_version_meta_version_meta_image_idx" ON "_events_v_locales" USING btree ("version_meta_image_id","_locale");
  CREATE UNIQUE INDEX IF NOT EXISTS "_events_v_locales_locale_parent_id_unique" ON "_events_v_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX IF NOT EXISTS "forms_blocks_checkbox_locales_locale_parent_id_unique" ON "forms_blocks_checkbox_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX IF NOT EXISTS "forms_blocks_country_locales_locale_parent_id_unique" ON "forms_blocks_country_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX IF NOT EXISTS "forms_blocks_email_locales_locale_parent_id_unique" ON "forms_blocks_email_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX IF NOT EXISTS "forms_blocks_message_locales_locale_parent_id_unique" ON "forms_blocks_message_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX IF NOT EXISTS "forms_blocks_number_locales_locale_parent_id_unique" ON "forms_blocks_number_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX IF NOT EXISTS "forms_blocks_select_options_locales_locale_parent_id_unique" ON "forms_blocks_select_options_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX IF NOT EXISTS "forms_blocks_select_locales_locale_parent_id_unique" ON "forms_blocks_select_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX IF NOT EXISTS "forms_blocks_state_locales_locale_parent_id_unique" ON "forms_blocks_state_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX IF NOT EXISTS "forms_blocks_text_locales_locale_parent_id_unique" ON "forms_blocks_text_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX IF NOT EXISTS "forms_blocks_textarea_locales_locale_parent_id_unique" ON "forms_blocks_textarea_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX IF NOT EXISTS "forms_emails_locales_locale_parent_id_unique" ON "forms_emails_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX IF NOT EXISTS "forms_locales_locale_parent_id_unique" ON "forms_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX IF NOT EXISTS "search_locales_locale_parent_id_unique" ON "search_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX IF NOT EXISTS "footer_documents_locale_idx" ON "footer_documents" USING btree ("_locale");
  CREATE UNIQUE INDEX IF NOT EXISTS "footer_locales_locale_parent_id_unique" ON "footer_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX IF NOT EXISTS "site_settings_public_locales_order_idx" ON "site_settings_public_locales" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "site_settings_public_locales_parent_id_idx" ON "site_settings_public_locales" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "pages_hero_links_locale_idx" ON "pages_hero_links" USING btree ("_locale");
  CREATE INDEX IF NOT EXISTS "pages_blocks_cta_links_locale_idx" ON "pages_blocks_cta_links" USING btree ("_locale");
  CREATE INDEX IF NOT EXISTS "pages_blocks_cta_locale_idx" ON "pages_blocks_cta" USING btree ("_locale");
  CREATE INDEX IF NOT EXISTS "pages_blocks_content_columns_locale_idx" ON "pages_blocks_content_columns" USING btree ("_locale");
  CREATE INDEX IF NOT EXISTS "pages_blocks_content_locale_idx" ON "pages_blocks_content" USING btree ("_locale");
  CREATE INDEX IF NOT EXISTS "pages_blocks_media_block_locale_idx" ON "pages_blocks_media_block" USING btree ("_locale");
  CREATE INDEX IF NOT EXISTS "pages_blocks_archive_locale_idx" ON "pages_blocks_archive" USING btree ("_locale");
  CREATE INDEX IF NOT EXISTS "pages_blocks_form_block_locale_idx" ON "pages_blocks_form_block" USING btree ("_locale");
  CREATE INDEX IF NOT EXISTS "pages_rels_locale_idx" ON "pages_rels" USING btree ("locale");
  CREATE INDEX IF NOT EXISTS "_pages_v_version_hero_links_locale_idx" ON "_pages_v_version_hero_links" USING btree ("_locale");
  CREATE INDEX IF NOT EXISTS "_pages_v_blocks_cta_links_locale_idx" ON "_pages_v_blocks_cta_links" USING btree ("_locale");
  CREATE INDEX IF NOT EXISTS "_pages_v_blocks_cta_locale_idx" ON "_pages_v_blocks_cta" USING btree ("_locale");
  CREATE INDEX IF NOT EXISTS "_pages_v_blocks_content_columns_locale_idx" ON "_pages_v_blocks_content_columns" USING btree ("_locale");
  CREATE INDEX IF NOT EXISTS "_pages_v_blocks_content_locale_idx" ON "_pages_v_blocks_content" USING btree ("_locale");
  CREATE INDEX IF NOT EXISTS "_pages_v_blocks_media_block_locale_idx" ON "_pages_v_blocks_media_block" USING btree ("_locale");
  CREATE INDEX IF NOT EXISTS "_pages_v_blocks_archive_locale_idx" ON "_pages_v_blocks_archive" USING btree ("_locale");
  CREATE INDEX IF NOT EXISTS "_pages_v_blocks_form_block_locale_idx" ON "_pages_v_blocks_form_block" USING btree ("_locale");
  CREATE INDEX IF NOT EXISTS "_pages_v_snapshot_idx" ON "_pages_v" USING btree ("snapshot");
  CREATE INDEX IF NOT EXISTS "_pages_v_published_locale_idx" ON "_pages_v" USING btree ("published_locale");
  CREATE INDEX IF NOT EXISTS "_pages_v_rels_locale_idx" ON "_pages_v_rels" USING btree ("locale");
  CREATE INDEX IF NOT EXISTS "_posts_v_snapshot_idx" ON "_posts_v" USING btree ("snapshot");
  CREATE INDEX IF NOT EXISTS "_posts_v_published_locale_idx" ON "_posts_v" USING btree ("published_locale");
  CREATE INDEX IF NOT EXISTS "categories_breadcrumbs_locale_idx" ON "categories_breadcrumbs" USING btree ("_locale");
  CREATE INDEX IF NOT EXISTS "payload_locked_documents_rels_event_tags_id_idx" ON "payload_locked_documents_rels" USING btree ("event_tags_id");
  CREATE INDEX IF NOT EXISTS "payload_locked_documents_rels_events_id_idx" ON "payload_locked_documents_rels" USING btree ("events_id");
  CREATE INDEX IF NOT EXISTS "header_nav_items_sub_nav_items_locale_idx" ON "header_nav_items_sub_nav_items" USING btree ("_locale");
  CREATE INDEX IF NOT EXISTS "header_nav_items_locale_idx" ON "header_nav_items" USING btree ("_locale");
  CREATE INDEX IF NOT EXISTS "header_rels_locale_idx" ON "header_rels" USING btree ("locale");
  CREATE INDEX IF NOT EXISTS "pages_rels_pages_id_idx" ON "pages_rels" USING btree ("pages_id","locale");
  CREATE INDEX IF NOT EXISTS "pages_rels_posts_id_idx" ON "pages_rels" USING btree ("posts_id","locale");
  CREATE INDEX IF NOT EXISTS "pages_rels_categories_id_idx" ON "pages_rels" USING btree ("categories_id","locale");
  CREATE INDEX IF NOT EXISTS "_pages_v_rels_pages_id_idx" ON "_pages_v_rels" USING btree ("pages_id","locale");
  CREATE INDEX IF NOT EXISTS "_pages_v_rels_posts_id_idx" ON "_pages_v_rels" USING btree ("posts_id","locale");
  CREATE INDEX IF NOT EXISTS "_pages_v_rels_categories_id_idx" ON "_pages_v_rels" USING btree ("categories_id","locale");
  CREATE INDEX IF NOT EXISTS "header_rels_pages_id_idx" ON "header_rels" USING btree ("pages_id","locale");
  CREATE INDEX IF NOT EXISTS "header_rels_posts_id_idx" ON "header_rels" USING btree ("posts_id","locale");`)

  await db.execute(sql`
  DO $migration$ BEGIN ALTER TABLE "pages" DROP COLUMN "title"; EXCEPTION WHEN undefined_column THEN NULL; END $migration$;
  DO $migration$ BEGIN ALTER TABLE "pages" DROP COLUMN "hero_type"; EXCEPTION WHEN undefined_column THEN NULL; END $migration$;
  DO $migration$ BEGIN ALTER TABLE "pages" DROP COLUMN "hero_rich_text"; EXCEPTION WHEN undefined_column THEN NULL; END $migration$;
  DO $migration$ BEGIN ALTER TABLE "pages" DROP COLUMN "hero_media_id"; EXCEPTION WHEN undefined_column THEN NULL; END $migration$;
  DO $migration$ BEGIN ALTER TABLE "pages" DROP COLUMN "meta_title"; EXCEPTION WHEN undefined_column THEN NULL; END $migration$;
  DO $migration$ BEGIN ALTER TABLE "pages" DROP COLUMN "meta_image_id"; EXCEPTION WHEN undefined_column THEN NULL; END $migration$;
  DO $migration$ BEGIN ALTER TABLE "pages" DROP COLUMN "meta_description"; EXCEPTION WHEN undefined_column THEN NULL; END $migration$;
  DO $migration$ BEGIN ALTER TABLE "_pages_v" DROP COLUMN "version_title"; EXCEPTION WHEN undefined_column THEN NULL; END $migration$;
  DO $migration$ BEGIN ALTER TABLE "_pages_v" DROP COLUMN "version_hero_type"; EXCEPTION WHEN undefined_column THEN NULL; END $migration$;
  DO $migration$ BEGIN ALTER TABLE "_pages_v" DROP COLUMN "version_hero_rich_text"; EXCEPTION WHEN undefined_column THEN NULL; END $migration$;
  DO $migration$ BEGIN ALTER TABLE "_pages_v" DROP COLUMN "version_hero_media_id"; EXCEPTION WHEN undefined_column THEN NULL; END $migration$;
  DO $migration$ BEGIN ALTER TABLE "_pages_v" DROP COLUMN "version_meta_title"; EXCEPTION WHEN undefined_column THEN NULL; END $migration$;
  DO $migration$ BEGIN ALTER TABLE "_pages_v" DROP COLUMN "version_meta_image_id"; EXCEPTION WHEN undefined_column THEN NULL; END $migration$;
  DO $migration$ BEGIN ALTER TABLE "_pages_v" DROP COLUMN "version_meta_description"; EXCEPTION WHEN undefined_column THEN NULL; END $migration$;
  DO $migration$ BEGIN ALTER TABLE "posts" DROP COLUMN "title"; EXCEPTION WHEN undefined_column THEN NULL; END $migration$;
  DO $migration$ BEGIN ALTER TABLE "posts" DROP COLUMN "content"; EXCEPTION WHEN undefined_column THEN NULL; END $migration$;
  DO $migration$ BEGIN ALTER TABLE "posts" DROP COLUMN "meta_title"; EXCEPTION WHEN undefined_column THEN NULL; END $migration$;
  DO $migration$ BEGIN ALTER TABLE "posts" DROP COLUMN "meta_image_id"; EXCEPTION WHEN undefined_column THEN NULL; END $migration$;
  DO $migration$ BEGIN ALTER TABLE "posts" DROP COLUMN "meta_description"; EXCEPTION WHEN undefined_column THEN NULL; END $migration$;
  DO $migration$ BEGIN ALTER TABLE "_posts_v" DROP COLUMN "version_title"; EXCEPTION WHEN undefined_column THEN NULL; END $migration$;
  DO $migration$ BEGIN ALTER TABLE "_posts_v" DROP COLUMN "version_content"; EXCEPTION WHEN undefined_column THEN NULL; END $migration$;
  DO $migration$ BEGIN ALTER TABLE "_posts_v" DROP COLUMN "version_meta_title"; EXCEPTION WHEN undefined_column THEN NULL; END $migration$;
  DO $migration$ BEGIN ALTER TABLE "_posts_v" DROP COLUMN "version_meta_image_id"; EXCEPTION WHEN undefined_column THEN NULL; END $migration$;
  DO $migration$ BEGIN ALTER TABLE "_posts_v" DROP COLUMN "version_meta_description"; EXCEPTION WHEN undefined_column THEN NULL; END $migration$;
  DO $migration$ BEGIN ALTER TABLE "events" DROP COLUMN "title"; EXCEPTION WHEN undefined_column THEN NULL; END $migration$;
  DO $migration$ BEGIN ALTER TABLE "events" DROP COLUMN "address"; EXCEPTION WHEN undefined_column THEN NULL; END $migration$;
  DO $migration$ BEGIN ALTER TABLE "events" DROP COLUMN "description"; EXCEPTION WHEN undefined_column THEN NULL; END $migration$;
  DO $migration$ BEGIN ALTER TABLE "events" DROP COLUMN "search_text"; EXCEPTION WHEN undefined_column THEN NULL; END $migration$;
  DO $migration$ BEGIN ALTER TABLE "events" DROP COLUMN "ticket_label"; EXCEPTION WHEN undefined_column THEN NULL; END $migration$;
  DO $migration$ BEGIN ALTER TABLE "events" DROP COLUMN "meta_title"; EXCEPTION WHEN undefined_column THEN NULL; END $migration$;
  DO $migration$ BEGIN ALTER TABLE "events" DROP COLUMN "meta_image_id"; EXCEPTION WHEN undefined_column THEN NULL; END $migration$;
  DO $migration$ BEGIN ALTER TABLE "events" DROP COLUMN "meta_description"; EXCEPTION WHEN undefined_column THEN NULL; END $migration$;
  DO $migration$ BEGIN ALTER TABLE "event_tags" DROP COLUMN "title"; EXCEPTION WHEN undefined_column THEN NULL; END $migration$;
  DO $migration$ BEGIN ALTER TABLE "_events_v" DROP COLUMN "version_title"; EXCEPTION WHEN undefined_column THEN NULL; END $migration$;
  DO $migration$ BEGIN ALTER TABLE "_events_v" DROP COLUMN "version_address"; EXCEPTION WHEN undefined_column THEN NULL; END $migration$;
  DO $migration$ BEGIN ALTER TABLE "_events_v" DROP COLUMN "version_description"; EXCEPTION WHEN undefined_column THEN NULL; END $migration$;
  DO $migration$ BEGIN ALTER TABLE "_events_v" DROP COLUMN "version_search_text"; EXCEPTION WHEN undefined_column THEN NULL; END $migration$;
  DO $migration$ BEGIN ALTER TABLE "_events_v" DROP COLUMN "version_ticket_label"; EXCEPTION WHEN undefined_column THEN NULL; END $migration$;
  DO $migration$ BEGIN ALTER TABLE "_events_v" DROP COLUMN "version_meta_title"; EXCEPTION WHEN undefined_column THEN NULL; END $migration$;
  DO $migration$ BEGIN ALTER TABLE "_events_v" DROP COLUMN "version_meta_image_id"; EXCEPTION WHEN undefined_column THEN NULL; END $migration$;
  DO $migration$ BEGIN ALTER TABLE "_events_v" DROP COLUMN "version_meta_description"; EXCEPTION WHEN undefined_column THEN NULL; END $migration$;
  DO $migration$ BEGIN ALTER TABLE "forms_blocks_checkbox" DROP COLUMN "label"; EXCEPTION WHEN undefined_column THEN NULL; END $migration$;
  DO $migration$ BEGIN ALTER TABLE "forms_blocks_country" DROP COLUMN "label"; EXCEPTION WHEN undefined_column THEN NULL; END $migration$;
  DO $migration$ BEGIN ALTER TABLE "forms_blocks_email" DROP COLUMN "label"; EXCEPTION WHEN undefined_column THEN NULL; END $migration$;
  DO $migration$ BEGIN ALTER TABLE "forms_blocks_message" DROP COLUMN "message"; EXCEPTION WHEN undefined_column THEN NULL; END $migration$;
  DO $migration$ BEGIN ALTER TABLE "forms_blocks_number" DROP COLUMN "label"; EXCEPTION WHEN undefined_column THEN NULL; END $migration$;
  DO $migration$ BEGIN ALTER TABLE "forms_blocks_select_options" DROP COLUMN "label"; EXCEPTION WHEN undefined_column THEN NULL; END $migration$;
  DO $migration$ BEGIN ALTER TABLE "forms_blocks_select" DROP COLUMN "label"; EXCEPTION WHEN undefined_column THEN NULL; END $migration$;
  DO $migration$ BEGIN ALTER TABLE "forms_blocks_select" DROP COLUMN "default_value"; EXCEPTION WHEN undefined_column THEN NULL; END $migration$;
  DO $migration$ BEGIN ALTER TABLE "forms_blocks_state" DROP COLUMN "label"; EXCEPTION WHEN undefined_column THEN NULL; END $migration$;
  DO $migration$ BEGIN ALTER TABLE "forms_blocks_text" DROP COLUMN "label"; EXCEPTION WHEN undefined_column THEN NULL; END $migration$;
  DO $migration$ BEGIN ALTER TABLE "forms_blocks_text" DROP COLUMN "default_value"; EXCEPTION WHEN undefined_column THEN NULL; END $migration$;
  DO $migration$ BEGIN ALTER TABLE "forms_blocks_textarea" DROP COLUMN "label"; EXCEPTION WHEN undefined_column THEN NULL; END $migration$;
  DO $migration$ BEGIN ALTER TABLE "forms_blocks_textarea" DROP COLUMN "default_value"; EXCEPTION WHEN undefined_column THEN NULL; END $migration$;
  DO $migration$ BEGIN ALTER TABLE "forms_emails" DROP COLUMN "subject"; EXCEPTION WHEN undefined_column THEN NULL; END $migration$;
  DO $migration$ BEGIN ALTER TABLE "forms_emails" DROP COLUMN "message"; EXCEPTION WHEN undefined_column THEN NULL; END $migration$;
  DO $migration$ BEGIN ALTER TABLE "forms" DROP COLUMN "submit_button_label"; EXCEPTION WHEN undefined_column THEN NULL; END $migration$;
  DO $migration$ BEGIN ALTER TABLE "forms" DROP COLUMN "confirmation_message"; EXCEPTION WHEN undefined_column THEN NULL; END $migration$;
  DO $migration$ BEGIN ALTER TABLE "search" DROP COLUMN "title"; EXCEPTION WHEN undefined_column THEN NULL; END $migration$;
  DO $migration$ BEGIN ALTER TABLE "footer" DROP COLUMN "address"; EXCEPTION WHEN undefined_column THEN NULL; END $migration$;

  DROP TYPE IF EXISTS "public"."enum_footer_document_links_link_type";`)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  // Reversing localization is destructive; use DB backup if needed.
  await db.execute(sql`
  DO $migration$ BEGIN ALTER TABLE "footer" ADD COLUMN "address" varchar; EXCEPTION WHEN duplicate_column THEN NULL; END $migration$;
  DO $migration$ BEGIN ALTER TABLE "search" ADD COLUMN "title" varchar; EXCEPTION WHEN duplicate_column THEN NULL; END $migration$;
  DROP TABLE IF EXISTS "site_settings_public_locales" CASCADE;
  DROP TABLE IF EXISTS "site_settings" CASCADE;
  DROP TABLE IF EXISTS "footer_locales" CASCADE;
  DROP TABLE IF EXISTS "search_locales" CASCADE;
  DROP TABLE IF EXISTS "forms_locales" CASCADE;
  DROP TABLE IF EXISTS "forms_emails_locales" CASCADE;
  DROP TABLE IF EXISTS "forms_blocks_textarea_locales" CASCADE;
  DROP TABLE IF EXISTS "forms_blocks_text_locales" CASCADE;
  DROP TABLE IF EXISTS "forms_blocks_state_locales" CASCADE;
  DROP TABLE IF EXISTS "forms_blocks_select_locales" CASCADE;
  DROP TABLE IF EXISTS "forms_blocks_select_options_locales" CASCADE;
  DROP TABLE IF EXISTS "forms_blocks_number_locales" CASCADE;
  DROP TABLE IF EXISTS "forms_blocks_message_locales" CASCADE;
  DROP TABLE IF EXISTS "forms_blocks_email_locales" CASCADE;
  DROP TABLE IF EXISTS "forms_blocks_country_locales" CASCADE;
  DROP TABLE IF EXISTS "forms_blocks_checkbox_locales" CASCADE;
  DROP TABLE IF EXISTS "_events_v_locales" CASCADE;
  DROP TABLE IF EXISTS "events_locales" CASCADE;
  DROP TABLE IF EXISTS "event_tags_locales" CASCADE;
  DROP TABLE IF EXISTS "_posts_v_locales" CASCADE;
  DROP TABLE IF EXISTS "posts_locales" CASCADE;
  DROP TABLE IF EXISTS "_pages_v_locales" CASCADE;
  DROP TABLE IF EXISTS "pages_locales" CASCADE;
  DROP TYPE IF EXISTS "public"."enum_site_settings_public_locales_code";
  DROP TYPE IF EXISTS "public"."enum__events_v_published_locale";
  DROP TYPE IF EXISTS "public"."enum__events_v_version_status";
  DROP TYPE IF EXISTS "public"."enum__posts_v_published_locale";
  DROP TYPE IF EXISTS "public"."enum__pages_v_published_locale";
  DROP TYPE IF EXISTS "public"."_locales";`)
}
