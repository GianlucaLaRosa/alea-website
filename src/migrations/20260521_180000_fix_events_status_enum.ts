import { MigrateDownArgs, MigrateUpArgs, sql } from '@payloadcms/db-vercel-postgres'

/**
 * Risolve conflitto: Payload usa `enum_events_status` per `_status` (draft/published).
 * Lo stato evento (scheduled/sold_out/cancelled) diventa `enum_events_event_status`.
 */
export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
  DO $migration$ BEGIN
    ALTER TYPE "public"."enum_events_status" RENAME TO "enum_events_event_status";
  EXCEPTION
    WHEN undefined_object THEN
      CREATE TYPE "public"."enum_events_event_status" AS ENUM('scheduled', 'sold_out', 'cancelled');
  END $migration$;

  DO $migration$ BEGIN
    CREATE TYPE "public"."enum_events_status" AS ENUM('draft', 'published');
  EXCEPTION
    WHEN duplicate_object THEN NULL;
  END $migration$;

  DO $migration$ BEGIN
    ALTER TABLE "events" ALTER COLUMN "_status" DROP DEFAULT;
    ALTER TABLE "events" ALTER COLUMN "_status" TYPE "enum_events_status" USING (
      CASE "_status"::text
        WHEN 'draft' THEN 'draft'::"enum_events_status"
        ELSE 'published'::"enum_events_status"
      END
    );
    ALTER TABLE "events" ALTER COLUMN "_status" SET DEFAULT 'draft'::"enum_events_status";
  EXCEPTION
    WHEN undefined_column THEN NULL;
    WHEN undefined_object THEN NULL;
  END $migration$;

  DO $migration$ BEGIN
    DROP TYPE "public"."enum_events_publish_status";
  EXCEPTION
    WHEN undefined_object THEN NULL;
    WHEN dependent_objects_still_exist THEN NULL;
  END $migration$;
  `)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
  DO $migration$ BEGIN
    CREATE TYPE "public"."enum_events_publish_status" AS ENUM('draft', 'published');
  EXCEPTION
    WHEN duplicate_object THEN NULL;
  END $migration$;

  DO $migration$ BEGIN
    ALTER TABLE "events" ALTER COLUMN "_status" TYPE "enum_events_publish_status" USING ("_status"::text::"enum_events_publish_status");
  EXCEPTION
    WHEN undefined_object THEN NULL;
  END $migration$;

  DO $migration$ BEGIN
    DROP TYPE "public"."enum_events_status";
  EXCEPTION
    WHEN undefined_object THEN NULL;
  END $migration$;

  DO $migration$ BEGIN
    ALTER TYPE "public"."enum_events_event_status" RENAME TO "enum_events_status";
  EXCEPTION
    WHEN undefined_object THEN NULL;
  END $migration$;
  `)
}
