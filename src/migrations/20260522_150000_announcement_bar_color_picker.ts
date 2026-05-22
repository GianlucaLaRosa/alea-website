import { MigrateDownArgs, MigrateUpArgs, sql } from '@payloadcms/db-vercel-postgres'

/**
 * Colore annuncio come hex (#…).
 * Idempotente: funziona sia con schema array (vecchio) sia piatto (dopo 090747 / 160000).
 */
export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
  DO $migration$ BEGIN
    IF EXISTS (
      SELECT 1 FROM information_schema.tables
      WHERE table_schema = 'public' AND table_name = 'announcement_bar_announcements'
    ) THEN
      ALTER TABLE "announcement_bar_announcements"
        ALTER COLUMN "background_color" TYPE varchar
        USING (
          CASE "background_color"::text
            WHEN 'accent' THEN '#c44133'
            WHEN 'primary' THEN '#171717'
            WHEN 'warning' THEN '#ca8a04'
            WHEN 'muted' THEN '#71717a'
            ELSE COALESCE("background_color"::text, '#6366f1')
          END
        );
      ALTER TABLE "announcement_bar_announcements"
        ALTER COLUMN "background_color" SET DEFAULT '#6366f1';
      UPDATE "announcement_bar_announcements"
      SET "background_color" = '#6366f1'
      WHERE "background_color" IS NULL OR trim("background_color") = '';
    END IF;
  EXCEPTION
    WHEN undefined_table THEN NULL;
    WHEN undefined_column THEN NULL;
    WHEN invalid_text_representation THEN NULL;
  END $migration$;

  DO $migration$ BEGIN
    IF EXISTS (
      SELECT 1 FROM information_schema.columns
      WHERE table_schema = 'public'
        AND table_name = 'announcement_bar'
        AND column_name = 'background_color'
    ) THEN
      ALTER TABLE "announcement_bar"
        ALTER COLUMN "background_color" SET DEFAULT '#6366f1';
      UPDATE "announcement_bar"
      SET "background_color" = '#6366f1'
      WHERE "background_color" IS NULL OR trim("background_color") = '';
    END IF;
  EXCEPTION
    WHEN undefined_column THEN NULL;
  END $migration$;

  DROP TYPE IF EXISTS "public"."enum_announcement_bar_announcements_background_color";
  `)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
  DO $migration$ BEGIN
    CREATE TYPE "public"."enum_announcement_bar_announcements_background_color" AS ENUM('accent', 'primary', 'warning', 'muted');
  EXCEPTION
    WHEN duplicate_object THEN NULL;
  END $migration$;

  DO $migration$ BEGIN
    IF EXISTS (
      SELECT 1 FROM information_schema.tables
      WHERE table_schema = 'public' AND table_name = 'announcement_bar_announcements'
    ) THEN
      ALTER TABLE "announcement_bar_announcements"
        ALTER COLUMN "background_color" TYPE "enum_announcement_bar_announcements_background_color"
        USING (
          CASE lower(trim("background_color"))
            WHEN '#c44133' THEN 'accent'::"enum_announcement_bar_announcements_background_color"
            WHEN '#171717' THEN 'primary'::"enum_announcement_bar_announcements_background_color"
            WHEN '#ca8a04' THEN 'warning'::"enum_announcement_bar_announcements_background_color"
            WHEN '#71717a' THEN 'muted'::"enum_announcement_bar_announcements_background_color"
            ELSE 'accent'::"enum_announcement_bar_announcements_background_color"
          END
        );
      ALTER TABLE "announcement_bar_announcements"
        ALTER COLUMN "background_color" SET DEFAULT 'accent';
    END IF;
  EXCEPTION WHEN undefined_table THEN NULL;
  END $migration$;
  `)
}
