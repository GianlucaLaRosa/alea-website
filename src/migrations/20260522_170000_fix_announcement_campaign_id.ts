import { MigrateDownArgs, MigrateUpArgs, sql } from '@payloadcms/db-vercel-postgres'

/** Sostituisce campaign_id invalidi (es. la stringa "id" dal bug admin) con timestamp ms. */
export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
  UPDATE "announcement_bar"
  SET "campaign_id" = (floor(extract(epoch from clock_timestamp()) * 1000))::varchar
  WHERE "campaign_id" IS NULL
    OR trim("campaign_id") = ''
    OR trim("campaign_id") = 'id'
    OR "campaign_id" !~ '^[0-9]+$';
  `)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  // Irreversibile senza backup dei valori precedenti
  await db.execute(sql`SELECT 1`)
}
