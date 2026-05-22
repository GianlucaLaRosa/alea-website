import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-vercel-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TABLE "tags_locales" (
  	"title" varchar NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  ALTER TABLE "event_tags_locales" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "event_tags_locales" CASCADE;
  ALTER TABLE "event_tags" RENAME TO "tags";
  ALTER TABLE "events_rels" RENAME COLUMN "event_tags_id" TO "tags_id";
  ALTER TABLE "_events_v_rels" RENAME COLUMN "event_tags_id" TO "tags_id";
  ALTER TABLE "payload_locked_documents_rels" RENAME COLUMN "event_tags_id" TO "tags_id";
  ALTER TABLE "events_rels" DROP CONSTRAINT "events_rels_event_tags_fk";
  
  ALTER TABLE "_events_v_rels" DROP CONSTRAINT "_events_v_rels_event_tags_fk";
  
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_event_tags_fk";
  
  DROP INDEX "event_tags_slug_idx";
  DROP INDEX "event_tags_updated_at_idx";
  DROP INDEX "event_tags_created_at_idx";
  DROP INDEX "events_rels_event_tags_id_idx";
  DROP INDEX "_events_v_rels_event_tags_id_idx";
  DROP INDEX "payload_locked_documents_rels_event_tags_id_idx";
  ALTER TABLE "events_locales" ALTER COLUMN "title" DROP DEFAULT;
  ALTER TABLE "_events_v_locales" ALTER COLUMN "version_title" DROP DEFAULT;
  ALTER TABLE "tags" ADD COLUMN "color" varchar DEFAULT '#6366f1' NOT NULL;
  ALTER TABLE "tags_locales" ADD CONSTRAINT "tags_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."tags"("id") ON DELETE cascade ON UPDATE no action;
  CREATE UNIQUE INDEX "tags_locales_locale_parent_id_unique" ON "tags_locales" USING btree ("_locale","_parent_id");
  ALTER TABLE "events_rels" ADD CONSTRAINT "events_rels_tags_fk" FOREIGN KEY ("tags_id") REFERENCES "public"."tags"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_events_v_rels" ADD CONSTRAINT "_events_v_rels_tags_fk" FOREIGN KEY ("tags_id") REFERENCES "public"."tags"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_tags_fk" FOREIGN KEY ("tags_id") REFERENCES "public"."tags"("id") ON DELETE cascade ON UPDATE no action;
  CREATE UNIQUE INDEX "tags_slug_idx" ON "tags" USING btree ("slug");
  CREATE INDEX "tags_updated_at_idx" ON "tags" USING btree ("updated_at");
  CREATE INDEX "tags_created_at_idx" ON "tags" USING btree ("created_at");
  CREATE INDEX "events_rels_tags_id_idx" ON "events_rels" USING btree ("tags_id");
  CREATE INDEX "_events_v_rels_tags_id_idx" ON "_events_v_rels" USING btree ("tags_id");
  CREATE INDEX "payload_locked_documents_rels_tags_id_idx" ON "payload_locked_documents_rels" USING btree ("tags_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   CREATE TABLE "event_tags" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"generate_slug" boolean DEFAULT true,
  	"slug" varchar NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "event_tags_locales" (
  	"title" varchar NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  ALTER TABLE "tags" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "tags_locales" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "tags" CASCADE;
  DROP TABLE "tags_locales" CASCADE;
  ALTER TABLE "events_rels" DROP CONSTRAINT "events_rels_tags_fk";
  
  ALTER TABLE "_events_v_rels" DROP CONSTRAINT "_events_v_rels_tags_fk";
  
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_tags_fk";
  
  DROP INDEX "events_rels_tags_id_idx";
  DROP INDEX "_events_v_rels_tags_id_idx";
  DROP INDEX "payload_locked_documents_rels_tags_id_idx";
  ALTER TABLE "events_locales" ALTER COLUMN "title" SET DEFAULT 'Nuovo evento';
  ALTER TABLE "_events_v_locales" ALTER COLUMN "version_title" SET DEFAULT 'Nuovo evento';
  ALTER TABLE "events_rels" ADD COLUMN "event_tags_id" integer;
  ALTER TABLE "_events_v_rels" ADD COLUMN "event_tags_id" integer;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "event_tags_id" integer;
  ALTER TABLE "event_tags_locales" ADD CONSTRAINT "event_tags_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."event_tags"("id") ON DELETE cascade ON UPDATE no action;
  CREATE UNIQUE INDEX "event_tags_slug_idx" ON "event_tags" USING btree ("slug");
  CREATE INDEX "event_tags_updated_at_idx" ON "event_tags" USING btree ("updated_at");
  CREATE INDEX "event_tags_created_at_idx" ON "event_tags" USING btree ("created_at");
  CREATE UNIQUE INDEX "event_tags_locales_locale_parent_id_unique" ON "event_tags_locales" USING btree ("_locale","_parent_id");
  ALTER TABLE "events_rels" ADD CONSTRAINT "events_rels_event_tags_fk" FOREIGN KEY ("event_tags_id") REFERENCES "public"."event_tags"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_events_v_rels" ADD CONSTRAINT "_events_v_rels_event_tags_fk" FOREIGN KEY ("event_tags_id") REFERENCES "public"."event_tags"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_event_tags_fk" FOREIGN KEY ("event_tags_id") REFERENCES "public"."event_tags"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "events_rels_event_tags_id_idx" ON "events_rels" USING btree ("event_tags_id");
  CREATE INDEX "_events_v_rels_event_tags_id_idx" ON "_events_v_rels" USING btree ("event_tags_id");
  CREATE INDEX "payload_locked_documents_rels_event_tags_id_idx" ON "payload_locked_documents_rels" USING btree ("event_tags_id");
  ALTER TABLE "events_rels" DROP COLUMN "tags_id";
  ALTER TABLE "_events_v_rels" DROP COLUMN "tags_id";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "tags_id";`)
}
