import { MigrateDownArgs, MigrateUpArgs, sql } from '@payloadcms/db-vercel-postgres'

/** Backfill ruoli: editor → social-specialist (dopo commit dei nuovi valori enum). */
export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    UPDATE "users_roles"
    SET "value" = 'social-specialist'::"enum_users_roles"
    WHERE "value" = 'editor'::"enum_users_roles";
  `)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    UPDATE "users_roles"
    SET "value" = 'editor'::"enum_users_roles"
    WHERE "value" = 'social-specialist'::"enum_users_roles";
  `)
}
