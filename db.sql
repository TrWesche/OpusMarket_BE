SET TIME ZONE 'UTC';

--
-- CREATE ALL TABLES
--

-- Data Insert Complete - 6 users
CREATE TABLE "users" (
  "id" SERIAL PRIMARY KEY,
  "email" text NOT NULL,
  "password" text NOT NULL,
  "first_name" text NOT NULL,
  "last_name" text NOT NULL
);

CREATE TABLE "orders" (
  "id" SERIAL PRIMARY KEY,
  "user_id" int REFERENCES "users" ("id") ON DELETE SET NULL,
  "order_total" int,
  "remote_payment_id" text,
  "remote_payment_dt" TIMESTAMP WITH TIME ZONE,
  "remote_order_id" text,
  "remote_receipt_id" text,
  "remote_receipt_url" text  
);

-- Data Insert Complete - 20 merchants
CREATE TABLE "merchants" (
  "id" SERIAL PRIMARY KEY,
  "email" text NOT NULL,
  "password" text NOT NULL,
  "display_name" text NOT NULL
);

-- Data Insert Complete - 130 Products
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

-- Data Insert Complete - 21 Gatherings
CREATE TABLE "gatherings" (
  "id" SERIAL PRIMARY KEY,
  "merchant_id" int NOT NULL REFERENCES "merchants" ("id") ON DELETE CASCADE,
  "title" text NOT NULL,
  "description" text NOT NULL,
  "link" text NOT NULL,
  "gathering_dt" TIMESTAMP WITH TIME ZONE
);

-- Data Insert Complete - 20 Merchant Abouts
CREATE TABLE "merchant_about" (
  "id" SERIAL PRIMARY KEY,
  "merchant_id" int NOT NULL REFERENCES "merchants" ("id") ON DELETE CASCADE,
  "headline" text,
  "about" text,
  "logo_wide_url" text,
  "logo_narrow_url" text
);

-- Data Insert Complete - Not Currently In Use
CREATE TABLE "merchant_images" (
  "id" SERIAL PRIMARY KEY,
  "merchant_id" int NOT NULL REFERENCES "merchants" ("id") ON DELETE CASCADE,
  "url" text NOT NULL,
  "alt_text" text
);

-- Data Insert Complete - Not Currently In Use
CREATE TABLE "merchant_bios" (
  "id" SERIAL PRIMARY KEY,
  "merchant_id" int NOT NULL REFERENCES "merchants" ("id") ON DELETE CASCADE,
  "name" text NOT NULL,
  "bio" text NOT NULL,
  "image_url" text,
  "alt_text" text
);

-- Data Insert Complete - 4 Featured Merchants
CREATE TABLE "merchants_featured" (
  "id" SERIAL PRIMARY KEY,
  "merchant_id" int NOT NULL REFERENCES "merchants" ("id") ON DELETE CASCADE,
  "feature_set" text NOT NULL
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

-- Data Insert Complete - 142 Product Images
CREATE TABLE "product_images" (
  "id" SERIAL PRIMARY KEY,
  "product_id" int NOT NULL REFERENCES "products" ("id") ON DELETE CASCADE,
  "url" text NOT NULL,
  "alt_text" text,
  "weight" int
);

-- Data Insert Complete - 272 Product Metas
CREATE TABLE "product_meta" (
  "id" SERIAL PRIMARY KEY,
  "product_id" int NOT NULL REFERENCES "products" ("id") ON DELETE CASCADE,
  "title" text NOT NULL,
  "description" text NOT NULL
);

-- Data Insert Complete - 26 Product Promotions
CREATE TABLE "product_promotions" (
  "id" SERIAL PRIMARY KEY,
  "product_id" int NOT NULL REFERENCES "products" ("id") ON DELETE CASCADE,
  "promotion_price" int NOT NULL,
  "active" boolean DEFAULT FALSE
);

-- Data Insert Complete - 3 Product Coupons
CREATE TABLE "product_coupons" (
  "id" SERIAL PRIMARY KEY,
  "product_id" int NOT NULL REFERENCES "products" ("id") ON DELETE CASCADE,
  "code" text NOT NULL,
  "pct_discount" decimal NOT NULL,
  "active" boolean DEFAULT FALSE
);

-- Data Insert Complete - 66 Product Modifiers
CREATE TABLE "product_modifiers" (
  "id" SERIAL PRIMARY KEY,
  "product_id" int NOT NULL REFERENCES "products" ("id") ON DELETE CASCADE,
  "name" text NOT NULL,
  "description" text NOT NULL
);

-- Data Insert Complete - 31 Product Reviews
CREATE TABLE "product_reviews" (
  "id" SERIAL PRIMARY KEY,
  "product_id" int NOT NULL REFERENCES "products" ("id") ON DELETE CASCADE,
  "user_id" int NOT NULL REFERENCES "users" ("id") ON DELETE CASCADE,
  "rating" int NOT NULL,
  "title" text,
  "body" text,
  "review_dt" TIMESTAMP WITH TIME ZONE
);

-- Data Insert Complete - 23 Products Featured
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

--
-- Add User Data to users table & Update Sequence
-- Name: users_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
-- Password = password
--

INSERT INTO "users"
  ("id", "email", "password", "first_name", "last_name")
VALUES 
	(1, 'cHylda@fakeprovider.com', '$2b$12$eyiHPWNt0/GuEHRJcKsjee/jZR3QmpFuYuiub40P1Q8Hbutna.B2m', 'Corynn', 'Hylda'),
	(2, 'bJonquil@fakeprovider.com', '$2b$12$eyiHPWNt0/GuEHRJcKsjee/jZR3QmpFuYuiub40P1Q8Hbutna.B2m', 'Brando', 'Jonquil'),
	(3, 'eMchumba@fakeprovider.com', '$2b$12$eyiHPWNt0/GuEHRJcKsjee/jZR3QmpFuYuiub40P1Q8Hbutna.B2m', 'Ezhil', 'Mchumba'),
	(4, 'sRasim@fakeprovider.com', '$2b$12$eyiHPWNt0/GuEHRJcKsjee/jZR3QmpFuYuiub40P1Q8Hbutna.B2m', 'Sara', 'Rasim'),
	(5, 'aMarlies@fakeprovider.com', '$2b$12$eyiHPWNt0/GuEHRJcKsjee/jZR3QmpFuYuiub40P1Q8Hbutna.B2m', 'Aspasia', 'Marlies'),
	(6, 'CAnita@fakeprovider.com', '$2b$12$eyiHPWNt0/GuEHRJcKsjee/jZR3QmpFuYuiub40P1Q8Hbutna.B2m', 'Cory', 'Anita');


SELECT pg_catalog.setval('public.users_id_seq', 7, true);


--
-- Add Merchant Data to merchants table & Update Sequence
-- Name: merchants_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
-- Password = password
--
INSERT INTO "merchants"
  ("id", "email", "password", "display_name")
VALUES
  (1, 'support@graytable.com', '$2b$12$OJaYnJTxzohXWulmE/G9sez3oZjmSDSHh92L9kYF1pg73ZP6f/q5.', 'Gray Table'),
  (2, 'support@bulbzy.com', '$2b$12$OJaYnJTxzohXWulmE/G9sez3oZjmSDSHh92L9kYF1pg73ZP6f/q5.', 'Bulbzy'),
  (3, 'support@glaazel.com', '$2b$12$OJaYnJTxzohXWulmE/G9sez3oZjmSDSHh92L9kYF1pg73ZP6f/q5.', 'Glaazel'),
  (4, 'support@superlamp.com', '$2b$12$OJaYnJTxzohXWulmE/G9sez3oZjmSDSHh92L9kYF1pg73ZP6f/q5.', 'superlamp'),
  (5, 'support@techshoe.com', '$2b$12$OJaYnJTxzohXWulmE/G9sez3oZjmSDSHh92L9kYF1pg73ZP6f/q5.', 'techshoe'),
  (6, 'support@wearsly.com', '$2b$12$OJaYnJTxzohXWulmE/G9sez3oZjmSDSHh92L9kYF1pg73ZP6f/q5.', 'wearsly'),
  (7, 'support@jacketsandheel.com', '$2b$12$OJaYnJTxzohXWulmE/G9sez3oZjmSDSHh92L9kYF1pg73ZP6f/q5.', 'jackets&heel'),
  (8, 'support@kniftyknife.com', '$2b$12$OJaYnJTxzohXWulmE/G9sez3oZjmSDSHh92L9kYF1pg73ZP6f/q5.', 'Knifty Knife'),
  (9, 'support@karves.com', '$2b$12$OJaYnJTxzohXWulmE/G9sez3oZjmSDSHh92L9kYF1pg73ZP6f/q5.', 'Karves'),
  (10, 'support@sterecarvel.com', '$2b$12$OJaYnJTxzohXWulmE/G9sez3oZjmSDSHh92L9kYF1pg73ZP6f/q5.', 'Stere Carvel'),
  (11, 'support@kristalandtirso.com', '$2b$12$OJaYnJTxzohXWulmE/G9sez3oZjmSDSHh92L9kYF1pg73ZP6f/q5.', 'Kristal&Tirso'),
  (12, 'support@wristmate.com', '$2b$12$OJaYnJTxzohXWulmE/G9sez3oZjmSDSHh92L9kYF1pg73ZP6f/q5.', 'Wrist Mate'),
  (13, 'support@eternalwatch.com', '$2b$12$OJaYnJTxzohXWulmE/G9sez3oZjmSDSHh92L9kYF1pg73ZP6f/q5.', 'Eternal Watch'),
  (14, 'support@luxuryduck.com', '$2b$12$OJaYnJTxzohXWulmE/G9sez3oZjmSDSHh92L9kYF1pg73ZP6f/q5.', 'Luxury Duck'),
  (15, 'support@paintingg.com', '$2b$12$OJaYnJTxzohXWulmE/G9sez3oZjmSDSHh92L9kYF1pg73ZP6f/q5.', 'paintingg'),
  (16, 'support@growindoors.com', '$2b$12$OJaYnJTxzohXWulmE/G9sez3oZjmSDSHh92L9kYF1pg73ZP6f/q5.', 'growindoors'),
  (17, 'support@bakyard.com', '$2b$12$OJaYnJTxzohXWulmE/G9sez3oZjmSDSHh92L9kYF1pg73ZP6f/q5.', 'Bakyard'),
  (18, 'support@woodbyne.com', '$2b$12$OJaYnJTxzohXWulmE/G9sez3oZjmSDSHh92L9kYF1pg73ZP6f/q5.', 'Woodbyne'),
  (19, 'support@acherburch.com', '$2b$12$OJaYnJTxzohXWulmE/G9sez3oZjmSDSHh92L9kYF1pg73ZP6f/q5.', 'AcherBurch'),
  (20, 'support@delcyportz.com', '$2b$12$OJaYnJTxzohXWulmE/G9sez3oZjmSDSHh92L9kYF1pg73ZP6f/q5.', 'Delcy Portz');


SELECT pg_catalog.setval('public.merchants_id_seq', 21, true);


--
-- Add Merchant About Me to merchant_about table & Update Sequence
-- Name: merchant_about_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--
INSERT INTO "merchant_about"
  ("id", "merchant_id", "headline", "about", "logo_wide_url", "logo_narrow_url")
VALUES
  (1, 1, 'Only the finest for your home.', 'Gray Table was founded in 1989 with the goal of bringing the finest furniture to people around the world.  Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.', 'https://images.unsplash.com/photo-1538688525198-9b88f6f53126?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=1567&q=80', 'https://images.unsplash.com/photo-1517705008128-361805f42e86?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=1579&q=80'),

  (2, 2, 'Bringing Brilliance to your Spaces.', 'Bulbzy was founded in 2001 with the goal of bringing the finest light fixtures to people around the world.  Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.', 'https://images.unsplash.com/photo-1475783006851-1d68dd683eff?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80', 'https://images.unsplash.com/photo-1556980338-33d8e625b3ca?ixid=MXwxMjA3fDB8MHxzZWFyY2h8MTh8fGxhbXB8ZW58MHx8MHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60'),

  (3, 3, 'Unique and timeless handmade ceramics and blown glass.', 'Glaazel was founded in 2009 with the goal of bringing the finest ceramics and blown glass products to people around the world.  Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.', 'https://images.unsplash.com/photo-1510266009730-c72c57421300?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80', 'https://images.unsplash.com/photo-1606148267681-e1b68a71ca24?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=934&q=80'),

  (4, 4, 'The Most Advanced Lighting For Your Home.', 'Superlamp was founded in 2001 with the goal of bringing the most advanced light fixtures to people around the world.  Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.', 'https://images.unsplash.com/photo-1591445245952-4df9a055e19f?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=1955&q=80', 'https://images.unsplash.com/photo-1602918955248-d1bbfcbfae38?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=882&q=80'),

  (5, 5, 'Putting Technology On Your Feet.', 'TechShoe was founded in 2010 with the goal of bringing the most advanced shores to people around the world.  Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.', 'https://images.unsplash.com/photo-1487180144351-b8472da7d491?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=1952&q=80', 'https://images.unsplash.com/photo-1591882351016-6f26999cea0a?ixid=MXwxMjA3fDB8MHxzZWFyY2h8NjZ8fHRlY2glMjBzaG9lfGVufDB8fDB8&ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60'),

  (6, 6, 'You Are What You Wear.', 'Wearsly was founded in 2015 with the goal of bringing the best threads to people around the world.  Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.', 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80', 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80'),

  (7, 7, 'Hit the Street With Confidence.', 'Jackets and Heel was founded in 2000 with the goal of bringing the best in fashion to people around the world.  Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.', 'https://images.unsplash.com/photo-1559551409-dadc959f76b8?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=1952&q=80', 'https://images.unsplash.com/photo-1545272957-4a9a90740ce1?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=934&q=80'),

  (8, 8, 'The Most Clever Knives on the Market.', 'Knighty Knife was founded in 2012 with the goal of changing the way people look at cutlery around the world.  Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.', 'https://images.unsplash.com/photo-1569885385144-3354788cc68d?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=2089&q=80', 'https://images.unsplash.com/photo-1577398628388-516477602b3b?ixid=MXwxMjA3fDB8MHxzZWFyY2h8MXx8a25pZmV8ZW58MHx8MHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60'),

  (9, 9, 'The Forever Blade', 'Karves was founded in 1989 with the goal of bringing the finest knives to people around the world.  Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.', 'https://images.unsplash.com/photo-1591809704796-0c6cb2eb0474?ixlib=rb-1.2.1&ixid=MXwxMjA3fDB8MHxwaG90by1yZWxhdGVkfDE5fHx8ZW58MHx8fA%3D%3D&auto=format&fit=crop&w=500&q=60', 'https://images.unsplash.com/photo-1598712585706-f60ba8b1bf72?ixlib=rb-1.2.1&ixid=MXwxMjA3fDB8MHxzZWFyY2h8MzZ8fGtuaWZlfGVufDB8fDB8&auto=format&fit=crop&w=500&q=60'),

  (10, 10, 'Make a Statement with Carvel', 'Stere Carvel launched his line of game-changing street wear in 2001 building from his lengthy experience in fashion and unique influences from around the world.  Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.', 'https://images.unsplash.com/photo-1522187123691-0639b7c0ba21?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=1949&q=80', 'https://images.unsplash.com/photo-1506453434641-e720b33ea0bb?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=934&q=80'),

  (11, 11, 'Cosmetics for Your Life', 'Kristal & Tirso was founded in 2009 with the goal of bringing the finest cosmetics to people around the world.  Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.', 'https://images.unsplash.com/photo-1521840233161-295ed621e056?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=1539&q=80', 'https://images.unsplash.com/photo-1571256750339-12bbebc768f3?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=969&q=80'),

  (12, 12, 'Do You Know What Time it Is?', 'Wristmate was founded in 2001 with the goal of bringing high quality & affordable watches to people around the world.  Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.', 'https://images.unsplash.com/photo-1523268755815-fe7c372a0349?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80', 'https://images.unsplash.com/photo-1524592094714-0f0654e20314?ixid=MXwxMjA3fDB8MHxwaG90by1yZWxhdGVkfDl8fHxlbnwwfHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60'),

  (13, 13, 'As Time, A Watch if Forever', 'Eternal Watch was founded in 2010 with the goal of uniting modern fashion with the timeless art of watchmaking.  Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.', 'https://images.unsplash.com/photo-1495704907664-81f74a7efd9b?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80', 'https://images.unsplash.com/photo-1511370235399-1802cae1d32f?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=1937&q=80'),

  (14, 14, 'Unflappingly Waterproof and Fashionable Outwear', 'Luxury Duck was founded in 2015 with the goal of bringing the best waterproof outerwear to people around the world.  Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.', 'https://images.unsplash.com/photo-1604644401890-0bd678c83788?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80', 'https://images.unsplash.com/photo-1572223729752-da11b61089af?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80'),

  (15, 15, 'Beautifly Design & Unique Canvas Art.', 'Paintingg was founded in 2000 with the goal of bringing the best in underground artwork to people around the world.  Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.', 'https://images.unsplash.com/photo-1561059488-916d69792237?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=2089&q=80', 'https://images.unsplash.com/photo-1525909002-1b05e0c869d8?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=975&q=80'),

  (16, 16, 'Bring You Interior Space to Life.', 'Grow Indoors was founded in 2012 with the goal of changing the way people approach growing plants indoors around the world.  Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.', 'https://images.unsplash.com/photo-1521334884684-d80222895322?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80', 'https://images.unsplash.com/photo-1446071103084-c257b5f70672?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=931&q=80'),

  (17, 17, 'Make Your Yard the Envy of the Neighborhood', 'Bakyard was founded in 2010 with the goal of bringing unique outdoors goods to people around the world.  Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.', 'https://images.unsplash.com/photo-1596481768453-8befafc2d7ae?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=1567&q=80', 'https://images.unsplash.com/photo-1534177616072-ef7dc120449d?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80'),

  (18, 18, 'Conquer the Outdoors', 'Woodbyne was founded in 2015 with the goal of bringing the best waterproof outdoors gear to people around the world.  Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.', 'https://images.unsplash.com/photo-1551632811-561732d1e306?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80', 'https://images.unsplash.com/photo-1586022045497-31fcf76fa6cc?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=934&q=80'),

  (19, 19, 'The Fashion of the Wilderness', 'ArcherBurch was founded in 2000 with the goal of uniting fashion with nature through beautiful, durable clothing.  Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.', 'https://images.unsplash.com/photo-1485842612006-6c50e8bf2576?ixlib=rb-1.2.1&ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&auto=format&fit=crop&w=1950&q=80', 'https://images.unsplash.com/photo-1481729379561-01e43a3e1ed4?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=2036&q=80'),

  (20, 20, 'Make the Sea Your Playground', 'Delcy Portz was founded in 2012 to change the way people explore and experience the aquatic world.  Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.', 'https://images.unsplash.com/photo-1484420319874-33eb4315270c?ixlib=rb-1.2.1&ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&auto=format&fit=crop&w=1567&q=80', 'https://images.unsplash.com/photo-1466188635785-8b5f35009981?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=1951&q=80');

SELECT pg_catalog.setval('public.merchant_about_id_seq', 21, true);


--
-- Add Merchant Features to merchants_featured table & Update Sequence
-- Name: merchants_featured_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--
INSERT INTO "merchants_featured"
  ("id", "merchant_id", "feature_set")
VALUES
  (1, 1, 'Top Creators'),
  (2, 10, 'Top Creators'),
  (3, 19, 'Top Creators'),
  (4, 7, 'Top Creators');

SELECT pg_catalog.setval('public.merchants_featured_id_seq', 5, true);


--
-- Add Product Data to products table & Update Sequence
-- Name: products_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--
INSERT INTO "products"
  ("id", "merchant_id", "name", "description", "base_price", "avg_rating", "qty_ratings", "qty_views", "qty_purchases", "qty_returns")
VALUES
  (1, 1, 'Bronson Coffee Table', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
    12999, 4, 10, 110, 20, 3),
  (2, 1, 'Campanelli Coffee Table', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
    30999, 5, 40, 200, 82, 3),
  (3, 1, 'Salyer Side Table', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
    8299, 3, 22, 150, 54, 10),
  (4, 1, 'Kenton Side Table', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
    3299, 3, 150, 450, 234, 45),
  (5, 1, 'Eckenrode Bar Height Dining Table', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
    18999, 4, 50, 350, 121, 1),
  (6, 1, 'Sloan Dining Table', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
    50999, 5, 12, 312, 53, 1),
  (7, 1, 'Eckenrode Bar Stool', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
    7399, 5, 15, 332, 256, 1),
  (8, 1, 'Sloan Dining Chair', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
    13299, 4, 25, 361, 1212, 21),
  (9, 1, 'Ibiza 77in Sofa', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
    52199, 4, 7, 424, 31, 0),
  (10, 1, 'Ibiza 58in Loveseat', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
    31299, 5, 12, 224, 49, 1),

  (11, 2, 'The Regal', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
    8999, 5, 20, 200, 40, 2),
  (12, 2, 'The Epic', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
    3999, 4, 10, 100, 20, 1),
  (13, 2, 'The Inspired', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
    10999, 5, 30, 300, 60, 3),
  (14, 2, 'The Manhattan', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
    13999, 3, 40, 400, 80, 4),
  (15, 2, 'The Night Owl', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
    6999, 2, 20, 200, 40, 2),
  (16, 2, 'The Tiger', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
    8999, 5, 20, 200, 40, 2),
  (17, 2, 'The Brewer', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
    3999, 4, 10, 100, 20, 1),
  (18, 2, 'The Soho', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
    10999, 5, 30, 300, 60, 3),
  (19, 2, 'The Kingly', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
    13999, 3, 40, 400, 80, 4),
  (20, 2, 'The Archer', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
    6999, 2, 20, 200, 40, 2),

  (21, 3, 'The Regal', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
    8999, 5, 20, 200, 40, 2),
  (22, 3, 'The Epic', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
    3999, 4, 10, 100, 20, 1),
  (23, 3, 'The Inspired', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
    10999, 5, 30, 300, 60, 3),
  (24, 3, 'The Manhattan', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
    13999, 3, 40, 400, 80, 4),
  (25, 3, 'The Night Owl', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
    6999, 2, 20, 200, 40, 2),

  (26, 4, 'The Tiger', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
    8999, 5, 20, 200, 40, 2),
  (27, 4, 'The Brewer', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
    3999, 4, 10, 100, 20, 1),
  (28, 4, 'The Soho', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
    10999, 5, 30, 300, 60, 3),
  (29, 4, 'The Kingly', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
    13999, 3, 40, 400, 80, 4),
  (30, 4, 'The Archer', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
    6999, 2, 20, 200, 40, 2),
  (31, 4, 'The Inspired', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
    10999, 5, 30, 300, 60, 3),

  (32, 5, 'The Epic', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
    3999, 4, 10, 100, 20, 1),
  (33, 5, 'The Inspired', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
    10999, 5, 30, 300, 60, 3),
  (34, 5, 'The Manhattan', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
    13999, 3, 40, 400, 80, 4),
  (35, 5, 'The Night Owl', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
    6999, 2, 20, 200, 40, 2),
  (36, 5, 'The Tiger', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
    8999, 5, 20, 200, 40, 2),
  (37, 5, 'The Brewer', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
    3999, 4, 10, 100, 20, 1),
  (38, 5, 'The Soho', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
    10999, 5, 30, 300, 60, 3),
  
  (39, 6, 'The Kingly', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
    13999, 3, 40, 400, 80, 4),
  (40, 6, 'The Archer', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
    6999, 2, 20, 200, 40, 2),
  (41, 6, 'The Regal', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
    8999, 5, 20, 200, 40, 2),
  (42, 6, 'The Epic', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
    3999, 4, 10, 100, 20, 1),
  (43, 6, 'The Inspired', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
    10999, 5, 30, 300, 60, 3),
  (44, 6, 'The Manhattan', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
    13999, 3, 40, 400, 80, 4),

  (45, 7, 'The Kingly', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
    13999, 3, 40, 400, 80, 4),
  (46, 7, 'The Archer', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
    6999, 2, 20, 200, 40, 2),
  (47, 7, 'The Inspired', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
    10999, 5, 30, 300, 60, 3),
  (48, 7, 'The Epic', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
    3999, 4, 10, 100, 20, 1),
  (49, 7, 'The Inspired', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
    10999, 5, 30, 300, 60, 3),
  (50, 7, 'The Manhattan', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
    13999, 3, 40, 400, 80, 4),
  (51, 7, 'The Night Owl', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
    6999, 2, 20, 200, 40, 2),

  (52, 8, 'The Ibiza', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
    6999, 2, 20, 200, 40, 2),
  (53, 8, 'The Masterful', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
    8999, 5, 20, 200, 40, 2),
  (54, 8, 'The Contestant', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
    3999, 4, 10, 100, 20, 1),
  (55, 8, 'The Soho', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
    10999, 5, 30, 300, 60, 3),
  (56, 8, 'The Kingly', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
    13999, 3, 40, 400, 80, 4),
  (57, 8, 'The Archer', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
    6999, 2, 20, 200, 40, 2),

  (58, 9, 'The Inspired', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
    10999, 5, 30, 300, 60, 3),
  (59, 9, 'The Manhattan', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
    13999, 3, 40, 400, 80, 4),
  (60, 9, 'The Kingly', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
    13999, 3, 40, 400, 80, 4),
  (61, 9, 'The Archer', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
    6999, 2, 20, 200, 40, 2),

  (62, 10, 'The Ibiza', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
    6999, 2, 20, 200, 40, 2),
  (63, 10, 'The Masterful', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
    8999, 5, 20, 200, 40, 2),
  (64, 10, 'The Contestant', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
    3999, 4, 10, 100, 20, 1),
  (65, 10, 'The Soho', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
    10999, 5, 30, 300, 60, 3),
  (66, 10, 'The Kingly', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
    13999, 3, 40, 400, 80, 4),
  (67, 10, 'The Archer', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
    6999, 2, 20, 200, 40, 2),
  (68, 10, 'The Inspired', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
    10999, 5, 30, 300, 60, 3),
  (69, 10, 'The Manhattan', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
    13999, 3, 40, 400, 80, 4),
  (70, 10, 'The Epic', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
    3999, 4, 10, 100, 20, 1),
  (71, 10, 'The Entrepreneur', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
    3999, 4, 10, 100, 20, 1),
  (72, 10, 'The Influencer', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
    13999, 3, 40, 400, 80, 4),
  (73, 10, 'The Emperor', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
    13999, 3, 40, 400, 80, 4),
  (74, 10, 'The Rugged', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
    13999, 3, 40, 400, 80, 4),

  (75, 11, 'The Tiger', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
    8999, 5, 20, 200, 40, 2),
  (76, 11, 'The Brewer', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
    3999, 4, 10, 100, 20, 1),
  (77, 11, 'The Soho', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
    10999, 5, 30, 300, 60, 3),
  (78, 11, 'The Kingly', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
    13999, 3, 40, 400, 80, 4),

  (79, 12, 'The Influencer', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
    13999, 3, 40, 400, 80, 4),
  (80, 12, 'The Emperor', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
    13999, 3, 40, 400, 80, 4),
  (81, 12, 'The Rugged', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
    13999, 3, 40, 400, 80, 4),
  (82, 12, 'The Ibiza', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
    6999, 2, 20, 200, 40, 2),
  (83, 12, 'The Masterful', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
    8999, 5, 20, 200, 40, 2),

  (84, 13, 'The Contestant', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
    3999, 4, 10, 100, 20, 1),
  (85, 13, 'The Tiger', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
    8999, 5, 20, 200, 40, 2),
  (86, 13, 'The Archer', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
    6999, 2, 20, 200, 40, 2),
  (87, 13, 'The Brewer', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
    3999, 4, 10, 100, 20, 1),

  (88, 14, 'The Inspired', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
    10999, 5, 30, 300, 60, 3),
  (89, 14, 'The Manhattan', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
    13999, 3, 40, 400, 80, 4),
  (90, 14, 'The Epic', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
    3999, 4, 10, 100, 20, 1),
  (91, 14, 'The Entrepreneur', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
    3999, 4, 10, 100, 20, 1),
  (92, 14, 'The Influencer', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
    13999, 3, 40, 400, 80, 4),

  (93, 15, 'The Emperor', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
    13999, 3, 40, 400, 80, 4),
  (94, 15, 'The Rugged', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
    13999, 3, 40, 400, 80, 4),
  (95, 15, 'The Tiger', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
    8999, 5, 20, 200, 40, 2),
  (96, 15, 'The Brewer', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
    3999, 4, 10, 100, 20, 1),
  (97, 15, 'The Soho', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
    10999, 5, 30, 300, 60, 3),
  (98, 15, 'The Kingly', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
    13999, 3, 40, 400, 80, 4),
  (99, 15, 'The Influencer', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
    13999, 3, 40, 400, 80, 4),
  (100, 15, 'The Masterful', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
    8999, 5, 20, 200, 40, 2),

  (101, 16, 'The Regal', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
    8999, 5, 20, 200, 40, 2),
  (102, 16, 'The Epic', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
    3999, 4, 10, 100, 20, 1),
  (103, 16, 'The Inspired', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
    10999, 5, 30, 300, 60, 3),
  (104, 16, 'The Manhattan', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
    13999, 3, 40, 400, 80, 4),
  (105, 16, 'The Night Owl', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
    6999, 2, 20, 200, 40, 2),

  (106, 17, 'The Archer', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
    6999, 2, 20, 200, 40, 2),
  (107, 17, 'The Inspired', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
    10999, 5, 30, 300, 60, 3),
  (108, 17, 'The Epic', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
    3999, 4, 10, 100, 20, 1),
  (109, 17, 'The Inspired', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
    10999, 5, 30, 300, 60, 3),
  (110, 17, 'The Manhattan', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
    13999, 3, 40, 400, 80, 4),

  (111, 18, 'The Kingly', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
    13999, 3, 40, 400, 80, 4),
  (112, 18, 'The Influencer', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
    13999, 3, 40, 400, 80, 4),
  (113, 18, 'The Masterful', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
    8999, 5, 20, 200, 40, 2),

  (114, 19, 'The Inspired', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
    10999, 5, 30, 300, 60, 3),
  (115, 19, 'The Manhattan', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
    13999, 3, 40, 400, 80, 4),
  (116, 19, 'The Epic', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
    3999, 4, 10, 100, 20, 1),
  (117, 19, 'The Entrepreneur', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
    3999, 4, 10, 100, 20, 1),
  (118, 19, 'The Influencer', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
    13999, 3, 40, 400, 80, 4),
  (119, 19, 'The Emperor', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
    13999, 3, 40, 400, 80, 4),
  (120, 19, 'The Rugged', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
    13999, 3, 40, 400, 80, 4),
  (121, 19, 'The Tiger', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
    8999, 5, 20, 200, 40, 2),
  (122, 19, 'The Brewer', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
    3999, 4, 10, 100, 20, 1),
  (123, 19, 'The Soho', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
    10999, 5, 30, 300, 60, 3),
  (124, 19, 'The Kingly', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
    13999, 3, 40, 400, 80, 4),
  (125, 19, 'The Influencer', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
    13999, 3, 40, 400, 80, 4),
  (126, 19, 'The Masterful', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
    8999, 5, 20, 200, 40, 2),

  (127, 20, 'The Influencer', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
    13999, 3, 40, 400, 80, 4),
  (128, 20, 'The Emperor', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
    13999, 3, 40, 400, 80, 4),
  (129, 20, 'The Rugged', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
    13999, 3, 40, 400, 80, 4),
  (130, 20, 'The Tiger', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
    8999, 5, 20, 200, 40, 2);

SELECT pg_catalog.setval('public.products_id_seq', 131, true);


--
-- Add Product Images to product_images table & Update Sequence
-- Name: product_images_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--
INSERT INTO "product_images"
  ("id", "product_id", "url", "alt_text", "weight")
VALUES
  (1, 1, 'https://images.unsplash.com/photo-1585264550248-1778be3b6368?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=999&q=80', 'Source: Unsplash - Trend IO @simplymodernliving', 2),
  (2, 1, 'https://images.unsplash.com/photo-1597686025277-2e0c71e0c52d?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=975&q=80', 'Source: Unsplash - Julie Froelich', 2),
  (3, 1, 'https://images.unsplash.com/photo-1593685967309-8e47fe215c6d?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=934&q=80', 'Source: Unsplash - Natural Goods Berlin', 5),
  (4, 2, 'https://images.unsplash.com/photo-1577579242327-55d2031484b9?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=934&q=80', 'Source: Unsplash - Ashley Byrd', 5),
  (5, 2, 'https://images.unsplash.com/photo-1560449752-3fd4bdbe7df0?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80', 'Source: Unsplash - Francesca Tosolini', 2),
  (6, 2, 'https://images.unsplash.com/photo-1603825491252-775d159a3b87?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=1948&q=80', 'Source: Unsplash - Raquel Navalon Alvarez', 3),
  (7, 2, 'https://images.unsplash.com/photo-1598928699824-6a6c82df2369?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80', 'Source: Unsplash - Sidekix Media', 1),
  (8, 2, 'https://images.unsplash.com/photo-1588946355920-8de78170ee03?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=1949&q=80', 'Source: Unsplash - Helen Shi', 4),
  (9, 3, 'https://images.unsplash.com/photo-1558027807-9255592958f7?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80', 'Source: Unsplash - Mateo Burles', 5),
  (10, 4, 'https://images.unsplash.com/photo-1606340884679-a97c830b1afc?ixlib=rb-1.2.1&ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&auto=format&fit=crop&w=934&q=80', 'Source: Unsplash - Cesira Alvarado', 5),
  (11, 5, 'https://images.unsplash.com/photo-1579341560277-4dfaddaf6e98?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=975&q=80', 'Source: Unsplash - Hidayat Abisena', 5),
  (12, 6, 'https://images.unsplash.com/photo-1592781689361-815e22d61483?ixlib=rb-1.2.1&ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&auto=format&fit=crop&w=934&q=80', 'Source: Unsplash - Matthew Jungling', 5),
  (13, 7, 'https://images.unsplash.com/photo-1592863689950-e7e8ef4ea992?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80', 'Source: Unsplash - Lettuce Grow', 5),
  (14, 7, 'https://images.unsplash.com/photo-1579341560277-4dfaddaf6e98?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=975&q=80', 'Source: Unsplash - Hidayat Abisena', 5),
  (15, 7, 'https://cdn.pixabay.com/photo/2017/03/28/12/15/chairs-2181977__340.jpg', 'Source: Pixabay - Chairs Table Empty', 2),
  (16, 8, 'https://cdn.pixabay.com/photo/2017/03/28/12/11/chairs-2181960_960_720.jpg', 'Source: Pixabay - Chairs Contemporary', 2),
  (17, 8, 'https://cdn.pixabay.com/photo/2017/03/28/12/16/chairs-2181980_960_720.jpg', 'Source: Pixabay - Chairs Conference Room', 2),
  (18, 8, 'https://cdn.pixabay.com/photo/2017/03/28/12/15/chairs-2181977__340.jpg', 'Source: Pixabay - Chairs Table Empty', 2),
  (19, 9, 'https://cdn.pixabay.com/photo/2017/09/09/18/25/living-room-2732939_960_720.jpg', 'Source: Pixabay - Living Room Couch', 2),
  (20, 9, 'https://images.unsplash.com/photo-1538688525198-9b88f6f53126?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=1567&q=80', 'Source: Unsplash - Michael Warf', 2),
  (21, 10, 'https://cdn.pixabay.com/photo/2017/08/02/01/01/living-room-2569325_960_720.jpg', 'Source: Pixabay - Living Room Sofa Couch', 2),
  (22, 10, 'https://images.unsplash.com/photo-1549488344-cbb6c34cf08b?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=934&q=80', 'Source: Unsplash - Orlova Maria', 2),
  (23, 11, 'https://images.unsplash.com/photo-1501045661006-fcebe0257c3f?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80', 'Source: Unsplash - Mitch Moondae', 2),
  (24, 12, 'https://images.unsplash.com/photo-1581539250439-c96689b516dd?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=1001&q=80', 'Source: Unsplash - Eugene Chystiakov', 2),
  (25, 13, 'https://images.unsplash.com/photo-1499933374294-4584851497cc?ixlib=rb-1.2.1&ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&auto=format&fit=crop&w=975&q=80', 'Source: Unsplash - Benjamin Voros', 2),
  (26, 14, 'https://images.unsplash.com/photo-1593618380312-09a2aa13de9d?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=1959&q=80', 'Source: Unsplash - Savernake Knives', 2),
  (27, 15, 'https://images.unsplash.com/photo-1540932239986-30128078f3c5?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=934&q=80', 'Source: Unsplash - Jean-Philippe Delberghe', 2),
  (28, 16, 'https://images.unsplash.com/photo-1597947326026-6539a23f9ab1?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=934&q=80', 'Source: Unsplash - Kristaps Ungurs', 2),
  (29, 17, 'https://images.unsplash.com/photo-1586443520560-16aec1f69eda?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=934&q=80', 'Source: Unsplash - Apothecary 87', 2),
  (30, 18, 'https://images.unsplash.com/photo-1592195986398-5484c0890b74?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80', 'Source: Unsplash - wu yi', 2),
  (31, 19, 'https://images.unsplash.com/photo-1605034313761-73ea4a0cfbf3?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=1400&q=80', 'Source: Unsplash - Hipkicks', 2),
  (32, 20, 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80', 'Source: Unsplash - C D-X', 2),
  (33, 21, 'https://images.unsplash.com/photo-1491553895911-0055eca6402d?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=1400&q=80', 'Source: Unsplash - Imani Bahati', 2),
  (34, 22, 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=1400&q=80', 'Source: Unsplash - Giorgio Trovato', 2),
  (35, 23, 'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80', 'Source: Unsplash - Battlecreek Coffee Roasters', 2),
  (36, 24, 'https://images.unsplash.com/photo-1564466809058-bf4114d55352?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=933&q=80', 'Source: Unsplash - Varun Gaba', 2),
  (37, 25, 'https://images.unsplash.com/photo-1532667449560-72a95c8d381b?ixlib=rb-1.2.1&ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&auto=format&fit=crop&w=1950&q=80', 'Source: Unsplash - Marek Szturc', 2),
  (38, 26, 'https://images.unsplash.com/photo-1523027737707-96c0e1fd54e4?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=1567&q=80', 'Source: Unsplash - Tom Crew', 2),
  (39, 27, 'https://images.unsplash.com/photo-1523841662900-c1d9e94f0228?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80', 'Source: Unsplash - Martin Sanchez', 2),
  (40, 28, 'https://images.unsplash.com/photo-1535486607281-4fc90307a8bb?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80', 'Source: Unsplash - Vincent Branciforti', 2),
  (41, 29, 'https://images.unsplash.com/photo-1505468726633-0069fc52f4b9?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80', 'Source: Unsplash - Edho Pratama', 2),
  (42, 30, 'https://images.unsplash.com/photo-1580870069867-74c57ee1bb07?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=975&q=80', 'Source: Unsplash - Valeriia Miller', 2),
  (43, 31, 'https://images.unsplash.com/photo-1513135724701-30343e546328?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=995&q=80', 'Source: Unsplash - Stephanie Harvey', 2),
  (44, 32, 'https://images.unsplash.com/photo-1513555633610-d912838b8ac5?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80', 'Source: Unsplash - Jye B', 2),
  (45, 33, 'https://images.unsplash.com/photo-1546868871-7041f2a55e12?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80', 'Source: Unsplash - Daniel Korpai', 2),
  (46, 34, 'https://images.unsplash.com/photo-1564466809058-bf4114d55352?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=933&q=80', 'Source: Unsplash - Varun Gaba', 2),
  (47, 35, 'https://images.unsplash.com/photo-1532667449560-72a95c8d381b?ixlib=rb-1.2.1&ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&auto=format&fit=crop&w=1950&q=80', 'Source: Unsplash - Marek Szturc', 2),
  (48, 36, 'https://images.unsplash.com/photo-1523027737707-96c0e1fd54e4?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=1567&q=80', 'Source: Unsplash - Tom Crew', 2),
  (49, 37, 'https://images.unsplash.com/photo-1523841662900-c1d9e94f0228?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80', 'Source: Unsplash - Martin Sanchez', 2),
  (50, 38, 'https://images.unsplash.com/photo-1535486607281-4fc90307a8bb?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80', 'Source: Unsplash - Vincent Branciforti', 2),
  (51, 39, 'https://images.unsplash.com/photo-1605034313761-73ea4a0cfbf3?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=1400&q=80', 'Source: Unsplash - Hipkicks', 2),
  (52, 40, 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80', 'Source: Unsplash - C D-X', 2),
  (53, 41, 'https://images.unsplash.com/photo-1491553895911-0055eca6402d?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=1400&q=80', 'Source: Unsplash - Imani Bahati', 2),
  (54, 42, 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=1400&q=80', 'Source: Unsplash - Giorgio Trovato', 2),
  (55, 43, 'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80', 'Source: Unsplash - Battlecreek Coffee Roasters', 2),
  (56, 44, 'https://images.unsplash.com/photo-1564466809058-bf4114d55352?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=933&q=80', 'Source: Unsplash - Varun Gaba', 2),
  (57, 45, 'https://images.unsplash.com/photo-1535486607281-4fc90307a8bb?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80', 'Source: Unsplash - Vincent Branciforti', 2),
  (58, 46, 'https://images.unsplash.com/photo-1505468726633-0069fc52f4b9?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80', 'Source: Unsplash - Edho Pratama', 2),
  (59, 47, 'https://images.unsplash.com/photo-1580870069867-74c57ee1bb07?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=975&q=80', 'Source: Unsplash - Valeriia Miller', 2),
  (60, 48, 'https://images.unsplash.com/photo-1513135724701-30343e546328?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=995&q=80', 'Source: Unsplash - Stephanie Harvey', 2),
  (61, 49, 'https://images.unsplash.com/photo-1513555633610-d912838b8ac5?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80', 'Source: Unsplash - Jye B', 2),
  (62, 50, 'https://images.unsplash.com/photo-1546868871-7041f2a55e12?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80', 'Source: Unsplash - Daniel Korpai', 2),
  (63, 51, 'https://images.unsplash.com/photo-1564466809058-bf4114d55352?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=933&q=80', 'Source: Unsplash - Varun Gaba', 2),
  (64, 52, 'https://images.unsplash.com/photo-1532667449560-72a95c8d381b?ixlib=rb-1.2.1&ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&auto=format&fit=crop&w=1950&q=80', 'Source: Unsplash - Marek Szturc', 2),
  (65, 53, 'https://images.unsplash.com/photo-1551962368-1abc41c65f83?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80', 'Source: Unsplash - Daniel Korpai', 2),
  (66, 54, 'https://images.unsplash.com/photo-1561180796-dbaa5caf76e0?ixid=MXwxMjA3fDB8MHxzZWFyY2h8MTM1fHxwcm9kdWN0fGVufDB8fDB8&ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60', 'Source: Unsplash - Scott Osborn', 2),
  (67, 55, 'https://images.unsplash.com/photo-1556767284-fd0dbf421a2d?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=1951&q=80', 'Source: Unsplash - Stefan Rodriguez', 2),
  (68, 56, 'https://images.unsplash.com/photo-1556228720-da4e85f25e15?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=938&q=80', 'Source: Unsplash - Curology', 2),
  (69, 57, 'https://images.unsplash.com/photo-1562986406-60c6ec23a800?ixid=MXwxMjA3fDB8MHxzZWFyY2h8MTU0fHxwcm9kdWN0fGVufDB8fDB8&ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60', 'Source: Unsplash - Priscilla Du Preez', 2),
  (70, 58, 'https://images.unsplash.com/photo-1513135724701-30343e546328?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=995&q=80', 'Source: Unsplash - Stephanie Harvey', 2),
  (71, 59, 'https://images.unsplash.com/photo-1513555633610-d912838b8ac5?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80', 'Source: Unsplash - Jye B', 2),
  (72, 60, 'https://images.unsplash.com/photo-1546868871-7041f2a55e12?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80', 'Source: Unsplash - Daniel Korpai', 2),
  (73, 61, 'https://images.unsplash.com/photo-1564466809058-bf4114d55352?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=933&q=80', 'Source: Unsplash - Varun Gaba', 2),
  (74, 62, 'https://images.unsplash.com/photo-1532667449560-72a95c8d381b?ixlib=rb-1.2.1&ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&auto=format&fit=crop&w=1950&q=80', 'Source: Unsplash - Marek Szturc', 2),
  (75, 63, 'https://images.unsplash.com/photo-1551962368-1abc41c65f83?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80', 'Source: Unsplash - Daniel Korpai', 2),
  (76, 64, 'https://images.unsplash.com/photo-1561180796-dbaa5caf76e0?ixid=MXwxMjA3fDB8MHxzZWFyY2h8MTM1fHxwcm9kdWN0fGVufDB8fDB8&ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60', 'Source: Unsplash - Scott Osborn', 2),
  (77, 65, 'https://images.unsplash.com/photo-1556767284-fd0dbf421a2d?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=1951&q=80', 'Source: Unsplash - Stefan Rodriguez', 2),
  (78, 66, 'https://images.unsplash.com/photo-1556228720-da4e85f25e15?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=938&q=80', 'Source: Unsplash - Curology', 2),
  (79, 67, 'https://images.unsplash.com/photo-1562986406-60c6ec23a800?ixid=MXwxMjA3fDB8MHxzZWFyY2h8MTU0fHxwcm9kdWN0fGVufDB8fDB8&ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60', 'Source: Unsplash - Priscilla Du Preez', 2),
  (80, 68, 'https://images.unsplash.com/photo-1513135724701-30343e546328?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=995&q=80', 'Source: Unsplash - Stephanie Harvey', 2),
  (81, 69, 'https://images.unsplash.com/photo-1513555633610-d912838b8ac5?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80', 'Source: Unsplash - Jye B', 2),
  (82, 70, 'https://images.unsplash.com/photo-1546868871-7041f2a55e12?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80', 'Source: Unsplash - Daniel Korpai', 2),
  (83, 71, 'https://images.unsplash.com/photo-1564466809058-bf4114d55352?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=933&q=80', 'Source: Unsplash - Varun Gaba', 2),
  (84, 72, 'https://images.unsplash.com/photo-1564077439888-928a90061fb3?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80', 'Source: Unsplash - The Creative Exchange', 2),
  (85, 73, 'https://images.unsplash.com/photo-1565405727287-b5abc42d3bae?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=931&q=80', 'Source: Unsplash - SCREEN POST', 2),
  (86, 74, 'https://images.unsplash.com/photo-1597942981610-d5bd7125b507?ixid=MXwxMjA3fDB8MHxzZWFyY2h8MTcxfHxwcm9kdWN0fGVufDB8fDB8&ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60', 'Source: Unsplash - Jade Scarlato', 2),
  (87, 75, 'https://images.unsplash.com/photo-1551962368-1abc41c65f83?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80', 'Source: Unsplash - Daniel Korpai', 2),
  (88, 76, 'https://images.unsplash.com/photo-1561180796-dbaa5caf76e0?ixid=MXwxMjA3fDB8MHxzZWFyY2h8MTM1fHxwcm9kdWN0fGVufDB8fDB8&ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60', 'Source: Unsplash - Scott Osborn', 2),
  (89, 77, 'https://images.unsplash.com/photo-1556767284-fd0dbf421a2d?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=1951&q=80', 'Source: Unsplash - Stefan Rodriguez', 2),
  (90, 78, 'https://images.unsplash.com/photo-1556228720-da4e85f25e15?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=938&q=80', 'Source: Unsplash - Curology', 2),
  (91, 79, 'https://images.unsplash.com/photo-1513555633610-d912838b8ac5?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80', 'Source: Unsplash - Jye B', 2),
  (92, 80, 'https://images.unsplash.com/photo-1546868871-7041f2a55e12?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80', 'Source: Unsplash - Daniel Korpai', 2),
  (93, 81, 'https://images.unsplash.com/photo-1564466809058-bf4114d55352?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=933&q=80', 'Source: Unsplash - Varun Gaba', 2),
  (94, 82, 'https://images.unsplash.com/photo-1564077439888-928a90061fb3?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80', 'Source: Unsplash - The Creative Exchange', 2),
  (95, 83, 'https://images.unsplash.com/photo-1565405727287-b5abc42d3bae?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=931&q=80', 'Source: Unsplash - SCREEN POST', 2),
  (96, 84, 'https://images.unsplash.com/photo-1564077439888-928a90061fb3?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80', 'Source: Unsplash - The Creative Exchange', 2),
  (97, 85, 'https://images.unsplash.com/photo-1556767284-fd0dbf421a2d?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=1951&q=80', 'Source: Unsplash - Stefan Rodriguez', 2),
  (98, 86, 'https://images.unsplash.com/photo-1556228720-da4e85f25e15?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=938&q=80', 'Source: Unsplash - Curology', 2),
  (99, 87, 'https://images.unsplash.com/photo-1562986406-60c6ec23a800?ixid=MXwxMjA3fDB8MHxzZWFyY2h8MTU0fHxwcm9kdWN0fGVufDB8fDB8&ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60', 'Source: Unsplash - Priscilla Du Preez', 2),
  (100, 88, 'https://images.unsplash.com/photo-1513135724701-30343e546328?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=995&q=80', 'Source: Unsplash - Stephanie Harvey', 2),
  (101, 89, 'https://images.unsplash.com/photo-1513555633610-d912838b8ac5?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80', 'Source: Unsplash - Jye B', 2),
  (102, 90, 'https://images.unsplash.com/photo-1546868871-7041f2a55e12?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80', 'Source: Unsplash - Daniel Korpai', 2),
  (103, 91, 'https://images.unsplash.com/photo-1564466809058-bf4114d55352?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=933&q=80', 'Source: Unsplash - Varun Gaba', 2),
  (104, 92, 'https://images.unsplash.com/photo-1532667449560-72a95c8d381b?ixlib=rb-1.2.1&ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&auto=format&fit=crop&w=1950&q=80', 'Source: Unsplash - Marek Szturc', 2),
  (105, 93, 'https://images.unsplash.com/photo-1513135724701-30343e546328?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=995&q=80', 'Source: Unsplash - Stephanie Harvey', 2),
  (106, 94, 'https://images.unsplash.com/photo-1513555633610-d912838b8ac5?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80', 'Source: Unsplash - Jye B', 2),
  (107, 95, 'https://images.unsplash.com/photo-1546868871-7041f2a55e12?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80', 'Source: Unsplash - Daniel Korpai', 2),
  (108, 96, 'https://images.unsplash.com/photo-1564466809058-bf4114d55352?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=933&q=80', 'Source: Unsplash - Varun Gaba', 2),
  (109, 97, 'https://images.unsplash.com/photo-1532667449560-72a95c8d381b?ixlib=rb-1.2.1&ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&auto=format&fit=crop&w=1950&q=80', 'Source: Unsplash - Marek Szturc', 2),
  (110, 98, 'https://images.unsplash.com/photo-1523027737707-96c0e1fd54e4?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=1567&q=80', 'Source: Unsplash - Tom Crew', 2),
  (111, 99, 'https://images.unsplash.com/photo-1523841662900-c1d9e94f0228?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80', 'Source: Unsplash - Martin Sanchez', 2),
  (112, 100, 'https://images.unsplash.com/photo-1535486607281-4fc90307a8bb?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80', 'Source: Unsplash - Vincent Branciforti', 2),
  (113, 101, 'https://images.unsplash.com/photo-1605034313761-73ea4a0cfbf3?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=1400&q=80', 'Source: Unsplash - Hipkicks', 2),
  (114, 102, 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80', 'Source: Unsplash - C D-X', 2),
  (115, 103, 'https://images.unsplash.com/photo-1491553895911-0055eca6402d?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=1400&q=80', 'Source: Unsplash - Imani Bahati', 2),
  (116, 104, 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=1400&q=80', 'Source: Unsplash - Giorgio Trovato', 2),
  (117, 105, 'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80', 'Source: Unsplash - Battlecreek Coffee Roasters', 2),
  (118, 106, 'https://images.unsplash.com/photo-1556228720-da4e85f25e15?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=938&q=80', 'Source: Unsplash - Curology', 2),
  (119, 107, 'https://images.unsplash.com/photo-1562986406-60c6ec23a800?ixid=MXwxMjA3fDB8MHxzZWFyY2h8MTU0fHxwcm9kdWN0fGVufDB8fDB8&ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60', 'Source: Unsplash - Priscilla Du Preez', 2),
  (120, 108, 'https://images.unsplash.com/photo-1513135724701-30343e546328?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=995&q=80', 'Source: Unsplash - Stephanie Harvey', 2),
  (121, 109, 'https://images.unsplash.com/photo-1513555633610-d912838b8ac5?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80', 'Source: Unsplash - Jye B', 2),
  (122, 110, 'https://images.unsplash.com/photo-1546868871-7041f2a55e12?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80', 'Source: Unsplash - Daniel Korpai', 2),
  (123, 111, 'https://images.unsplash.com/photo-1605034313761-73ea4a0cfbf3?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=1400&q=80', 'Source: Unsplash - Hipkicks', 2),
  (124, 112, 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80', 'Source: Unsplash - C D-X', 2),
  (125, 113, 'https://images.unsplash.com/photo-1491553895911-0055eca6402d?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=1400&q=80', 'Source: Unsplash - Imani Bahati', 2),
  (126, 114, 'https://images.unsplash.com/photo-1564077439888-928a90061fb3?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80', 'Source: Unsplash - The Creative Exchange', 2),
  (127, 115, 'https://images.unsplash.com/photo-1556767284-fd0dbf421a2d?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=1951&q=80', 'Source: Unsplash - Stefan Rodriguez', 2),
  (128, 116, 'https://images.unsplash.com/photo-1556228720-da4e85f25e15?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=938&q=80', 'Source: Unsplash - Curology', 2),
  (129, 117, 'https://images.unsplash.com/photo-1562986406-60c6ec23a800?ixid=MXwxMjA3fDB8MHxzZWFyY2h8MTU0fHxwcm9kdWN0fGVufDB8fDB8&ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60', 'Source: Unsplash - Priscilla Du Preez', 2),
  (130, 118, 'https://images.unsplash.com/photo-1513135724701-30343e546328?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=995&q=80', 'Source: Unsplash - Stephanie Harvey', 2),
  (131, 119, 'https://images.unsplash.com/photo-1513555633610-d912838b8ac5?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80', 'Source: Unsplash - Jye B', 2),
  (132, 120, 'https://images.unsplash.com/photo-1546868871-7041f2a55e12?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80', 'Source: Unsplash - Daniel Korpai', 2),
  (133, 121, 'https://images.unsplash.com/photo-1564466809058-bf4114d55352?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=933&q=80', 'Source: Unsplash - Varun Gaba', 2),
  (134, 122, 'https://images.unsplash.com/photo-1532667449560-72a95c8d381b?ixlib=rb-1.2.1&ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&auto=format&fit=crop&w=1950&q=80', 'Source: Unsplash - Marek Szturc', 2),
  (135, 123, 'https://images.unsplash.com/photo-1513135724701-30343e546328?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=995&q=80', 'Source: Unsplash - Stephanie Harvey', 2),
  (136, 124, 'https://images.unsplash.com/photo-1513555633610-d912838b8ac5?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80', 'Source: Unsplash - Jye B', 2),
  (137, 125, 'https://images.unsplash.com/photo-1546868871-7041f2a55e12?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80', 'Source: Unsplash - Daniel Korpai', 2),
  (138, 126, 'https://images.unsplash.com/photo-1564466809058-bf4114d55352?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=933&q=80', 'Source: Unsplash - Varun Gaba', 2),
  (139, 127, 'https://images.unsplash.com/photo-1532667449560-72a95c8d381b?ixlib=rb-1.2.1&ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&auto=format&fit=crop&w=1950&q=80', 'Source: Unsplash - Marek Szturc', 2),
  (140, 128, 'https://images.unsplash.com/photo-1523027737707-96c0e1fd54e4?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=1567&q=80', 'Source: Unsplash - Tom Crew', 2),
  (141, 129, 'https://images.unsplash.com/photo-1513555633610-d912838b8ac5?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80', 'Source: Unsplash - Jye B', 2),
  (142, 130, 'https://images.unsplash.com/photo-1546868871-7041f2a55e12?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80', 'Source: Unsplash - Daniel Korpai', 2);


SELECT pg_catalog.setval('public.product_images_id_seq', 143, true);


--
-- Add Product Meta to product_meta table & Update Sequence
-- Name: product_meta_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--
INSERT INTO "product_meta"
  ("id", "product_id", "title", "description")
VALUES
  (1, 1, 'furniture', 'indoor/outdoor furniture'),
  (2, 1, 'coffee table', 'furniture type'),
  (3, 1, 'natural', 'color'),

  (4, 2, 'furniture', 'indoor/outdoor furniture'),
  (5, 2, 'coffee table', 'furniture type'),
  (6, 2, 'glass', 'color'),

  (7, 3, 'furniture', 'indoor/outdoor furniture'),
  (8, 3, 'side table', 'furniture type'),
  (9, 3, 'white', 'color'),
  
  (10, 4, 'furniture', 'indoor/outdoor furniture'),
  (11, 4, 'side table', 'furniture type'),
  (12, 4, 'white', 'color'),

  (13, 5, 'furniture', 'indoor/outdoor furniture'),
  (14, 5, 'dining table', 'furniture type'),
  (15, 5, 'bar height', 'height'),
  (16, 5, 'natural', 'color'),

  (17, 6, 'furniture', 'indoor/outdoor furniture'),
  (18, 6, 'dining table', 'furniture type'),
  (19, 6, 'white', 'color'),

  (20, 7, 'furniture', 'indoor/outdoor furniture'),
  (21, 7, 'bar stool', 'furniture type'),
  (22, 7, 'natural', 'color'),

  (23, 8, 'furniture', 'indoor/outdoor furniture'),
  (24, 8, 'chair', 'furniture type'),
  (25, 8, 'white', 'color'),

  (26, 9, 'furniture', 'indoor/outdoor furniture'),
  (27, 9, 'couch', 'furniture type'),
  (28, 9, 'gray', 'color'),

  (29, 10, 'furniture', 'indoor/outdoor furniture'),
  (30, 10, 'loveseat', 'furniture type'),
  (31, 10, 'teal', 'color'),

  (32, 11, 'clothes', 'wearable products'),
  (33, 11, 'shoes', 'type'),
  (34, 11, 'blue', 'color'),

  (35, 12, 'art', 'decoration for your home'),
  (36, 12, 'contemporary', 'style'),
  (37, 12, 'orange', 'color'),

  (38, 13, 'furniture', 'indoor/outdoor furniture'),
  (39, 13, 'loveseat', 'furniture type'),
  (40, 13, 'teal', 'color'),

  (41, 14, 'clothes', 'wearable products'),
  (42, 14, 'shoes', 'type'),
  (43, 14, 'blue', 'color'),

  (44, 15, 'art', 'decoration for your home'),
  (45, 15, 'contemporary', 'style'),
  (46, 15, 'orange', 'color'),

  (47, 16, 'electronics', 'electronics'),
  (48, 16, 'camera', 'type'),

  (49, 17, 'home goods', 'products for you house'),
  (50, 17, 'ceramics', 'sub-category'),
  (51, 17, 'gray', 'color'),

  (52, 18, 'furniture', 'indoor/outdoor furniture'),
  (53, 18, 'loveseat', 'furniture type'),
  (54, 18, 'teal', 'color'),

  (55, 19, 'clothes', 'wearable products'),
  (56, 19, 'shoes', 'type'),
  (57, 19, 'blue', 'color'),

  (58, 20, 'art', 'decoration for your home'),
  (59, 20, 'contemporary', 'style'),
  (60, 20, 'orange', 'color'),

  (61, 21, 'electronics', 'electronics'),
  (62, 21, 'camera', 'type'),

  (63, 22, 'home goods', 'products for you house'),
  (64, 22, 'knives', 'sub-category'),

  (65, 23, 'home goods', 'products for you house'),
  (66, 23, 'ceramics', 'sub-category'),
  (67, 23, 'gray', 'color'),

  (68, 24, 'furniture', 'indoor/outdoor furniture'),
  (69, 24, 'loveseat', 'furniture type'),
  (70, 24, 'teal', 'color'),

  (71, 25, 'clothes', 'wearable products'),
  (72, 25, 'shoes', 'type'),
  (73, 25, 'blue', 'color'),

  (74, 26, 'art', 'decoration for your home'),
  (75, 26, 'contemporary', 'style'),
  (76, 26, 'orange', 'color'),

  (77, 27, 'electronics', 'electronics'),
  (78, 27, 'camera', 'type'),

  (79, 28, 'home goods', 'products for you house'),
  (80, 28, 'knives', 'sub-category'),

  (81, 29, 'home goods', 'products for you house'),
  (82, 29, 'ceramics', 'sub-category'),
  (83, 29, 'gray', 'color'),

  (84, 30, 'furniture', 'indoor/outdoor furniture'),
  (85, 30, 'loveseat', 'furniture type'),
  (86, 30, 'teal', 'color'),

  (87, 31, 'clothes', 'wearable products'),
  (88, 31, 'shoes', 'type'),
  (89, 31, 'blue', 'color'),

  (90, 32, 'art', 'decoration for your home'),
  (91, 32, 'contemporary', 'style'),
  (92, 32, 'orange', 'color'),

  (93, 33, 'electronics', 'electronics'),
  (94, 33, 'camera', 'type'),

  (95, 34, 'home goods', 'products for you house'),
  (96, 34, 'knives', 'sub-category'),

  (97, 35, 'home goods', 'products for you house'),
  (98, 35, 'ceramics', 'sub-category'),
  (99, 35, 'gray', 'color'),

  (100, 36, 'furniture', 'indoor/outdoor furniture'),
  (101, 36, 'loveseat', 'furniture type'),
  (102, 36, 'teal', 'color'),

  (103, 37, 'clothes', 'wearable products'),
  (104, 37, 'shoes', 'type'),
  (105, 37, 'blue', 'color'),

  (106, 38, 'art', 'decoration for your home'),
  (107, 38, 'contemporary', 'style'),
  (108, 38, 'orange', 'color'),

  (109, 39, 'electronics', 'electronics'),
  (110, 39, 'camera', 'type'),

  (111, 40, 'home goods', 'products for you house'),
  (112, 40, 'knives', 'sub-category'),

  (113, 41, 'home goods', 'products for you house'),
  (114, 41, 'ceramics', 'sub-category'),
  (115, 41, 'gray', 'color'),

  (116, 42, 'furniture', 'indoor/outdoor furniture'),
  (117, 42, 'loveseat', 'furniture type'),
  (118, 42, 'teal', 'color'),

  (119, 43, 'clothes', 'wearable products'),
  (120, 43, 'shoes', 'type'),
  (121, 43, 'blue', 'color'),

  (122, 44, 'art', 'decoration for your home'),
  (123, 44, 'contemporary', 'style'),
  (124, 44, 'orange', 'color'),

  (125, 45, 'electronics', 'electronics'),
  (126, 45, 'camera', 'type'),

  (127, 46, 'home goods', 'products for you house'),
  (128, 46, 'knives', 'sub-category'),

  (129, 47, 'home goods', 'products for you house'),
  (130, 47, 'ceramics', 'sub-category'),
  (131, 47, 'gray', 'color'),

  (132, 48, 'furniture', 'indoor/outdoor furniture'),
  (133, 48, 'loveseat', 'furniture type'),
  (134, 48, 'teal', 'color'),

  (135, 49, 'clothes', 'wearable products'),
  (136, 49, 'shoes', 'type'),
  (137, 49, 'blue', 'color'),

  (138, 50, 'art', 'decoration for your home'),
  (139, 50, 'contemporary', 'style'),
  (140, 50, 'orange', 'color'),

  (141, 51, 'electronics', 'electronics'),
  (142, 51, 'camera', 'type'),

  (143, 52, 'home goods', 'products for you house'),
  (144, 52, 'knives', 'sub-category'),

  (145, 53, 'home goods', 'products for you house'),
  (146, 53, 'ceramics', 'sub-category'),
  (147, 53, 'gray', 'color'),

  (148, 54, 'furniture', 'indoor/outdoor furniture'),
  (149, 54, 'loveseat', 'furniture type'),
  (150, 54, 'teal', 'color'),

  (151, 55, 'clothes', 'wearable products'),
  (152, 55, 'shoes', 'type'),
  (153, 55, 'blue', 'color'),

  (154, 56, 'art', 'decoration for your home'),
  (155, 56, 'contemporary', 'style'),
  (156, 56, 'orange', 'color'),

  (157, 57, 'electronics', 'electronics'),
  (158, 57, 'camera', 'type'),

  (159, 58, 'home goods', 'products for you house'),
  (160, 58, 'knives', 'sub-category'),

  (161, 59, 'home goods', 'products for you house'),
  (162, 59, 'ceramics', 'sub-category'),
  (163, 59, 'gray', 'color'),

  (164, 60, 'furniture', 'indoor/outdoor furniture'),
  (165, 60, 'loveseat', 'furniture type'),
  (166, 60, 'teal', 'color'),

  (167, 61, 'clothes', 'wearable products'),
  (168, 61, 'shoes', 'type'),
  (169, 61, 'blue', 'color'),

  (170, 62, 'art', 'decoration for your home'),
  (171, 62, 'contemporary', 'style'),
  (172, 62, 'orange', 'color'),

  (173, 63, 'electronics', 'electronics'),
  (174, 63, 'camera', 'type'),

  (175, 64, 'home goods', 'products for you house'),
  (176, 64, 'knives', 'sub-category'),

  (177, 65, 'home goods', 'products for you house'),
  (178, 65, 'ceramics', 'sub-category'),
  (179, 65, 'gray', 'color'),

  (180, 66, 'furniture', 'indoor/outdoor furniture'),
  (181, 66, 'loveseat', 'furniture type'),
  (182, 66, 'teal', 'color'),

  (183, 67, 'clothes', 'wearable products'),
  (184, 67, 'shoes', 'type'),
  (185, 67, 'blue', 'color'),

  (186, 68, 'art', 'decoration for your home'),
  (187, 68, 'contemporary', 'style'),
  (188, 68, 'orange', 'color'),

  (189, 69, 'electronics', 'electronics'),
  (190, 69, 'camera', 'type'),

  (191, 70, 'home goods', 'products for you house'),
  (192, 70, 'knives', 'sub-category'),

  (193, 71, 'home goods', 'products for you house'),
  (194, 71, 'ceramics', 'sub-category'),
  (195, 71, 'gray', 'color'),

  (196, 72, 'furniture', 'indoor/outdoor furniture'),
  (197, 72, 'loveseat', 'furniture type'),
  (198, 72, 'teal', 'color'),

  (199, 73, 'clothes', 'wearable products'),
  (200, 73, 'shoes', 'type'),
  (201, 73, 'blue', 'color'),

  (202, 74, 'art', 'decoration for your home'),
  (203, 74, 'contemporary', 'style'),
  (204, 74, 'orange', 'color'),

  (205, 75, 'electronics', 'electronics'),
  (206, 75, 'camera', 'type'),

  (207, 76, 'home goods', 'products for you house'),
  (208, 76, 'knives', 'sub-category'),

  (209, 77, 'home goods', 'products for you house'),
  (210, 77, 'ceramics', 'sub-category'),
  (211, 77, 'gray', 'color'),

  (212, 78, 'furniture', 'indoor/outdoor furniture'),
  (213, 78, 'loveseat', 'furniture type'),
  (214, 78, 'teal', 'color'),

  (215, 79, 'clothes', 'wearable products'),
  (216, 79, 'shoes', 'type'),
  (217, 79, 'blue', 'color'),

  (218, 80, 'art', 'decoration for your home'),
  (219, 80, 'contemporary', 'style'),
  (220, 80, 'orange', 'color'),

  (221, 81, 'electronics', 'electronics'),
  (222, 81, 'camera', 'type'),

  (223, 82, 'home goods', 'products for you house'),
  (224, 82, 'knives', 'sub-category'),

  (225, 83, 'home goods', 'products for you house'),
  (226, 83, 'ceramics', 'sub-category'),
  (227, 83, 'gray', 'color'),

  (228, 84, 'furniture', 'indoor/outdoor furniture'),
  (229, 84, 'loveseat', 'furniture type'),
  (230, 84, 'teal', 'color'),

  (231, 85, 'clothes', 'wearable products'),
  (232, 85, 'shoes', 'type'),
  (233, 85, 'blue', 'color'),

  (234, 86, 'art', 'decoration for your home'),
  (235, 86, 'contemporary', 'style'),
  (236, 86, 'orange', 'color'),

  (237, 87, 'electronics', 'electronics'),
  (238, 87, 'camera', 'type'),

  (239, 88, 'home goods', 'products for you house'),
  (240, 88, 'knives', 'sub-category'),

  (241, 89, 'home goods', 'products for you house'),
  (242, 89, 'ceramics', 'sub-category'),
  (243, 89, 'gray', 'color'),

  (244, 90, 'furniture', 'indoor/outdoor furniture'),
  (245, 90, 'loveseat', 'furniture type'),
  (246, 90, 'teal', 'color'),

  (247, 91, 'clothes', 'wearable products'),
  (248, 91, 'shoes', 'type'),
  (249, 91, 'blue', 'color'),

  (250, 92, 'art', 'decoration for your home'),
  (251, 92, 'contemporary', 'style'),
  (252, 92, 'orange', 'color'),

  (253, 93, 'electronics', 'electronics'),
  (254, 93, 'camera', 'type'),

  (255, 94, 'home goods', 'products for you house'),
  (256, 94, 'knives', 'sub-category'),

  (257, 95, 'home goods', 'products for you house'),
  (258, 95, 'ceramics', 'sub-category'),
  (259, 95, 'gray', 'color'),

  (260, 96, 'furniture', 'indoor/outdoor furniture'),
  (261, 96, 'loveseat', 'furniture type'),
  (262, 96, 'teal', 'color'),

  (263, 97, 'clothes', 'wearable products'),
  (264, 97, 'shoes', 'type'),
  (265, 97, 'blue', 'color'),

  (266, 98, 'art', 'decoration for your home'),
  (267, 98, 'contemporary', 'style'),
  (268, 98, 'orange', 'color'),

  (269, 99, 'electronics', 'electronics'),
  (270, 99, 'camera', 'type'),

  (271, 100, 'home goods', 'products for you house'),
  (272, 100, 'knives', 'sub-category');


SELECT pg_catalog.setval('public.product_meta_id_seq', 273, true);


--
-- Add Product Promotions to product_promotions table & Update Sequence
-- Name: product_promotions_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--
INSERT INTO "product_promotions"
  ("id", "product_id", "promotion_price", "active")
VALUES
  (1, 1, 10999, TRUE),
  (2, 5, 11599, TRUE),
  (3, 9, 49999, TRUE),
  (4, 13, 8999, TRUE),
  (5, 20, 3999, TRUE),
  (6, 27, 2599, TRUE),
  (7, 31, 9999, TRUE),
  (8, 37, 3099, TRUE),
  (9, 42, 2999, TRUE),
  (10, 44, 6999, TRUE),
  (11, 48, 2999, TRUE),
  (12, 52, 5999, TRUE),
  (13, 58, 8999, TRUE),
  (14, 59, 10999, TRUE),
  (15, 60, 9999, TRUE),
  (16, 61, 5599, TRUE),
  (17, 75, 6899, TRUE),
  (18, 80, 10599, TRUE),
  (19, 84, 1999, TRUE),
  (20, 88, 7999, TRUE),
  (21, 90, 2499, TRUE),
  (22, 99, 10499, TRUE),
  (23, 105, 4999, TRUE),
  (24, 116, 2499, TRUE),
  (25, 121, 6499, TRUE),
  (26, 129, 10499, TRUE);

SELECT pg_catalog.setval('public.product_promotions_id_seq', 27, true);


--
-- Add Product Coupons to product_coupons table & Update Sequence
-- Name: product_coupons_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--
INSERT INTO "product_coupons"
  ("id", "product_id", "code", "pct_discount", "active")
VALUES
  (1, 3, '20PCTOFF', 0.2, true),
  (2, 5, '20PCTOFF', 0.2, true),
  (3, 9, '25PCTOFF', 0.2, true);
SELECT pg_catalog.setval('public.product_coupons_id_seq', 4, true);


--
-- Add Product Modifiers to product_modifiers table & Update Sequence
-- Name: product_modifiers_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--
INSERT INTO "product_modifiers"
  ("id", "product_id", "name", "description")
VALUES
  (1, 8, 'Blue', 'Color'),
  (2, 8, 'Grey', 'Color'),
  (3, 8, 'White', 'Color'),
  (4, 8, 'Orange', 'Color'),
  (5, 9, 'Blue', 'Color'),
  (6, 9, 'Grey', 'Color'),
  (7, 9, 'White', 'Color'),
  (8, 9, 'Orange', 'Color'),
  (9, 10, 'Blue', 'Color'),
  (10, 10, 'Grey', 'Color'),
  (11, 10, 'White', 'Color'),
  (12, 10, 'Orange', 'Color'),
  (13, 20, 'Xtra-Small', 'Size'),
  (14, 20, 'Small', 'Size'),
  (15, 20, 'Medium', 'Size'),
  (16, 20, 'Large', 'Size'),
  (17, 20, 'Xtra-Large', 'Size'),
  (18, 30, 'Blue', 'Color'),
  (19, 30, 'Grey', 'Color'),
  (20, 30, 'White', 'Color'),
  (21, 30, 'Orange', 'Color'),
  (22, 40, 'Xtra-Small', 'Size'),
  (23, 40, 'Small', 'Size'),
  (24, 40, 'Medium', 'Size'),
  (25, 40, 'Large', 'Size'),
  (26, 40, 'Xtra-Large', 'Size'),
  (27, 50, 'Blue', 'Color'),
  (28, 50, 'Grey', 'Color'),
  (29, 50, 'White', 'Color'),
  (30, 50, 'Orange', 'Color'),
  (31, 60, 'Xtra-Small', 'Size'),
  (32, 60, 'Small', 'Size'),
  (33, 60, 'Medium', 'Size'),
  (34, 60, 'Large', 'Size'),
  (35, 60, 'Xtra-Large', 'Size'),
  (36, 70, 'Blue', 'Color'),
  (37, 70, 'Grey', 'Color'),
  (38, 70, 'White', 'Color'),
  (39, 70, 'Orange', 'Color'),
  (40, 80, 'Xtra-Small', 'Size'),
  (41, 80, 'Small', 'Size'),
  (42, 80, 'Medium', 'Size'),
  (43, 80, 'Large', 'Size'),
  (44, 80, 'Xtra-Large', 'Size'),
  (45, 90, 'Blue', 'Color'),
  (46, 90, 'Grey', 'Color'),
  (47, 90, 'White', 'Color'),
  (48, 90, 'Orange', 'Color'),
  (49, 100, 'Xtra-Small', 'Size'),
  (50, 100, 'Small', 'Size'),
  (51, 100, 'Medium', 'Size'),
  (52, 100, 'Large', 'Size'),
  (53, 100, 'Xtra-Large', 'Size'),
  (54, 110, 'Blue', 'Color'),
  (55, 110, 'Grey', 'Color'),
  (56, 110, 'White', 'Color'),
  (57, 110, 'Orange', 'Color'),
  (58, 120, 'Xtra-Small', 'Size'),
  (59, 120, 'Small', 'Size'),
  (60, 120, 'Medium', 'Size'),
  (61, 120, 'Large', 'Size'),
  (62, 120, 'Xtra-Large', 'Size'),
  (63, 130, 'Blue', 'Color'),
  (64, 130, 'Grey', 'Color'),
  (65, 130, 'White', 'Color'),
  (66, 130, 'Orange', 'Color');

SELECT pg_catalog.setval('public.product_modifiers_id_seq', 67, true);


--
-- Add Product Reviews to product_reviews table & Update Sequence
-- Name: product_reviews_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--
INSERT INTO "product_reviews"
  ("id", "product_id", "user_id", "rating", "title", "body", "review_dt")
VALUES
  (1, 1, 1, 5, 'This is an amazing product!', 'Best I have ever owned, its a beautiful product', '2020-12-03T15:00:00Z'),
  (2, 1, 2, 4, 'Pretty good, quality could be better.', 'Its a pretty nice, noticed a couple issues but they are not to noticeable.  Overall a good product', '2020-12-14T18:00:00Z'),
  (3, 3, 3, 3, 'Its Ok', 'Instructions for the product were poor, once setup it works alright.  My comparable product is nicer.', '2020-12-18T18:00:00Z'),
  (4, 8, 4, 5, 'This is an amazing product!', 'Best I have ever owned, its a beautiful product', '2020-12-03T15:00:00Z'),
  (5, 8, 5, 4, 'Pretty good, quality could be better.', 'Its a pretty nice, noticed a couple issues but they are not to noticeable.  Overall a good product', '2020-12-14T18:00:00Z'),
  (6, 8, 6, 3, 'Its Ok', 'Instructions for the product were poor, once setup it works alright.  My comparable product is nicer.', '2020-12-18T18:00:00Z'),
  (7, 9, 1, 3, 'Its Ok', 'Instructions for the product were poor, once setup it works alright.  My comparable product is nicer.', '2020-12-18T18:00:00Z'),
  (8, 12, 2, 5, 'This is an amazing product!', 'Best I have ever owned, its a beautiful product', '2020-12-03T15:00:00Z'),
  (9, 20, 3, 4, 'Pretty good, quality could be better.', 'Its a pretty nice, noticed a couple issues but they are not to noticeable.  Overall a good product', '2020-12-14T18:00:00Z'),
  (10, 25, 4, 3, 'Its Ok', 'Instructions for the product were poor, once setup it works alright.  My comparable product is nicer.', '2020-12-18T18:00:00Z'),
  (11, 30, 1, 5, 'This is an amazing product!', 'Best I have ever owned, its a beautiful product', '2020-12-03T15:00:00Z'),
  (12, 35, 2, 4, 'Pretty good, quality could be better.', 'Its a pretty nice, noticed a couple issues but they are not to noticeable.  Overall a good product', '2020-12-14T18:00:00Z'),
  (13, 40, 3, 3, 'Its Ok', 'Instructions for the product were poor, once setup it works alright.  My comparable product is nicer.', '2020-12-18T18:00:00Z'),
  (14, 45, 4, 5, 'This is an amazing product!', 'Best I have ever owned, its a beautiful product', '2020-12-03T15:00:00Z'),
  (15, 50, 5, 4, 'Pretty good, quality could be better.', 'Its a pretty nice, noticed a couple issues but they are not to noticeable.  Overall a good product', '2020-12-14T18:00:00Z'),
  (16, 55, 6, 3, 'Its Ok', 'Instructions for the product were poor, once setup it works alright.  My comparable product is nicer.', '2020-12-18T18:00:00Z'),
  (17, 60, 1, 5, 'This is an amazing product!', 'Best I have ever owned, its a beautiful product', '2020-12-03T15:00:00Z'),
  (18, 65, 2, 4, 'Pretty good, quality could be better.', 'Its a pretty nice, noticed a couple issues but they are not to noticeable.  Overall a good product', '2020-12-14T18:00:00Z'),
  (19, 70, 3, 3, 'Its Ok', 'Instructions for the product were poor, once setup it works alright.  My comparable product is nicer.', '2020-12-18T18:00:00Z'),
  (20, 75, 4, 5, 'This is an amazing product!', 'Best I have ever owned, its a beautiful product', '2020-12-03T15:00:00Z'),
  (21, 80, 5, 4, 'Pretty good, quality could be better.', 'Its a pretty nice, noticed a couple issues but they are not to noticeable.  Overall a good product', '2020-12-14T18:00:00Z'),
  (22, 85, 6, 3, 'Its Ok', 'Instructions for the product were poor, once setup it works alright.  My comparable product is nicer.', '2020-12-18T18:00:00Z'),
  (23, 90, 1, 5, 'This is an amazing product!', 'Best I have ever owned, its a beautiful product', '2020-12-03T15:00:00Z'),
  (24, 95, 2, 4, 'Pretty good, quality could be better.', 'Its a pretty nice, noticed a couple issues but they are not to noticeable.  Overall a good product', '2020-12-14T18:00:00Z'),
  (25, 100, 3, 3, 'Its Ok', 'Instructions for the product were poor, once setup it works alright.  My comparable product is nicer.', '2020-12-18T18:00:00Z'),
  (26, 105, 4, 5, 'This is an amazing product!', 'Best I have ever owned, its a beautiful product', '2020-12-03T15:00:00Z'),
  (27, 110, 5, 4, 'Pretty good, quality could be better.', 'Its a pretty nice, noticed a couple issues but they are not to noticeable.  Overall a good product', '2020-12-14T18:00:00Z'),
  (28, 115, 6, 3, 'Its Ok', 'Instructions for the product were poor, once setup it works alright.  My comparable product is nicer.', '2020-12-18T18:00:00Z'),
  (29, 120, 1, 5, 'This is an amazing product!', 'Best I have ever owned, its a beautiful product', '2020-12-03T15:00:00Z'),
  (30, 125, 2, 4, 'Pretty good, quality could be better.', 'Its a pretty nice, noticed a couple issues but they are not to noticeable.  Overall a good product', '2020-12-14T18:00:00Z'),
  (31, 130, 3, 3, 'Its Ok', 'Instructions for the product were poor, once setup it works alright.  My comparable product is nicer.', '2020-12-18T18:00:00Z');

SELECT pg_catalog.setval('public.product_reviews_id_seq', 32, true);


--
-- Add Product Featured to products_featured table & Update Sequence
-- Name: products_featured_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--
INSERT INTO "products_featured"
  ("id", "product_id", "merchant_id", "feature_set", "site_wide")
VALUES
-- Global Features
  (1, 8, NULL, 'top picks', TRUE),
  (2, 9, NULL, 'top picks', TRUE),
  (3, 10, NULL, 'top picks', TRUE),
  (4, 25, NULL, 'top picks', TRUE),
  (5, 55, NULL, 'top picks', TRUE),
  (6, 100, NULL, 'top picks', TRUE),
  (7, 105, NULL, 'top picks', TRUE),
-- Merchant Features
  (8, 6, 1, 'favorites', FALSE),
  (9, 8, 1, 'favorites', FALSE),
  (10, 13, 2, 'favorites', FALSE),
  (11, 17, 2, 'favorites', FALSE),
  (12, 19, 2, 'favorites', FALSE),
  (13, 33, 5, 'favorites', FALSE),
  (14, 38, 5, 'favorites', FALSE),
  (15, 62, 10, 'favorites', FALSE),
  (16, 66, 10, 'favorites', FALSE),
  (17, 70, 10, 'favorites', FALSE),
  (18, 73, 10, 'favorites', FALSE),
  (19, 94, 15, 'favorites', FALSE),
  (20, 99, 15, 'favorites', FALSE),
  (21, 100, 15, 'favorites', FALSE),
  (22, 128, 20, 'favorites', FALSE),
  (23, 129, 20, 'favorites', FALSE);

SELECT pg_catalog.setval('public.products_featured_id_seq', 24, true);


--
-- Add Gatherings to gatherings table & Update Sequence
-- Name: gatherings_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--
INSERT INTO "gatherings"
  ("id", "merchant_id", "title", "description", "link", "gathering_dt")
VALUES
  (1, 1, 'Meet The Team', 'Meet the people behind our products', 'https://fakeMeetingProvider.com/abc123', '2021-02-01T18:00:00Z'),
  (2, 2, 'Meet The Team', 'Meet the people behind our products', 'https://fakeMeetingProvider.com/abc123', '2021-02-04T18:00:00Z'),
  (3, 3, 'Meet The Team', 'Meet the people behind our products', 'https://fakeMeetingProvider.com/abc123', '2021-03-10T18:00:00Z'),
  (4, 4, 'Meet The Team', 'Meet the people behind our products', 'https://fakeMeetingProvider.com/abc123', '2021-05-28T18:00:00Z'),
  (5, 5, 'Meet The Team', 'Meet the people behind our products', 'https://fakeMeetingProvider.com/abc123', '2021-01-13T18:00:00Z'),
  (6, 6, 'Meet The Team', 'Meet the people behind our products', 'https://fakeMeetingProvider.com/abc123', '2021-07-01T18:00:00Z'),
  (7, 7, 'Meet The Team', 'Meet the people behind our products', 'https://fakeMeetingProvider.com/abc123', '2021-12-11T18:00:00Z'),
  (8, 8, 'Meet The Team', 'Meet the people behind our products', 'https://fakeMeetingProvider.com/abc123', '2021-11-11T18:00:00Z'),
  (9, 9, 'Meet The Team', 'Meet the people behind our products', 'https://fakeMeetingProvider.com/abc123', '2021-12-18T18:00:00Z'),
  (10, 10, 'Meet The Team', 'Meet the people behind our products', 'https://fakeMeetingProvider.com/abc123', '2021-12-05T18:00:00Z'),
  (11, 11, 'Meet The Team', 'Meet the people behind our products', 'https://fakeMeetingProvider.com/abc123', '2021-12-01T18:00:00Z'),
  (12, 12, 'Meet The Team', 'Meet the people behind our products', 'https://fakeMeetingProvider.com/abc123', '2021-12-08T18:00:00Z'),
  (13, 13, 'Meet The Team', 'Meet the people behind our products', 'https://fakeMeetingProvider.com/abc123', '2021-12-12T18:00:00Z'),
  (14, 14, 'Meet The Team', 'Meet the people behind our products', 'https://fakeMeetingProvider.com/abc123', '2021-05-03T18:00:00Z'),
  (15, 15, 'Meet The Team', 'Meet the people behind our products', 'https://fakeMeetingProvider.com/abc123', '2021-12-04T18:00:00Z'),
  (16, 16, 'Meet The Team', 'Meet the people behind our products', 'https://fakeMeetingProvider.com/abc123', '2021-12-03T18:00:00Z'),
  (17, 17, 'Meet The Team', 'Meet the people behind our products', 'https://fakeMeetingProvider.com/abc123', '2021-06-14T18:00:00Z'),
  (18, 18, 'Meet The Team', 'Meet the people behind our products', 'https://fakeMeetingProvider.com/abc123', '2021-12-13T18:00:00Z'),
  (19, 19, 'Meet The Team', 'Meet the people behind our products', 'https://fakeMeetingProvider.com/abc123', '2021-12-18T18:00:00Z'),
  (20, 20, 'Meet The Team', 'Meet the people behind our products', 'https://fakeMeetingProvider.com/abc123', '2021-01-28T18:00:00Z'),
  (21, 1, 'Creator Commune', 'Design the Next Big Thing with Us', 'https://fakeMeetingProvider.com/abc123', '2021-02-28T18:00:00Z');

SELECT pg_catalog.setval('public.gatherings_id_seq', 22, true);


--
-- Add Gatherings Merchants to gathering_merchants table & Update Sequence
-- Name: gathering_merchants_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--
INSERT INTO "gathering_merchants"
  ("id", "gathering_id", "merchant_id")
VALUES
  (1, 1, 1),
  (2, 2, 2),
  (3, 3 ,3),
  (4, 4, 4),
  (5, 5, 5),
  (6, 6, 6),
  (7, 7, 7),
  (8, 8, 8),
  (9, 9, 9),
  (10, 10, 10),
  (11, 11, 11),
  (12, 12, 12),
  (13, 13, 13),
  (14, 14, 14),
  (15, 15, 15),
  (16, 16, 16),
  (17, 17, 17),
  (18, 18, 18),
  (19, 19, 19),
  (20, 20, 20),
  (21, 21, 1),
  (22, 21, 4),
  (23, 21, 7),
  (24, 21, 15),
  (25, 21, 20);

SELECT pg_catalog.setval('public.gathering_merchants_id_seq', 26, true);
