import { MigrateDownArgs, MigrateUpArgs, sql } from '@payloadcms/db-vercel-postgres'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
  DELETE FROM "footer_rels" WHERE "path" LIKE 'documentLinks%' OR "path" LIKE 'documents%';
  DROP TABLE IF EXISTS "footer_document_links" CASCADE;
  DROP TYPE IF EXISTS "public"."enum_footer_document_links_link_type";

  CREATE TABLE IF NOT EXISTS "footer_documents" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar NOT NULL,
  	"file_id" integer NOT NULL
  );

  DO $migration$ BEGIN
    ALTER TABLE "footer_documents" ADD CONSTRAINT "footer_documents_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."footer"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
    WHEN duplicate_object THEN NULL;
  END $migration$;

  DO $migration$ BEGIN
    ALTER TABLE "footer_documents" ADD CONSTRAINT "footer_documents_file_id_media_id_fk" FOREIGN KEY ("file_id") REFERENCES "public"."media"("id") ON DELETE restrict ON UPDATE no action;
  EXCEPTION
    WHEN duplicate_object THEN NULL;
  END $migration$;

  CREATE INDEX IF NOT EXISTS "footer_documents_order_idx" ON "footer_documents" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "footer_documents_parent_id_idx" ON "footer_documents" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "footer_documents_file_idx" ON "footer_documents" USING btree ("file_id");`)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
  DROP TABLE IF EXISTS "footer_documents" CASCADE;

  DO $migration$ BEGIN
    CREATE TYPE "public"."enum_footer_document_links_link_type" AS ENUM('reference', 'custom');
  EXCEPTION
    WHEN duplicate_object THEN NULL;
  END $migration$;

  CREATE TABLE IF NOT EXISTS "footer_document_links" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"link_type" "enum_footer_document_links_link_type" DEFAULT 'reference',
  	"link_new_tab" boolean,
  	"link_url" varchar,
  	"link_label" varchar NOT NULL
  );

  DO $migration$ BEGIN
    ALTER TABLE "footer_document_links" ADD CONSTRAINT "footer_document_links_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."footer"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
    WHEN duplicate_object THEN NULL;
  END $migration$;

  CREATE INDEX IF NOT EXISTS "footer_document_links_order_idx" ON "footer_document_links" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "footer_document_links_parent_id_idx" ON "footer_document_links" USING btree ("_parent_id");`)
}
