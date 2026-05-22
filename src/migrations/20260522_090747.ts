import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-vercel-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TABLE "announcement_bar_locales" (
  	"message" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  DROP TABLE "announcement_bar_announcements" CASCADE;
  DROP TABLE "announcement_bar_announcements_locales" CASCADE;
  ALTER TABLE "announcement_bar" ADD COLUMN "enabled" boolean DEFAULT false;
  ALTER TABLE "announcement_bar" ADD COLUMN "background_color" varchar DEFAULT '#6366f1';
  ALTER TABLE "announcement_bar" ADD COLUMN "start_at" timestamp(3) with time zone;
  ALTER TABLE "announcement_bar" ADD COLUMN "end_at" timestamp(3) with time zone;
  ALTER TABLE "announcement_bar" ADD COLUMN "campaign_id" varchar;
  ALTER TABLE "announcement_bar_locales" ADD CONSTRAINT "announcement_bar_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."announcement_bar"("id") ON DELETE cascade ON UPDATE no action;
  CREATE UNIQUE INDEX "announcement_bar_locales_locale_parent_id_unique" ON "announcement_bar_locales" USING btree ("_locale","_parent_id");
  DROP TYPE "public"."enum_announcement_bar_announcements_background_color";`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_announcement_bar_announcements_background_color" AS ENUM('accent', 'primary', 'warning', 'muted');
  CREATE TABLE "announcement_bar_announcements" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"campaign_id" varchar NOT NULL,
  	"background_color" "enum_announcement_bar_announcements_background_color" DEFAULT 'accent' NOT NULL,
  	"start_at" timestamp(3) with time zone NOT NULL,
  	"end_at" timestamp(3) with time zone NOT NULL,
  	"enabled" boolean DEFAULT true
  );
  
  CREATE TABLE "announcement_bar_announcements_locales" (
  	"message" varchar NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  DROP TABLE "announcement_bar_locales" CASCADE;
  ALTER TABLE "announcement_bar_announcements" ADD CONSTRAINT "announcement_bar_announcements_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."announcement_bar"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "announcement_bar_announcements_locales" ADD CONSTRAINT "announcement_bar_announcements_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."announcement_bar_announcements"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "announcement_bar_announcements_order_idx" ON "announcement_bar_announcements" USING btree ("_order");
  CREATE INDEX "announcement_bar_announcements_parent_id_idx" ON "announcement_bar_announcements" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "announcement_bar_announcements_locales_locale_parent_id_uniq" ON "announcement_bar_announcements_locales" USING btree ("_locale","_parent_id");
  ALTER TABLE "announcement_bar" DROP COLUMN "enabled";
  ALTER TABLE "announcement_bar" DROP COLUMN "background_color";
  ALTER TABLE "announcement_bar" DROP COLUMN "start_at";
  ALTER TABLE "announcement_bar" DROP COLUMN "end_at";
  ALTER TABLE "announcement_bar" DROP COLUMN "campaign_id";`)
}
