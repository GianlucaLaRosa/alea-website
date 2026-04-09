import { MigrateDownArgs, MigrateUpArgs, sql } from '@payloadcms/db-vercel-postgres'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "header" ADD COLUMN "logo_id" integer;
  ALTER TABLE "header" ADD CONSTRAINT "header_logo_id_media_id_fk" FOREIGN KEY ("logo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  CREATE INDEX "header_logo_idx" ON "header" USING btree ("logo_id");
  ALTER TABLE "header_nav_items" ADD COLUMN "reference_anchor" varchar;
  `)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "header_nav_items" DROP COLUMN "reference_anchor";
  DROP INDEX "header_logo_idx";
  ALTER TABLE "header" DROP CONSTRAINT "header_logo_id_media_id_fk";
  ALTER TABLE "header" DROP COLUMN "logo_id";
  `)
}
