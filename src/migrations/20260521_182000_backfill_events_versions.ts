import { MigrateDownArgs, MigrateUpArgs, sql } from '@payloadcms/db-vercel-postgres'

/**
 * Eventi creati prima delle bozze non avevano righe in `_events_v`.
 * Senza snapshot versione, la lista admin (vista bozze) risulta vuota.
 */
export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
  INSERT INTO "_events_v" (
    "parent_id",
    "version_title",
    "version_cover_image_id",
    "version_start_at",
    "version_end_at",
    "version_address",
    "version_latitude",
    "version_longitude",
    "version_description",
    "version_ticket_url",
    "version_ticket_label",
    "version_hidden",
    "version_featured",
    "version_status",
    "version_meta_title",
    "version_meta_image_id",
    "version_meta_description",
    "version_published_at",
    "version_generate_slug",
    "version_slug",
    "version_updated_at",
    "version_created_at",
    "version__status",
    "latest",
    "autosave"
  )
  SELECT
    e."id",
    e."title",
    e."cover_image_id",
    e."start_at",
    e."end_at",
    e."address",
    e."latitude",
    e."longitude",
    e."description",
    e."ticket_url",
    e."ticket_label",
    e."hidden",
    e."featured",
    e."status"::text::"enum_events_event_status",
    e."meta_title",
    e."meta_image_id",
    e."meta_description",
    e."published_at",
    e."generate_slug",
    e."slug",
    e."updated_at",
    e."created_at",
    e."_status"::text::"enum__events_v_version_status",
    true,
    false
  FROM "events" e
  WHERE NOT EXISTS (
    SELECT 1 FROM "_events_v" v WHERE v."parent_id" = e."id"
  );

  INSERT INTO "_events_v_rels" ("order", "parent_id", "path", "event_tags_id", "media_id")
  SELECT
    er."order",
    v."id",
    er."path",
    er."event_tags_id",
    er."media_id"
  FROM "events_rels" er
  INNER JOIN "_events_v" v ON v."parent_id" = er."parent_id" AND v."latest" = true
  WHERE NOT EXISTS (
    SELECT 1 FROM "_events_v_rels" vr
    WHERE vr."parent_id" = v."id" AND vr."path" = er."path" AND vr."order" = er."order"
  );

  INSERT INTO "_events_v_version_links" ("_order", "_parent_id", "id", "label", "url")
  SELECT
    el."_order",
    v."id",
    el."id",
    el."label",
    el."url"
  FROM "events_links" el
  INNER JOIN "_events_v" v ON v."parent_id" = el."_parent_id" AND v."latest" = true
  WHERE NOT EXISTS (
    SELECT 1 FROM "_events_v_version_links" vl
    WHERE vl."_parent_id" = v."id" AND vl."id" = el."id"
  );
  `)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
  DELETE FROM "_events_v_version_links" vl
  USING "_events_v" v
  WHERE vl."_parent_id" = v."id" AND v."latest" = true;

  DELETE FROM "_events_v_rels" vr
  USING "_events_v" v
  WHERE vr."parent_id" = v."id" AND v."latest" = true;

  DELETE FROM "_events_v" WHERE "latest" = true;
  `)
}
