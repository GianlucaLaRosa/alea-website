import { MigrateDownArgs, MigrateUpArgs, sql } from '@payloadcms/db-vercel-postgres'

/**
 * Assegna ruolo `admin` agli utenti esistenti.
 * Lo schema (enum + tabella users_roles) è creato da 20260522_074611.
 */
export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
  INSERT INTO "users_roles" ("order", "parent_id", "value")
  SELECT 1, u.id, 'admin'::"enum_users_roles"
  FROM "users" u
  WHERE NOT EXISTS (
    SELECT 1 FROM "users_roles" ur WHERE ur."parent_id" = u.id
  );
  `)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
  DELETE FROM "users_roles";
  `)
}
