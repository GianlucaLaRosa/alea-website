import { MigrateDownArgs, MigrateUpArgs, sql } from '@payloadcms/db-vercel-postgres'

/**
 * Rinomina event_tags → tags, colonne rel → tags_id, aggiunge colore.
 * I nomi degli indici non vengono rinominati (non richiesti da Payload; evita errori se mancanti).
 */
export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
  DO $migration$ BEGIN
    ALTER TABLE "events_rels" DROP CONSTRAINT "events_rels_event_tags_fk";
  EXCEPTION
    WHEN undefined_object THEN NULL;
    WHEN undefined_table THEN NULL;
  END $migration$;

  DO $migration$ BEGIN
    ALTER TABLE "_events_v_rels" DROP CONSTRAINT "_events_v_rels_event_tags_fk";
  EXCEPTION
    WHEN undefined_object THEN NULL;
    WHEN undefined_table THEN NULL;
  END $migration$;

  DO $migration$ BEGIN
    ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_event_tags_fk";
  EXCEPTION
    WHEN undefined_object THEN NULL;
    WHEN undefined_table THEN NULL;
  END $migration$;

  DO $migration$ BEGIN
    ALTER TABLE "event_tags_locales" DROP CONSTRAINT "event_tags_locales_parent_id_fk";
  EXCEPTION
    WHEN undefined_object THEN NULL;
    WHEN undefined_table THEN NULL;
  END $migration$;

  DO $migration$ BEGIN
    ALTER TABLE "tags_locales" DROP CONSTRAINT "tags_locales_parent_id_fk";
  EXCEPTION
    WHEN undefined_object THEN NULL;
    WHEN undefined_table THEN NULL;
  END $migration$;

  DO $migration$ BEGIN
    ALTER TABLE "events_rels" RENAME COLUMN "event_tags_id" TO "tags_id";
  EXCEPTION WHEN undefined_column THEN NULL;
  END $migration$;

  DO $migration$ BEGIN
    ALTER TABLE "_events_v_rels" RENAME COLUMN "event_tags_id" TO "tags_id";
  EXCEPTION WHEN undefined_column THEN NULL;
  END $migration$;

  DO $migration$ BEGIN
    ALTER TABLE "payload_locked_documents_rels" RENAME COLUMN "event_tags_id" TO "tags_id";
  EXCEPTION WHEN undefined_column THEN NULL;
  END $migration$;

  DO $migration$ BEGIN
    ALTER TABLE "event_tags" RENAME TO "tags";
  EXCEPTION WHEN undefined_table THEN NULL;
  END $migration$;

  DO $migration$ BEGIN
    ALTER TABLE "event_tags_locales" RENAME TO "tags_locales";
  EXCEPTION WHEN undefined_table THEN NULL;
  END $migration$;

  DO $migration$ BEGIN
    ALTER TABLE "tags" ADD COLUMN IF NOT EXISTS "color" varchar DEFAULT '#6366f1';
    UPDATE "tags" SET "color" = '#6366f1' WHERE "color" IS NULL OR trim("color") = '';
    ALTER TABLE "tags" ALTER COLUMN "color" SET DEFAULT '#6366f1';
    ALTER TABLE "tags" ALTER COLUMN "color" SET NOT NULL;
  EXCEPTION
    WHEN undefined_table THEN NULL;
    WHEN undefined_column THEN NULL;
  END $migration$;

  DO $migration$ BEGIN
    ALTER TABLE "events_rels" ADD CONSTRAINT "events_rels_tags_fk" FOREIGN KEY ("tags_id") REFERENCES "public"."tags"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
    WHEN duplicate_object THEN NULL;
    WHEN undefined_table THEN NULL;
  END $migration$;

  DO $migration$ BEGIN
    ALTER TABLE "_events_v_rels" ADD CONSTRAINT "_events_v_rels_tags_fk" FOREIGN KEY ("tags_id") REFERENCES "public"."tags"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
    WHEN duplicate_object THEN NULL;
    WHEN undefined_table THEN NULL;
  END $migration$;

  DO $migration$ BEGIN
    ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_tags_fk" FOREIGN KEY ("tags_id") REFERENCES "public"."tags"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
    WHEN duplicate_object THEN NULL;
    WHEN undefined_table THEN NULL;
  END $migration$;

  DO $migration$ BEGIN
    ALTER TABLE "tags_locales" ADD CONSTRAINT "tags_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."tags"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
    WHEN duplicate_object THEN NULL;
    WHEN undefined_table THEN NULL;
  END $migration$;
  `)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
  DO $migration$ BEGIN
    ALTER TABLE "events_rels" DROP CONSTRAINT "events_rels_tags_fk";
  EXCEPTION WHEN undefined_object THEN NULL;
  END $migration$;

  DO $migration$ BEGIN
    ALTER TABLE "_events_v_rels" DROP CONSTRAINT "_events_v_rels_tags_fk";
  EXCEPTION WHEN undefined_object THEN NULL;
  END $migration$;

  DO $migration$ BEGIN
    ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_tags_fk";
  EXCEPTION WHEN undefined_object THEN NULL;
  END $migration$;

  DO $migration$ BEGIN
    ALTER TABLE "tags_locales" DROP CONSTRAINT "tags_locales_parent_id_fk";
  EXCEPTION WHEN undefined_object THEN NULL;
  END $migration$;

  ALTER TABLE "tags" DROP COLUMN IF EXISTS "color";

  DO $migration$ BEGIN
    ALTER TABLE "tags" RENAME TO "event_tags";
  EXCEPTION WHEN undefined_table THEN NULL;
  END $migration$;

  DO $migration$ BEGIN
    ALTER TABLE "tags_locales" RENAME TO "event_tags_locales";
  EXCEPTION WHEN undefined_table THEN NULL;
  END $migration$;

  DO $migration$ BEGIN
    ALTER TABLE "events_rels" RENAME COLUMN "tags_id" TO "event_tags_id";
  EXCEPTION WHEN undefined_column THEN NULL;
  END $migration$;

  DO $migration$ BEGIN
    ALTER TABLE "_events_v_rels" RENAME COLUMN "tags_id" TO "event_tags_id";
  EXCEPTION WHEN undefined_column THEN NULL;
  END $migration$;

  DO $migration$ BEGIN
    ALTER TABLE "payload_locked_documents_rels" RENAME COLUMN "tags_id" TO "event_tags_id";
  EXCEPTION WHEN undefined_column THEN NULL;
  END $migration$;

  DO $migration$ BEGIN
    ALTER TABLE "events_rels" ADD CONSTRAINT "events_rels_event_tags_fk" FOREIGN KEY ("event_tags_id") REFERENCES "public"."event_tags"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION WHEN duplicate_object THEN NULL;
  END $migration$;

  DO $migration$ BEGIN
    ALTER TABLE "_events_v_rels" ADD CONSTRAINT "_events_v_rels_event_tags_fk" FOREIGN KEY ("event_tags_id") REFERENCES "public"."event_tags"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION WHEN duplicate_object THEN NULL;
  END $migration$;

  DO $migration$ BEGIN
    ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_event_tags_fk" FOREIGN KEY ("event_tags_id") REFERENCES "public"."event_tags"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION WHEN duplicate_object THEN NULL;
  END $migration$;

  DO $migration$ BEGIN
    ALTER TABLE "event_tags_locales" ADD CONSTRAINT "event_tags_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."event_tags"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION WHEN duplicate_object THEN NULL;
  END $migration$;
  `)
}
