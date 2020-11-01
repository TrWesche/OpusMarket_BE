CREATE TABLE "users" (
  "id" SERIAL PRIMARY KEY,
  "username" text NOT NULL,
  "password" text NOT NULL,
  "first_name" text NOT NULL,
  "last_name" text NOT NULL,
  "email" text NOT NULL
);

CREATE TABLE "orders" (
  "id" SERIAL PRIMARY KEY,
  "user_id" int NOT NULL REFERENCES "users" ("id"),
  "status" text NOT NULL,
  "payment_id" text,
  "order_dt" TIMESTAMP WITH TIME ZONE
);

CREATE TABLE "merchants" (
  "id" SERIAL PRIMARY KEY,
  "login_name" text NOT NULL,
  "password" text NOT NULL,
  "display_name" text NOT NULL,
  "email" text NOT NULL
);

CREATE TABLE "products" (
  "id" SERIAL PRIMARY KEY,
  "merchant_id" int NOT NULL REFERENCES "merchants" ("id") ON DELETE CASCADE,
  "name" text NOT NULL,
  "description" text NOT NULL,
  "base_price" decimal NOT NULL
);

CREATE TABLE "events" (
  "id" SERIAL PRIMARY KEY,
  "title" text NOT NULL,
  "description" text NOT NULL,
  "link" text NOT NULL
);



CREATE TABLE "orders_products" (
  "id" SERIAL PRIMARY KEY,
  "order_id" int NOT NULL REFERENCES "orders" ("id"),
  "product_id" int NOT NULL REFERENCES "products" ("id")
);

CREATE TABLE "merchant_about" (
  "id" SERIAL PRIMARY KEY,
  "merchant_id" int NOT NULL REFERENCES "merchants" ("id") ON DELETE CASCADE,
  "headline" text,
  "about" text
);

CREATE TABLE "merchant_images" (
  "id" SERIAL PRIMARY KEY,
  "merchant_id" int NOT NULL REFERENCES "merchants" ("id") ON DELETE CASCADE,
  "url" text NOT NULL,
  "alt_text" text
);

CREATE TABLE "merchant_bios" (
  "id" SERIAL PRIMARY KEY,
  "merchant_id" int NOT NULL REFERENCES "merchants" ("id") ON DELETE CASCADE,
  "name" text NOT NULL,
  "bio" text NOT NULL,
  "images" int
);

CREATE TABLE "bio_images" (
  "id" SERIAL PRIMARY KEY,
  "bio_id" int NOT NULL REFERENCES "merchant_bios" ("id") ON DELETE CASCADE,
  "url" text NOT NULL,
  "alt_text" text
);


CREATE TABLE "event_merchants" (
  "id" SERIAL PRIMARY KEY,
  "event_id" int NOT NULL REFERENCES "events" ("id") ON DELETE CASCADE,
  "merchant_id" int NOT NULL REFERENCES "merchants" ("id") ON DELETE CASCADE
);

CREATE TABLE "event_images" (
  "id" SERIAL PRIMARY KEY,
  "event_id" int NOT NULL REFERENCES "events" ("id") ON DELETE CASCADE,
  "url" text NOT NULL,
  "alt_text" text
);


CREATE TABLE "product_images" (
  "id" SERIAL PRIMARY KEY,
  "product_id" int NOT NULL REFERENCES "products" ("id") ON DELETE CASCADE,
  "url" text NOT NULL,
  "alt_text" text
);

CREATE TABLE "product_categories" (
  "id" SERIAL PRIMARY KEY,
  "product_id" int NOT NULL REFERENCES "products" ("id") ON DELETE CASCADE,
  "title" text NOT NULL,
  "description" text NOT NULL
);

CREATE TABLE "product_promotions" (
  "id" SERIAL PRIMARY KEY,
  "product_id" int NOT NULL REFERENCES "products" ("id") ON DELETE CASCADE,
  "promotion_price" decimal NOT NULL
);

CREATE TABLE "product_coupons" (
  "id" SERIAL PRIMARY KEY,
  "product_id" int NOT NULL REFERENCES "products" ("id") ON DELETE CASCADE,
  "code" text NOT NULL,
  "pct_discount" decimal NOT NULL
);

CREATE TABLE "product_modifiers" (
  "id" SERIAL PRIMARY KEY,
  "product_id" int NOT NULL REFERENCES "products" ("id") ON DELETE CASCADE,
  "name" text NOT NULL,
  "description" text NOT NULL
);