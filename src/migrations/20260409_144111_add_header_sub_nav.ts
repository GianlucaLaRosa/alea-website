import { MigrateDownArgs, MigrateUpArgs, sql } from '@payloadcms/db-vercel-postgres'

/**
 * Idempotent: safe when the schema was already applied via dev `push` before running migrations.
 */
export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
  DO $migration$ BEGIN
    CREATE TYPE "public"."enum_header_nav_items_sub_nav_items_link_type" AS ENUM('reference', 'custom');
  EXCEPTION
    WHEN duplicate_object THEN NULL;
  END $migration$;

  CREATE TABLE IF NOT EXISTS "header_nav_items_sub_nav_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"link_type" "enum_header_nav_items_sub_nav_items_link_type" DEFAULT 'reference',
  	"link_new_tab" boolean,
  	"link_url" varchar,
  	"link_label" varchar NOT NULL,
  	"reference_anchor" varchar
  );

  ALTER TABLE "header_nav_items" ADD COLUMN IF NOT EXISTS "primary_link_clickable" boolean DEFAULT true;

  DO $migration$ BEGIN
    ALTER TABLE "header_nav_items_sub_nav_items" ADD CONSTRAINT "header_nav_items_sub_nav_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."header_nav_items"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
    WHEN duplicate_object THEN NULL;
  END $migration$;

  CREATE INDEX IF NOT EXISTS "header_nav_items_sub_nav_items_order_idx" ON "header_nav_items_sub_nav_items" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "header_nav_items_sub_nav_items_parent_id_idx" ON "header_nav_items_sub_nav_items" USING btree ("_parent_id");`)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE IF EXISTS "header_nav_items_sub_nav_items" CASCADE;
  ALTER TABLE "header_nav_items" DROP COLUMN IF EXISTS "primary_link_clickable";
  DROP TYPE IF EXISTS "public"."enum_header_nav_items_sub_nav_items_link_type";`)
}
