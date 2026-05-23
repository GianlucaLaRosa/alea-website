import { MigrateDownArgs, MigrateUpArgs, sql } from '@payloadcms/db-vercel-postgres'

/** Colonna `games_id` su payload_locked_documents_rels (idempotente). */
export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN IF NOT EXISTS "games_id" integer;

  DO $migration$ BEGIN
    ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_games_fk" FOREIGN KEY ("games_id") REFERENCES "public"."games"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
    WHEN duplicate_object THEN NULL;
    WHEN undefined_table THEN NULL;
  END $migration$;

  CREATE INDEX IF NOT EXISTS "payload_locked_documents_rels_games_id_idx" ON "payload_locked_documents_rels" USING btree ("games_id");
  `)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
  DROP INDEX IF EXISTS "payload_locked_documents_rels_games_id_idx";

  DO $migration$ BEGIN
    ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_games_fk";
  EXCEPTION
    WHEN undefined_object THEN NULL;
  END $migration$;

  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN IF EXISTS "games_id";
  `)
}
