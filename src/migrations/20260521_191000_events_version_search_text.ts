import { MigrateDownArgs, MigrateUpArgs, sql } from '@payloadcms/db-vercel-postgres'

/** Colonna versioni mancante dopo search_text su events (admin lista bozze). */
export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
  ALTER TABLE "_events_v" ADD COLUMN IF NOT EXISTS "version_search_text" varchar;

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
  ALTER TABLE "_events_v" DROP COLUMN IF EXISTS "version_search_text";
  `)
}
