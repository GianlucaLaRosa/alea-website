import { MigrateDownArgs, MigrateUpArgs, sql } from '@payloadcms/db-vercel-postgres'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
  ALTER TABLE "events" ADD COLUMN IF NOT EXISTS "search_text" varchar;
  ALTER TABLE "_events_v" ADD COLUMN IF NOT EXISTS "version_search_text" varchar;

  CREATE INDEX IF NOT EXISTS "events_search_text_idx" ON "events" USING btree ("search_text");

  UPDATE "events" e
  SET "search_text" = lower(trim(concat_ws(
    ' ',
    coalesce(e."title", ''),
    coalesce(e."address", ''),
    coalesce((
      SELECT string_agg(et."title", ' ')
      FROM "events_rels" er
      INNER JOIN "event_tags" et ON et."id" = er."event_tags_id"
      WHERE er."parent_id" = e."id" AND er."path" = 'tags'
    ), '')
  )))
  WHERE "search_text" IS NULL OR "search_text" = '';

  UPDATE "_events_v" v
  SET "version_search_text" = e."search_text"
  FROM "events" e
  WHERE v."parent_id" = e."id"
    AND e."search_text" IS NOT NULL
    AND e."search_text" <> ''
    AND (v."version_search_text" IS NULL OR v."version_search_text" = '');

  UPDATE "_events_v" v
  SET "version_search_text" = lower(trim(concat_ws(
    ' ',
    coalesce(v."version_title", ''),
    coalesce(v."version_address", ''),
    coalesce((
      SELECT string_agg(et."title", ' ')
      FROM "_events_v_rels" er
      INNER JOIN "event_tags" et ON et."id" = er."event_tags_id"
      WHERE er."parent_id" = v."id" AND er."path" = 'tags'
    ), '')
  )))
  WHERE "version_search_text" IS NULL OR "version_search_text" = '';
  `)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
  DROP INDEX IF EXISTS "events_search_text_idx";
  ALTER TABLE "_events_v" DROP COLUMN IF EXISTS "version_search_text";
  ALTER TABLE "events" DROP COLUMN IF EXISTS "search_text";
  `)
}
