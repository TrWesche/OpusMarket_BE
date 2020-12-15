SET TIME ZONE 'UTC';

CREATE TABLE "users" (
  "id" SERIAL PRIMARY KEY,
  "email" text NOT NULL,
  "password" text NOT NULL,
  "first_name" text NOT NULL,
  "last_name" text NOT NULL
);

CREATE TABLE "orders" (
  "id" SERIAL PRIMARY KEY,
  "user_id" int NOT NULL REFERENCES "users" ("id"),
  "order_total" int,
  "remote_payment_id" text,
  "remote_paymaent_dt" TIMESTAMP WITH TIME ZONE,
  "remote_order_id" text,
  "remote_receipt_id" text,
  "remote_receipt_url" text  
);

CREATE TABLE "merchants" (
  "id" SERIAL PRIMARY KEY,
  "email" text NOT NULL,
  "password" text NOT NULL,
  "display_name" text NOT NULL
);

CREATE TABLE "products" (
  "id" SERIAL PRIMARY KEY,
  "merchant_id" int NOT NULL REFERENCES "merchants" ("id") ON DELETE CASCADE,
  "name" text NOT NULL,
  "description" text NOT NULL,
  "base_price" int NOT NULL,
  "avg_rating" decimal DEFAULT 0,
  "qty_ratings" int DEFAULT 0,
  "qty_views" int DEFAULT 0,
  "qty_purchases" int DEFAULT 0,
  "qty_returns" int DEFAULT 0
);

CREATE TABLE "gatherings" (
  "id" SERIAL PRIMARY KEY,
  "merchant_id" int NOT NULL REFERENCES "merchants" ("id") ON DELETE CASCADE,
  "title" text NOT NULL,
  "description" text NOT NULL,
  "link" text NOT NULL,
  "gathering_dt" TIMESTAMP WITH TIME ZONE
);

CREATE TABLE "merchant_about" (
  "id" SERIAL PRIMARY KEY,
  "merchant_id" int NOT NULL REFERENCES "merchants" ("id") ON DELETE CASCADE,
  "headline" text,
  "about" text,
  "logo_wide_url" text,
  "logo_narrow_url" text
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
  "image_url" text,
  "alt_text" text
);

CREATE TABLE "gathering_merchants" (
  "id" SERIAL PRIMARY KEY,
  "gathering_id" int NOT NULL REFERENCES "gatherings" ("id") ON DELETE CASCADE,
  "merchant_id" int NOT NULL REFERENCES "merchants" ("id") ON DELETE CASCADE
);

CREATE TABLE "gathering_images" (
  "id" SERIAL PRIMARY KEY,
  "gathering_id" int NOT NULL REFERENCES "gatherings" ("id") ON DELETE CASCADE,
  "url" text NOT NULL,
  "alt_text" text,
  "weight" int
);
                 
CREATE TABLE "product_images" (
  "id" SERIAL PRIMARY KEY,
  "product_id" int NOT NULL REFERENCES "products" ("id") ON DELETE CASCADE,
  "url" text NOT NULL,
  "alt_text" text,
  "weight" int
);

CREATE TABLE "product_meta" (
  "id" SERIAL PRIMARY KEY,
  "product_id" int NOT NULL REFERENCES "products" ("id") ON DELETE CASCADE,
  "title" text NOT NULL,
  "description" text NOT NULL
);

CREATE TABLE "product_promotions" (
  "id" SERIAL PRIMARY KEY,
  "product_id" int NOT NULL REFERENCES "products" ("id") ON DELETE CASCADE,
  "promotion_price" int NOT NULL,
  "active" boolean DEFAULT FALSE
);

CREATE TABLE "product_coupons" (
  "id" SERIAL PRIMARY KEY,
  "product_id" int NOT NULL REFERENCES "products" ("id") ON DELETE CASCADE,
  "code" text NOT NULL,
  "pct_discount" decimal NOT NULL,
  "active" boolean DEFAULT FALSE
);

CREATE TABLE "product_modifiers" (
  "id" SERIAL PRIMARY KEY,
  "product_id" int NOT NULL REFERENCES "products" ("id") ON DELETE CASCADE,
  "name" text NOT NULL,
  "description" text NOT NULL
);

CREATE TABLE "product_reviews" (
  "id" SERIAL PRIMARY KEY,
  "product_id" int NOT NULL REFERENCES "products" ("id") ON DELETE CASCADE,
  "user_id" int NOT NULL REFERENCES "users" ("id") ON DELETE CASCADE,
  "rating" int NOT NULL,
  "title" text,
  "body" text,
  "review_dt" TIMESTAMP WITH TIME ZONE
);

CREATE TABLE "products_featured" (
  "id" SERIAL PRIMARY KEY,
  "product_id" int REFERENCES "products" ("id") ON DELETE CASCADE,
  "merchant_id" int REFERENCES "merchants" ("id") ON DELETE CASCADE,
  "feature_set" text NOT NULL,
  "site_wide" boolean DEFAULT FALSE
);


CREATE TABLE "order_products" (
  "id" SERIAL PRIMARY KEY,
  "order_id" int NOT NULL REFERENCES "orders" ("id"),
  "product_id" int REFERENCES "products" ("id") ON DELETE SET NULL,
  "product_name" text NOT NULL,
  "quantity" int NOT NULL,
  "base_price" int NOT NULL,
  "promotion_price" int,
  "coupon_discount" decimal,
  "final_price" int NOT NULL,
  "modifier_id" int REFERENCES "product_modifiers" ("id") ON DELETE SET NULL,
  "modifier_name" text
);

CREATE TABLE "order_status" (
  "id" SERIAL PRIMARY KEY,
  "order_id" int NOT NULL REFERENCES "orders" ("id"),
  "status" text NOT NULL,
  "status_dt" TIMESTAMP WITH TIME ZONE,
  "notes" text
);

CREATE TABLE "order_promotions" (
  "id" SERIAL PRIMARY KEY,
  "order_id" int NOT NULL REFERENCES "orders" ("id"),
  "product_id" int REFERENCES "products" ("id") ON DELETE SET NULL,
  "promotion_id" int REFERENCES "product_promotions" ("id") ON DELETE SET NULL,
  "promotion_price" int NOT NULL
);

CREATE TABLE "order_coupons" (
  "id" SERIAL PRIMARY KEY,
  "order_id" int NOT NULL REFERENCES "orders" ("id"),
  "product_id" int NOT NULL REFERENCES "products" ("id") ON DELETE SET NULL,
  "coupon_id" int REFERENCES "product_coupons" ("id") ON DELETE SET NULL,
  "coupon_code" text NOT NULL,
  "pct_discount" decimal NOT NULL
);