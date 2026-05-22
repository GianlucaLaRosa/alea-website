import { MigrateDownArgs, MigrateUpArgs, sql } from '@payloadcms/db-vercel-postgres'

/**
 * Rimuove i default sui titoli eventi localizzati.
 * La rinomina event_tags → tags è in 20260522_120000_tags_rename_and_color (idempotente).
 */
export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
  DO $migration$ BEGIN
    ALTER TABLE "events_locales" ALTER COLUMN "title" DROP DEFAULT;
  EXCEPTION
    WHEN undefined_table THEN NULL;
    WHEN undefined_column THEN NULL;
  END $migration$;

  DO $migration$ BEGIN
    ALTER TABLE "_events_v_locales" ALTER COLUMN "version_title" DROP DEFAULT;
  EXCEPTION
    WHEN undefined_table THEN NULL;
    WHEN undefined_column THEN NULL;
  END $migration$;
  `)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
  DO $migration$ BEGIN
    ALTER TABLE "events_locales" ALTER COLUMN "title" SET DEFAULT 'Nuovo evento';
  EXCEPTION
    WHEN undefined_table THEN NULL;
    WHEN undefined_column THEN NULL;
  END $migration$;

  DO $migration$ BEGIN
    ALTER TABLE "_events_v_locales" ALTER COLUMN "version_title" SET DEFAULT 'Nuovo evento';
  EXCEPTION
    WHEN undefined_table THEN NULL;
    WHEN undefined_column THEN NULL;
  END $migration$;
  `)
}
