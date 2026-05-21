import { MigrateDownArgs, MigrateUpArgs, sql } from '@payloadcms/db-vercel-postgres'

/**
 * Copertina (rinomina da image), galleria, tag, slug, nascondi.
 * Idempotent where possible.
 */
export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
  DO $migration$ BEGIN
    ALTER TABLE "events" RENAME COLUMN "image_id" TO "cover_image_id";
  EXCEPTION
    WHEN undefined_column THEN NULL;
    WHEN duplicate_column THEN NULL;
  END $migration$;

  DO $migration$ BEGIN
    ALTER TABLE "events" RENAME CONSTRAINT "events_image_id_media_id_fk" TO "events_cover_image_id_media_id_fk";
  EXCEPTION
    WHEN undefined_object THEN NULL;
  END $migration$;

  DO $migration$ BEGIN
    ALTER INDEX "events_image_idx" RENAME TO "events_cover_image_idx";
  EXCEPTION
    WHEN undefined_object THEN NULL;
  END $migration$;

  ALTER TABLE "events" ADD COLUMN IF NOT EXISTS "hidden" boolean DEFAULT false;
  ALTER TABLE "events" ADD COLUMN IF NOT EXISTS "generate_slug" boolean DEFAULT true;
  ALTER TABLE "events" ADD COLUMN IF NOT EXISTS "slug" varchar;

  CREATE TABLE IF NOT EXISTS "event_tags" (
    "id" serial PRIMARY KEY NOT NULL,
    "title" varchar NOT NULL,
    "generate_slug" boolean DEFAULT true,
    "slug" varchar NOT NULL,
    "updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
    "created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );

  CREATE UNIQUE INDEX IF NOT EXISTS "event_tags_slug_idx" ON "event_tags" USING btree ("slug");

  CREATE TABLE IF NOT EXISTS "events_rels" (
    "id" serial PRIMARY KEY NOT NULL,
    "order" integer,
    "parent_id" integer NOT NULL,
    "path" varchar NOT NULL,
    "event_tags_id" integer,
    "media_id" integer
  );

  DO $migration$ BEGIN
    ALTER TABLE "events_rels" ADD CONSTRAINT "events_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."events"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
    WHEN duplicate_object THEN NULL;
  END $migration$;

  DO $migration$ BEGIN
    ALTER TABLE "events_rels" ADD CONSTRAINT "events_rels_event_tags_fk" FOREIGN KEY ("event_tags_id") REFERENCES "public"."event_tags"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
    WHEN duplicate_object THEN NULL;
  END $migration$;

  DO $migration$ BEGIN
    ALTER TABLE "events_rels" ADD CONSTRAINT "events_rels_media_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
    WHEN duplicate_object THEN NULL;
  END $migration$;

  CREATE INDEX IF NOT EXISTS "events_rels_order_idx" ON "events_rels" USING btree ("order");
  CREATE INDEX IF NOT EXISTS "events_rels_parent_idx" ON "events_rels" USING btree ("parent_id");
  CREATE INDEX IF NOT EXISTS "events_rels_path_idx" ON "events_rels" USING btree ("path");
  CREATE INDEX IF NOT EXISTS "events_rels_event_tags_id_idx" ON "events_rels" USING btree ("event_tags_id");
  CREATE INDEX IF NOT EXISTS "events_rels_media_id_idx" ON "events_rels" USING btree ("media_id");

  CREATE UNIQUE INDEX IF NOT EXISTS "events_slug_idx" ON "events" USING btree ("slug");

  UPDATE "events"
  SET "slug" = trim(both '-' from regexp_replace(lower(coalesce("title", 'evento-' || "id"::text)), '[^a-z0-9]+', '-', 'g'))
  WHERE "slug" IS NULL OR "slug" = '';
  `)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
  DROP INDEX IF EXISTS "events_slug_idx";
  DROP TABLE IF EXISTS "events_rels" CASCADE;
  DROP TABLE IF EXISTS "event_tags" CASCADE;

  ALTER TABLE "events" DROP COLUMN IF EXISTS "slug";
  ALTER TABLE "events" DROP COLUMN IF EXISTS "generate_slug";
  ALTER TABLE "events" DROP COLUMN IF EXISTS "hidden";

  DO $migration$ BEGIN
    ALTER INDEX "events_cover_image_idx" RENAME TO "events_image_idx";
  EXCEPTION
    WHEN undefined_object THEN NULL;
  END $migration$;

  DO $migration$ BEGIN
    ALTER TABLE "events" RENAME CONSTRAINT "events_cover_image_id_media_id_fk" TO "events_image_id_media_id_fk";
  EXCEPTION
    WHEN undefined_object THEN NULL;
  END $migration$;

  DO $migration$ BEGIN
    ALTER TABLE "events" RENAME COLUMN "cover_image_id" TO "image_id";
  EXCEPTION
    WHEN undefined_column THEN NULL;
  END $migration$;
  `)
}
