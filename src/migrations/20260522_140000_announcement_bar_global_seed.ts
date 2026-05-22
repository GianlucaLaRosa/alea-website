import { MigrateDownArgs, MigrateUpArgs, sql } from '@payloadcms/db-vercel-postgres'

/** Payload globals need a parent row before the admin edit view can load. */
export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
  INSERT INTO "announcement_bar" ("created_at", "updated_at")
  SELECT NOW(), NOW()
  WHERE NOT EXISTS (SELECT 1 FROM "announcement_bar" LIMIT 1);
  `)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
  DELETE FROM "announcement_bar" WHERE "id" = (
    SELECT "id" FROM "announcement_bar" ORDER BY "id" ASC LIMIT 1
  );
  `)
}
