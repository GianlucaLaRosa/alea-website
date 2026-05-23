import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-vercel-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_tags_scope" AS ENUM('all', 'events', 'games');
  CREATE TABLE "games_bgg_taxonomy" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL
  );
  
  CREATE TABLE "games_expansions" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"bgg_id" numeric,
  	"owned" boolean DEFAULT false
  );
  
  CREATE TABLE "games" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"bgg_id" numeric NOT NULL,
  	"bgg_url" varchar,
  	"generate_slug" boolean DEFAULT true,
  	"slug" varchar NOT NULL,
  	"published" boolean DEFAULT false,
  	"import_warnings" jsonb,
  	"min_players" numeric,
  	"max_players" numeric,
  	"min_play_time" numeric,
  	"max_play_time" numeric,
  	"card_image_url" varchar,
  	"card_image_id" integer,
  	"detail_image_url" varchar,
  	"detail_image_id" integer,
  	"hero_image_url" varchar,
  	"hero_image_id" integer,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "games_locales" (
  	"title" varchar NOT NULL,
  	"short_description" varchar,
  	"description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "games_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"tags_id" integer
  );
  
  ALTER TABLE "tags" ADD COLUMN "scope" "enum_tags_scope" DEFAULT 'all' NOT NULL;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "games_id" integer;
  ALTER TABLE "games_bgg_taxonomy" ADD CONSTRAINT "games_bgg_taxonomy_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."games"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "games_expansions" ADD CONSTRAINT "games_expansions_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."games"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "games" ADD CONSTRAINT "games_card_image_id_media_id_fk" FOREIGN KEY ("card_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "games" ADD CONSTRAINT "games_detail_image_id_media_id_fk" FOREIGN KEY ("detail_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "games" ADD CONSTRAINT "games_hero_image_id_media_id_fk" FOREIGN KEY ("hero_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "games_locales" ADD CONSTRAINT "games_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."games"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "games_rels" ADD CONSTRAINT "games_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."games"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "games_rels" ADD CONSTRAINT "games_rels_tags_fk" FOREIGN KEY ("tags_id") REFERENCES "public"."tags"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "games_bgg_taxonomy_order_idx" ON "games_bgg_taxonomy" USING btree ("_order");
  CREATE INDEX "games_bgg_taxonomy_parent_id_idx" ON "games_bgg_taxonomy" USING btree ("_parent_id");
  CREATE INDEX "games_expansions_order_idx" ON "games_expansions" USING btree ("_order");
  CREATE INDEX "games_expansions_parent_id_idx" ON "games_expansions" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "games_bgg_id_idx" ON "games" USING btree ("bgg_id");
  CREATE UNIQUE INDEX "games_slug_idx" ON "games" USING btree ("slug");
  CREATE INDEX "games_card_image_idx" ON "games" USING btree ("card_image_id");
  CREATE INDEX "games_detail_image_idx" ON "games" USING btree ("detail_image_id");
  CREATE INDEX "games_hero_image_idx" ON "games" USING btree ("hero_image_id");
  CREATE INDEX "games_updated_at_idx" ON "games" USING btree ("updated_at");
  CREATE INDEX "games_created_at_idx" ON "games" USING btree ("created_at");
  CREATE UNIQUE INDEX "games_locales_locale_parent_id_unique" ON "games_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "games_rels_order_idx" ON "games_rels" USING btree ("order");
  CREATE INDEX "games_rels_parent_idx" ON "games_rels" USING btree ("parent_id");
  CREATE INDEX "games_rels_path_idx" ON "games_rels" USING btree ("path");
  CREATE INDEX "games_rels_tags_id_idx" ON "games_rels" USING btree ("tags_id");
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_games_fk" FOREIGN KEY ("games_id") REFERENCES "public"."games"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "payload_locked_documents_rels_games_id_idx" ON "payload_locked_documents_rels" USING btree ("games_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "games_bgg_taxonomy" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "games_expansions" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "games" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "games_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "games_rels" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "games_bgg_taxonomy" CASCADE;
  DROP TABLE "games_expansions" CASCADE;
  DROP TABLE "games" CASCADE;
  DROP TABLE "games_locales" CASCADE;
  DROP TABLE "games_rels" CASCADE;
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_games_fk";
  
  DROP INDEX "payload_locked_documents_rels_games_id_idx";
  ALTER TABLE "tags" DROP COLUMN "scope";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "games_id";
  DROP TYPE "public"."enum_tags_scope";`)
}
