import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_fragrance_collections_gender" AS ENUM('her', 'him');
  CREATE TYPE "public"."enum_header_nav_items_mega_menu_columns_source" AS ENUM('her', 'him', 'all', 'custom');
  CREATE TABLE "fragrance_collections" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"_order" varchar,
  	"name" varchar NOT NULL,
  	"gender" "enum_fragrance_collections_gender" NOT NULL,
  	"summary" varchar NOT NULL,
  	"description" varchar NOT NULL,
  	"image_id" integer NOT NULL,
  	"placeholder" boolean,
  	"generate_slug" boolean DEFAULT true,
  	"slug" varchar NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "header_nav_items_mega_menu_columns_links" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"url" varchar
  );
  
  CREATE TABLE "header_nav_items_mega_menu_columns" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"url" varchar,
  	"source" "enum_header_nav_items_mega_menu_columns_source" DEFAULT 'custom'
  );
  
  ALTER TABLE "header_rels" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "header_rels" CASCADE;
  ALTER TABLE "media" ADD COLUMN "prefix" varchar DEFAULT '';
  ALTER TABLE "media" ADD COLUMN "_objectkey" varchar;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "fragrance_collections_id" integer;
  -- Old template menu items can't fill the new required columns; pnpm seed:shop recreates the menu
  DELETE FROM "header_nav_items";
  ALTER TABLE "header_nav_items" ADD COLUMN "label" varchar NOT NULL;
  ALTER TABLE "header_nav_items" ADD COLUMN "url" varchar NOT NULL;
  ALTER TABLE "header_nav_items" ADD COLUMN "has_mega_menu" boolean;
  ALTER TABLE "header_nav_items" ADD COLUMN "mega_menu_featured_collection_id" integer;
  ALTER TABLE "header_nav_items" ADD COLUMN "mega_menu_featured_title" varchar;
  ALTER TABLE "header_nav_items" ADD COLUMN "mega_menu_featured_text" varchar;
  ALTER TABLE "header_nav_items" ADD COLUMN "mega_menu_featured_image_id" integer;
  ALTER TABLE "fragrance_collections" ADD CONSTRAINT "fragrance_collections_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "header_nav_items_mega_menu_columns_links" ADD CONSTRAINT "header_nav_items_mega_menu_columns_links_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."header_nav_items_mega_menu_columns"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "header_nav_items_mega_menu_columns" ADD CONSTRAINT "header_nav_items_mega_menu_columns_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."header_nav_items"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "fragrance_collections__order_idx" ON "fragrance_collections" USING btree ("_order");
  CREATE INDEX "fragrance_collections_image_idx" ON "fragrance_collections" USING btree ("image_id");
  CREATE UNIQUE INDEX "fragrance_collections_slug_idx" ON "fragrance_collections" USING btree ("slug");
  CREATE INDEX "fragrance_collections_updated_at_idx" ON "fragrance_collections" USING btree ("updated_at");
  CREATE INDEX "fragrance_collections_created_at_idx" ON "fragrance_collections" USING btree ("created_at");
  CREATE INDEX "header_nav_items_mega_menu_columns_links_order_idx" ON "header_nav_items_mega_menu_columns_links" USING btree ("_order");
  CREATE INDEX "header_nav_items_mega_menu_columns_links_parent_id_idx" ON "header_nav_items_mega_menu_columns_links" USING btree ("_parent_id");
  CREATE INDEX "header_nav_items_mega_menu_columns_order_idx" ON "header_nav_items_mega_menu_columns" USING btree ("_order");
  CREATE INDEX "header_nav_items_mega_menu_columns_parent_id_idx" ON "header_nav_items_mega_menu_columns" USING btree ("_parent_id");
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_fragrance_collections_fk" FOREIGN KEY ("fragrance_collections_id") REFERENCES "public"."fragrance_collections"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "header_nav_items" ADD CONSTRAINT "header_nav_items_mega_menu_featured_collection_id_fragrance_collections_id_fk" FOREIGN KEY ("mega_menu_featured_collection_id") REFERENCES "public"."fragrance_collections"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "header_nav_items" ADD CONSTRAINT "header_nav_items_mega_menu_featured_image_id_media_id_fk" FOREIGN KEY ("mega_menu_featured_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  CREATE INDEX "payload_locked_documents_rels_fragrance_collections_id_idx" ON "payload_locked_documents_rels" USING btree ("fragrance_collections_id");
  CREATE INDEX "header_nav_items_mega_menu_featured_mega_menu_featured_c_idx" ON "header_nav_items" USING btree ("mega_menu_featured_collection_id");
  CREATE INDEX "header_nav_items_mega_menu_featured_mega_menu_featured_i_idx" ON "header_nav_items" USING btree ("mega_menu_featured_image_id");
  ALTER TABLE "header_nav_items" DROP COLUMN "link_type";
  ALTER TABLE "header_nav_items" DROP COLUMN "link_new_tab";
  ALTER TABLE "header_nav_items" DROP COLUMN "link_url";
  ALTER TABLE "header_nav_items" DROP COLUMN "link_label";
  DROP TYPE "public"."enum_header_nav_items_link_type";`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_header_nav_items_link_type" AS ENUM('reference', 'custom');
  CREATE TABLE "header_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"pages_id" integer,
  	"posts_id" integer
  );
  
  ALTER TABLE "fragrance_collections" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "header_nav_items_mega_menu_columns_links" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "header_nav_items_mega_menu_columns" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "fragrance_collections" CASCADE;
  DROP TABLE "header_nav_items_mega_menu_columns_links" CASCADE;
  DROP TABLE "header_nav_items_mega_menu_columns" CASCADE;
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_fragrance_collections_fk";
  
  ALTER TABLE "header_nav_items" DROP CONSTRAINT "header_nav_items_mega_menu_featured_collection_id_fragrance_collections_id_fk";
  
  ALTER TABLE "header_nav_items" DROP CONSTRAINT "header_nav_items_mega_menu_featured_image_id_media_id_fk";
  
  DROP INDEX "payload_locked_documents_rels_fragrance_collections_id_idx";
  DROP INDEX "header_nav_items_mega_menu_featured_mega_menu_featured_c_idx";
  DROP INDEX "header_nav_items_mega_menu_featured_mega_menu_featured_i_idx";
  ALTER TABLE "header_nav_items" ADD COLUMN "link_type" "enum_header_nav_items_link_type" DEFAULT 'reference';
  ALTER TABLE "header_nav_items" ADD COLUMN "link_new_tab" boolean;
  ALTER TABLE "header_nav_items" ADD COLUMN "link_url" varchar;
  ALTER TABLE "header_nav_items" ADD COLUMN "link_label" varchar NOT NULL;
  ALTER TABLE "header_rels" ADD CONSTRAINT "header_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."header"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "header_rels" ADD CONSTRAINT "header_rels_pages_fk" FOREIGN KEY ("pages_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "header_rels" ADD CONSTRAINT "header_rels_posts_fk" FOREIGN KEY ("posts_id") REFERENCES "public"."posts"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "header_rels_order_idx" ON "header_rels" USING btree ("order");
  CREATE INDEX "header_rels_parent_idx" ON "header_rels" USING btree ("parent_id");
  CREATE INDEX "header_rels_path_idx" ON "header_rels" USING btree ("path");
  CREATE INDEX "header_rels_pages_id_idx" ON "header_rels" USING btree ("pages_id");
  CREATE INDEX "header_rels_posts_id_idx" ON "header_rels" USING btree ("posts_id");
  ALTER TABLE "media" DROP COLUMN "prefix";
  ALTER TABLE "media" DROP COLUMN "_objectkey";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "fragrance_collections_id";
  ALTER TABLE "header_nav_items" DROP COLUMN "label";
  ALTER TABLE "header_nav_items" DROP COLUMN "url";
  ALTER TABLE "header_nav_items" DROP COLUMN "has_mega_menu";
  ALTER TABLE "header_nav_items" DROP COLUMN "mega_menu_featured_collection_id";
  ALTER TABLE "header_nav_items" DROP COLUMN "mega_menu_featured_title";
  ALTER TABLE "header_nav_items" DROP COLUMN "mega_menu_featured_text";
  ALTER TABLE "header_nav_items" DROP COLUMN "mega_menu_featured_image_id";
  DROP TYPE "public"."enum_fragrance_collections_gender";
  DROP TYPE "public"."enum_header_nav_items_mega_menu_columns_source";`)
}
