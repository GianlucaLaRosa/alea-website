import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-vercel-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
  DO $migration$ BEGIN
    CREATE TYPE "public"."enum_footer_social_links_platform" AS ENUM('facebook', 'instagram', 'linkedin', 'twitter', 'youtube', 'whatsapp', 'telegram', 'github', 'other');
  EXCEPTION
    WHEN duplicate_object THEN NULL;
  END $migration$;

  DO $migration$ BEGIN
    CREATE TYPE "public"."enum_footer_document_links_link_type" AS ENUM('reference', 'custom');
  EXCEPTION
    WHEN duplicate_object THEN NULL;
  END $migration$;

  CREATE TABLE IF NOT EXISTS "footer_social_links" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"platform" "enum_footer_social_links_platform" DEFAULT 'other' NOT NULL,
  	"url" varchar NOT NULL
  );

  CREATE TABLE IF NOT EXISTS "footer_document_links" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"link_type" "enum_footer_document_links_link_type" DEFAULT 'reference',
  	"link_new_tab" boolean,
  	"link_url" varchar,
  	"link_label" varchar NOT NULL
  );

  ALTER TABLE "footer" ADD COLUMN IF NOT EXISTS "address" varchar;
  ALTER TABLE "footer" ADD COLUMN IF NOT EXISTS "email_info" varchar;
  ALTER TABLE "footer" ADD COLUMN IF NOT EXISTS "email_pec" varchar;
  ALTER TABLE "footer" ADD COLUMN IF NOT EXISTS "codice_fiscale" varchar;

  DO $migration$ BEGIN
    ALTER TABLE "footer_social_links" ADD CONSTRAINT "footer_social_links_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."footer"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
    WHEN duplicate_object THEN NULL;
  END $migration$;

  DO $migration$ BEGIN
    ALTER TABLE "footer_document_links" ADD CONSTRAINT "footer_document_links_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."footer"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
    WHEN duplicate_object THEN NULL;
  END $migration$;

  CREATE INDEX IF NOT EXISTS "footer_social_links_order_idx" ON "footer_social_links" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "footer_social_links_parent_id_idx" ON "footer_social_links" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "footer_document_links_order_idx" ON "footer_document_links" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "footer_document_links_parent_id_idx" ON "footer_document_links" USING btree ("_parent_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "footer_social_links" CASCADE;
  DROP TABLE "footer_document_links" CASCADE;
  ALTER TABLE "footer" DROP COLUMN "address";
  ALTER TABLE "footer" DROP COLUMN "email_info";
  ALTER TABLE "footer" DROP COLUMN "email_pec";
  ALTER TABLE "footer" DROP COLUMN "codice_fiscale";
  DROP TYPE "public"."enum_footer_social_links_platform";
  DROP TYPE "public"."enum_footer_document_links_link_type";`)
}
