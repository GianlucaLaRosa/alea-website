import { MigrateDownArgs, MigrateUpArgs, sql } from '@payloadcms/db-vercel-postgres'

/**
 * Idempotent: safe if the schema was already applied via dev push.
 */
export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
  CREATE TABLE IF NOT EXISTS "events" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar NOT NULL,
  	"image_id" integer NOT NULL,
  	"start_at" timestamp(3) with time zone NOT NULL,
  	"end_at" timestamp(3) with time zone NOT NULL,
  	"address" varchar,
  	"description" jsonb,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );

  CREATE TABLE IF NOT EXISTS "events_links" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar NOT NULL,
  	"url" varchar NOT NULL
  );

  DO $migration$ BEGIN
    ALTER TABLE "events" ADD CONSTRAINT "events_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE restrict ON UPDATE no action;
  EXCEPTION
    WHEN duplicate_object THEN NULL;
  END $migration$;

  DO $migration$ BEGIN
    ALTER TABLE "events_links" ADD CONSTRAINT "events_links_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."events"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
    WHEN duplicate_object THEN NULL;
  END $migration$;

  CREATE INDEX IF NOT EXISTS "events_image_idx" ON "events" USING btree ("image_id");
  CREATE INDEX IF NOT EXISTS "events_start_at_idx" ON "events" USING btree ("start_at");
  CREATE INDEX IF NOT EXISTS "events_end_at_idx" ON "events" USING btree ("end_at");
  CREATE INDEX IF NOT EXISTS "events_links_order_idx" ON "events_links" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "events_links_parent_id_idx" ON "events_links" USING btree ("_parent_id");`)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE IF EXISTS "events_links" CASCADE;
  DROP TABLE IF EXISTS "events" CASCADE;`)
}
