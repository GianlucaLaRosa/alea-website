import { MigrateDownArgs, MigrateUpArgs, sql } from '@payloadcms/db-vercel-postgres'

/**
 * Allinea `_events_v_version_links.id` a serial (come le altre tabelle version_*).
 * La migrazione 170000 aveva creato `id varchar`, ma Payload inserisce con DEFAULT serial.
 */
export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
  DO $migration$ BEGIN
    IF EXISTS (
      SELECT 1
      FROM information_schema.columns
      WHERE table_schema = 'public'
        AND table_name = '_events_v_version_links'
        AND column_name = 'id'
        AND data_type = 'character varying'
    ) THEN
      UPDATE "_events_v_version_links"
      SET "_uuid" = "id"
      WHERE "_uuid" IS NULL OR "_uuid" = '';

      ALTER TABLE "_events_v_version_links" DROP CONSTRAINT IF EXISTS "_events_v_version_links_pkey";
      ALTER TABLE "_events_v_version_links" DROP COLUMN "id";
      ALTER TABLE "_events_v_version_links" ADD COLUMN "id" serial PRIMARY KEY NOT NULL;
    END IF;
  END $migration$;
  `)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
  DO $migration$ BEGIN
    IF EXISTS (
      SELECT 1
      FROM information_schema.columns
      WHERE table_schema = 'public'
        AND table_name = '_events_v_version_links'
        AND column_name = 'id'
        AND data_type = 'integer'
    ) THEN
      ALTER TABLE "_events_v_version_links" DROP CONSTRAINT IF EXISTS "_events_v_version_links_pkey";
      ALTER TABLE "_events_v_version_links" DROP COLUMN "id";
      ALTER TABLE "_events_v_version_links" ADD COLUMN "id" varchar PRIMARY KEY NOT NULL;
    END IF;
  END $migration$;
  `)
}
