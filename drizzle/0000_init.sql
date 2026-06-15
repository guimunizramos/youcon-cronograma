CREATE TABLE IF NOT EXISTS "categories" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "key" text NOT NULL UNIQUE,
  "label" text NOT NULL,
  "color" text NOT NULL,
  "order" integer NOT NULL
);

CREATE TABLE IF NOT EXISTS "items" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "date" date NOT NULL,
  "category_id" uuid NOT NULL REFERENCES "categories"("id"),
  "title" text NOT NULL,
  "notes" text,
  "is_highlight" boolean NOT NULL DEFAULT false,
  "order" integer DEFAULT 0
);
