import { MigrateDownArgs, MigrateUpArgs, sql } from '@payloadcms/db-vercel-postgres'

/**
 * Nuovi valori enum ruoli + colonna scope su media.
 * Il backfill editor → social-specialist è in 20260523_170001 (PG richiede commit tra ADD VALUE e uso).
 */
export async function up({ db }: MigrateUpArgs): Promise<void> {
  const newRoles = ['gdt-specialist', 'gdr-specialist', 'wargame-specialist', 'social-specialist']

  for (const role of newRoles) {
    await db.execute(sql.raw(`
      DO $migration$ BEGIN
        ALTER TYPE "public"."enum_users_roles" ADD VALUE '${role}';
      EXCEPTION
        WHEN duplicate_object THEN NULL;
      END $migration$;
    `))
  }

  await db.execute(sql`
    DO $migration$ BEGIN
      CREATE TYPE "public"."enum_media_scope" AS ENUM('system', 'games', 'events', 'gdr', 'wargame');
    EXCEPTION
      WHEN duplicate_object THEN NULL;
    END $migration$;

    ALTER TABLE "media" ADD COLUMN IF NOT EXISTS "scope" "enum_media_scope" DEFAULT 'system' NOT NULL;
  `)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "media" DROP COLUMN IF EXISTS "scope";
    DROP TYPE IF EXISTS "public"."enum_media_scope";
  `)
}
