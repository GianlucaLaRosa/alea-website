import { MigrateDownArgs, MigrateUpArgs, sql } from '@payloadcms/db-vercel-postgres'

/**
 * Stato evento, evidenza, biglietti, mappa, SEO, bozze/versioni.
 */
export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
  DO $migration$ BEGIN
    CREATE TYPE "public"."enum_events_event_status" AS ENUM('scheduled', 'sold_out', 'cancelled');
  EXCEPTION
    WHEN duplicate_object THEN NULL;
  END $migration$;

  DO $migration$ BEGIN
    CREATE TYPE "public"."enum_events_status" AS ENUM('draft', 'published');
  EXCEPTION
    WHEN duplicate_object THEN NULL;
  END $migration$;

  DO $migration$ BEGIN
    CREATE TYPE "public"."enum__events_v_version_status" AS ENUM('draft', 'published');
  EXCEPTION
    WHEN duplicate_object THEN NULL;
  END $migration$;

  ALTER TABLE "events" ADD COLUMN IF NOT EXISTS "featured" boolean DEFAULT false;
  ALTER TABLE "events" ADD COLUMN IF NOT EXISTS "ticket_url" varchar;
  ALTER TABLE "events" ADD COLUMN IF NOT EXISTS "ticket_label" varchar DEFAULT 'Prenota';
  ALTER TABLE "events" ADD COLUMN IF NOT EXISTS "latitude" numeric;
  ALTER TABLE "events" ADD COLUMN IF NOT EXISTS "longitude" numeric;
  ALTER TABLE "events" ADD COLUMN IF NOT EXISTS "meta_title" varchar;
  ALTER TABLE "events" ADD COLUMN IF NOT EXISTS "meta_image_id" integer;
  ALTER TABLE "events" ADD COLUMN IF NOT EXISTS "meta_description" varchar;
  ALTER TABLE "events" ADD COLUMN IF NOT EXISTS "published_at" timestamp(3) with time zone;

  DO $migration$ BEGIN
    ALTER TABLE "events" ADD COLUMN "status" "enum_events_event_status" DEFAULT 'scheduled';
  EXCEPTION
    WHEN duplicate_column THEN NULL;
  END $migration$;

  DO $migration$ BEGIN
    ALTER TABLE "events" ADD COLUMN "_status" "enum_events_status" DEFAULT 'published';
  EXCEPTION
    WHEN duplicate_column THEN NULL;
  END $migration$;

  UPDATE "events" SET "_status" = 'published' WHERE "_status" IS NULL;

  DO $migration$ BEGIN
    ALTER TABLE "events" ADD CONSTRAINT "events_meta_image_id_media_id_fk" FOREIGN KEY ("meta_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION
    WHEN duplicate_object THEN NULL;
  END $migration$;

  CREATE INDEX IF NOT EXISTS "events_meta_meta_image_idx" ON "events" USING btree ("meta_image_id");

  CREATE TABLE IF NOT EXISTS "_events_v_version_links" (
    "_order" integer NOT NULL,
    "_parent_id" integer NOT NULL,
    "id" varchar PRIMARY KEY NOT NULL,
    "label" varchar,
    "url" varchar,
    "_uuid" varchar
  );

  CREATE TABLE IF NOT EXISTS "_events_v" (
    "id" serial PRIMARY KEY NOT NULL,
    "parent_id" integer,
    "version_title" varchar,
    "version_cover_image_id" integer,
    "version_start_at" timestamp(3) with time zone,
    "version_end_at" timestamp(3) with time zone,
    "version_address" varchar,
    "version_latitude" numeric,
    "version_longitude" numeric,
    "version_description" jsonb,
    "version_ticket_url" varchar,
    "version_ticket_label" varchar,
    "version_hidden" boolean,
    "version_featured" boolean,
    "version_status" "enum_events_event_status",
    "version_meta_title" varchar,
    "version_meta_image_id" integer,
    "version_meta_description" varchar,
    "version_published_at" timestamp(3) with time zone,
    "version_generate_slug" boolean DEFAULT true,
    "version_slug" varchar,
    "version_updated_at" timestamp(3) with time zone,
    "version_created_at" timestamp(3) with time zone,
    "version__status" "enum__events_v_version_status" DEFAULT 'draft',
    "created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
    "updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
    "latest" boolean,
    "autosave" boolean
  );

  CREATE TABLE IF NOT EXISTS "_events_v_rels" (
    "id" serial PRIMARY KEY NOT NULL,
    "order" integer,
    "parent_id" integer NOT NULL,
    "path" varchar NOT NULL,
    "event_tags_id" integer,
    "media_id" integer
  );

  DO $migration$ BEGIN
    ALTER TABLE "_events_v" ADD CONSTRAINT "_events_v_parent_id_events_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."events"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION
    WHEN duplicate_object THEN NULL;
  END $migration$;

  DO $migration$ BEGIN
    ALTER TABLE "_events_v" ADD CONSTRAINT "_events_v_version_cover_image_id_media_id_fk" FOREIGN KEY ("version_cover_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION
    WHEN duplicate_object THEN NULL;
  END $migration$;

  DO $migration$ BEGIN
    ALTER TABLE "_events_v" ADD CONSTRAINT "_events_v_version_meta_image_id_media_id_fk" FOREIGN KEY ("version_meta_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION
    WHEN duplicate_object THEN NULL;
  END $migration$;

  DO $migration$ BEGIN
    ALTER TABLE "_events_v_version_links" ADD CONSTRAINT "_events_v_version_links_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_events_v"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
    WHEN duplicate_object THEN NULL;
  END $migration$;

  DO $migration$ BEGIN
    ALTER TABLE "_events_v_rels" ADD CONSTRAINT "_events_v_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."_events_v"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
    WHEN duplicate_object THEN NULL;
  END $migration$;

  DO $migration$ BEGIN
    ALTER TABLE "_events_v_rels" ADD CONSTRAINT "_events_v_rels_event_tags_fk" FOREIGN KEY ("event_tags_id") REFERENCES "public"."event_tags"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
    WHEN duplicate_object THEN NULL;
  END $migration$;

  DO $migration$ BEGIN
    ALTER TABLE "_events_v_rels" ADD CONSTRAINT "_events_v_rels_media_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
    WHEN duplicate_object THEN NULL;
  END $migration$;

  CREATE INDEX IF NOT EXISTS "_events_v_parent_idx" ON "_events_v" USING btree ("parent_id");
  CREATE INDEX IF NOT EXISTS "_events_v_version_version_cover_image_idx" ON "_events_v" USING btree ("version_cover_image_id");
  CREATE INDEX IF NOT EXISTS "_events_v_version_meta_version_meta_image_idx" ON "_events_v" USING btree ("version_meta_image_id");
  CREATE INDEX IF NOT EXISTS "_events_v_version_links_order_idx" ON "_events_v_version_links" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "_events_v_version_links_parent_id_idx" ON "_events_v_version_links" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "_events_v_rels_order_idx" ON "_events_v_rels" USING btree ("order");
  CREATE INDEX IF NOT EXISTS "_events_v_rels_parent_idx" ON "_events_v_rels" USING btree ("parent_id");
  CREATE INDEX IF NOT EXISTS "_events_v_rels_path_idx" ON "_events_v_rels" USING btree ("path");
  `)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
  DROP TABLE IF EXISTS "_events_v_rels" CASCADE;
  DROP TABLE IF EXISTS "_events_v_version_links" CASCADE;
  DROP TABLE IF EXISTS "_events_v" CASCADE;

  ALTER TABLE "events" DROP COLUMN IF EXISTS "_status";
  ALTER TABLE "events" DROP COLUMN IF EXISTS "status";
  ALTER TABLE "events" DROP COLUMN IF EXISTS "published_at";
  ALTER TABLE "events" DROP COLUMN IF EXISTS "meta_description";
  ALTER TABLE "events" DROP COLUMN IF EXISTS "meta_image_id";
  ALTER TABLE "events" DROP COLUMN IF EXISTS "meta_title";
  ALTER TABLE "events" DROP COLUMN IF EXISTS "longitude";
  ALTER TABLE "events" DROP COLUMN IF EXISTS "latitude";
  ALTER TABLE "events" DROP COLUMN IF EXISTS "ticket_label";
  ALTER TABLE "events" DROP COLUMN IF EXISTS "ticket_url";
  ALTER TABLE "events" DROP COLUMN IF EXISTS "featured";

  DROP TYPE IF EXISTS "public"."enum__events_v_version_status";
  DROP TYPE IF EXISTS "public"."enum_events_status";
  DROP TYPE IF EXISTS "public"."enum_events_event_status";
  `)
}
